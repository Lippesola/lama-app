<template>
  <q-page class="flex flex-center">
    <div class="col-sm-6" style="max-width: 768px;">
      <div class="q-pa-md">
        <div class="q-py-md text-h4">Motivationsbogen abgeben</div>
          <div class="q-pb-md text-body1">
            Um mit deiner Anmeldung fortfahren zu können, benötigen wir einen ausgefüllten Motivationsbogen von dir.
            Du kannst ihn auf dieser Seite runterladen, bearbeiten und wieder hochladen.
            Für die Bearbeitung am Computer, brauchst du ein PDF-Reader (bspw Acrobat Reader).
            Oft kann dein Browser die Bearbeitung aber auch direkt übernehmen.
            Alternativ kannst du natürlich auch die PDF ausdrucken und handschriftlich ausfüllen.
          </div>
          <q-separator class="q-ma-md"/>
          <div class="q-py-md text-h5">Motivationsbogen herunterladen</div>
          <div class="text-body1">
            Wenn du bislang keinmal oder einmal Mitarbeiter auf dem Sola gewesen bist (Jahre als Teeniehelfer nicht mitgerechnet), dann lade dir bitte folgenden Motivationsbogen herunter
          </div>
          <q-btn
          label="Motivationsbogen (PDF)"
          color="primary"
          class="q-ma-md"
          :href="$settings.motivationDefault"
          />
          <div class="q-pt-md text-body1">
            Wenn du bislang <strong>mindestens zwei Mal</strong> Mitarbeiter auf dem Sola gewesen bist (Jahre als Teeniehelfer nicht mitgerechnet), dann verwende bitte den folgenden MVB für „alte Hasen“:          </div>
          <q-btn
            label="Motivationsbogen für alte Hasen (PDF)"
            color="primary"
            class="q-ma-md"
            :href="$settings.motivationExperts"
          />
          <q-separator class="q-ma-md"/>
          <div class="q-py-md text-h5">Motivationsbogen hochladen</div>
          <q-file
            v-model="mvb"
            outlined
            label="Dateien durchsuchen..."
            accept=".pdf"
          />
          <q-btn
            label="MVB hochladen"
            color="primary"
            class="q-ma-md"
            :disable="mvb === ''"
            @click="handleUpload()"
          />
        </div>
      </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MotivationPage',
  props: {
    registrationFlow: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$keycloak.tokenParsed.sub
    const api = proxy.$api
    const settings = proxy.$settings
    const mvb = ref('')
    function handleUpload() {
      const formData = new FormData()
      formData.append('file', mvb.value, 'mvb.pdf')
      api.post("/userMotivation/" + uuid + '/' + settings.currentYear, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(function() {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'fa-solid fa-check',
          message: 'Motivationsbogen wurde hochgeladen'
        })
        if (props.registrationFlow) {
          location.href='/r/'
        }
      })
      .catch(function() {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'fa-solid fa-circle-xmark ',
          message: 'Fehler'
        })
      })
    }
    return {
      handleUpload,
      mvb
    }
  }
})
</script>
