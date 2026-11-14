<template>
  <div class="q-pa-md text-h4">Admin-Bereich</div>

  <div v-if="!isAdmin" class="q-pa-md">Dafür fehlt dir die Berechtigung.</div>

  <div v-else class="q-pa-md" style="max-width: 900px">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h5">Jahreswechsel</div>
        <div v-if="state" class="text-subtitle2">
          SOLA {{ state.currentYear }} &rarr; SOLA {{ state.newYear }}
        </div>
      </q-card-section>

      <q-inner-loading :showing="loading" />

      <q-card-section v-if="state">
        <div class="text-subtitle1 q-mb-sm">1. Neue Termine {{ state.newYear }}</div>
        <div v-for="event in events" :key="event.id" class="row q-col-gutter-md q-mb-sm items-center">
          <div class="col-12 col-sm-3">{{ eventLabels[event.id] || event.id }}</div>
          <div class="col-6 col-sm-4">
            <q-input v-model="event.start" type="date" outlined dense label="Von" stack-label
              :hint="event.oldStart ? 'Bisher: ' + event.oldStart : ''" />
          </div>
          <div class="col-6 col-sm-4">
            <q-input v-model="event.end" type="date" outlined dense label="Bis" stack-label
              :hint="event.oldEnd ? 'Bisher: ' + event.oldEnd : ''" />
          </div>
        </div>
        <div class="text-caption q-mt-sm">
          Unter den Feldern steht jeweils der bisherige Termin. Termine, die es bisher gab, müssen neu eingetragen werden.
          Termine ohne bisheriges Datum dürfen leer bleiben.
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="state">
        <q-banner class="bg-orange-2 text-black q-mb-md" rounded>
          Nicht vergessen: Die Mailinglisten <b>team{{ state.newYear }}@</b> und <b>helfer{{ state.newYear }}@</b>
          müssen manuell angelegt werden (Mailgun). Das macht das System nicht automatisch.
        </q-banner>
        <div class="text-subtitle1 q-mb-sm">2. Zurückgesetzte Dokumente</div>
        <div class="q-mb-sm">
          Ein Dokument bleibt nur erhalten, wenn die Person in <b>jedem</b> Jahr zwischen Abgabe und {{ state.newYear }}
          freigeschaltet war. Wer z. B. 2025 abgegeben hat, 2026 aber nicht dabei war, muss es für 2027 neu abgeben.
        </div>
        <div v-if="!state.documentResets.length">Es müssen keine Dokumente zurückgesetzt werden.</div>
        <q-list v-else bordered separator dense>
          <q-item v-for="entry in state.documentResets" :key="entry.uuid">
            <q-item-section>{{ entry.name }}</q-item-section>
            <q-item-section>
              <span v-if="entry.reset.length">Zurücksetzen: {{ entry.reset.map(d => docLabels[d]).join(', ') }}</span>
              <span v-if="entry.skipped.length" class="text-warning">
                Unplausibler Jahreswert (nicht angefasst): {{ entry.skipped.map(d => docLabels[d]).join(', ') }}
              </span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions v-if="state" class="q-pa-md">
        <q-btn color="negative" label="Jahreswechsel durchführen" :loading="saving" :disable="!eventsComplete" @click="confirm = true" />
        <span v-if="!eventsComplete" class="q-ml-md text-caption">Bitte zuerst alle Termine eintragen.</span>
      </q-card-actions>
    </q-card>

    <q-dialog v-model="confirm">
      <q-card>
        <q-card-section class="text-h6">Jahreswechsel auf {{ state?.newYear }}?</q-card-section>
        <q-card-section>
          Das Jahr wird umgestellt, die Termine überschrieben und
          {{ resetUserCount }} Person(en) bekommen Dokumente zurückgesetzt. Du selbst wirst für {{ state?.newYear }} direkt freigeschaltet.
          Das lässt sich nicht automatisch rückgängig machen.
          <div class="q-mt-md text-weight-bold">
            Danach bitte die Mailinglisten team{{ state?.newYear }}@ und helfer{{ state?.newYear }}@ anlegen!
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" v-close-popup />
          <q-btn color="negative" label="Jetzt durchführen" v-close-popup @click="perform" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import moment from 'moment'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const { proxy } = getCurrentInstance()
const isAdmin = !!proxy.$keycloak.tokenParsed.groups?.includes('admin')

const eventLabels = {
  prebuild: 'Voraufbau',
  prepare1: '1. Vorbereitungswochenende',
  prepare2: '2. Vorbereitungswochenende',
  prepare3: '3. Vorbereitungswochenende',
  training: 'Schulungstage',
  build: 'Aufbau',
  teens: 'Teens-SOLA',
  kids: 'Kids-SOLA',
  cleanup: 'Abbau',
}
const docLabels = {
  criminalRecord: 'Führungszeugnis',
  selfCommitment: 'Verhaltenskodex',
  privacyCommitment: 'Datenschutz',
  parentalConsent: 'U18-Zettel',
}

const loading = ref(false)
const saving = ref(false)
const confirm = ref(false)
const state = ref(null)
const events = ref([])

const resetUserCount = computed(() => state.value?.documentResets.filter(e => e.reset.length).length ?? 0)

// every event that had dates so far needs new dates (start and end together)
const eventsComplete = computed(() => events.value.every(e =>
  (e.oldStart ? !!e.start && !!e.end : true) && !!e.start === !!e.end
))

function notifyError(message) {
  $q.notify({ color: 'red-4', textColor: 'white', icon: 'circle-xmark', message })
}

async function load() {
  loading.value = true
  try {
    const { data } = await api.get('/admin/yearChange')
    state.value = data
    events.value = data.events.map(e => ({
      id: e.id,
      location: e.location,
      start: '',
      end: '',
      oldStart: e.start ? moment(e.start).format('DD.MM.YYYY') : '',
      oldEnd: e.end ? moment(e.end).format('DD.MM.YYYY') : '',
    }))
  } catch {
    notifyError('Daten konnten nicht geladen werden')
  } finally {
    loading.value = false
  }
}

async function perform() {
  saving.value = true
  try {
    const { data } = await api.post('/admin/yearChange', {
      year: state.value.newYear,
      events: events.value.map(e => ({ id: e.id, location: e.location, start: e.start || null, end: e.end || null })),
    })
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'check',
      message: `SOLA ${data.year} gestartet, ${data.usersWithResetDocuments} Person(en) mit zurückgesetzten Dokumenten`,
      timeout: 8000,
    })
    $q.notify({
      color: 'orange-6',
      textColor: 'white',
      icon: 'envelope',
      message: `Bitte jetzt die Mailinglisten team${data.year}@ und helfer${data.year}@ anlegen!`,
      timeout: 10000,
    })
    setTimeout(() => window.location.reload(), 10000)
  } catch (e) {
    const errors = e.response?.data?.errors
    notifyError(errors ? errors.join(' | ') : 'Jahreswechsel fehlgeschlagen')
    saving.value = false
  }
}

if (isAdmin) load()
</script>
