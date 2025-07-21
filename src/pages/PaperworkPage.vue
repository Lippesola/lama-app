<template>

  <div class="q-pa-md text-h4">
    Papierkram
    <q-btn
      v-if="$permissions.userDocument"
      flat
      color="primary"
      icon="fa-solid fa-users"
      text-color="primary"
      :to="'/l/paperworkOverview'"
    />
  </div>
  <div class="q-px-md">
    <div class="q-gutter-md q-pb-md row" v-show="loading">
      <q-spinner
        color="primary"
        size="2em"
      />
      <span>Deine Daten werden noch geladen..</span>
    </div>
    <div class="q-py-md">
      <div class="q-py-md text-h5">
        <q-icon v-show="doc.criminalRecord.status.value && !loading" name="fa-solid fa-check" color="green" />
        <q-icon v-show="!doc.criminalRecord.status.value && !loading" name="fa-solid fa-times" color="red" />
        Führungszeugnis
      </div>
      <div class="text-body1 q-pb-md">
        Dein Führungszeugnis muss spätestens alle 5 Jahre einmal vorgezeigt werden. Beim Vorzeigen darf es nicht älter als 3 Monate sein. Weitere Infos findest du im
        <q-btn
          flat
          dense
          label="Mitarbeiter A-Z"
          color="primary"
          href="https://a-z.lippesola.de/doc/informationen-zum-thema-erweitertes-fuhrungszeugnis-MjS4xxTxBd"
        />
      </div>
      <div v-if="doc.criminalRecord.year.value && doc.criminalRecord.year.value >= 2000" class="text-body1">Du hast dein Führungszeugnis das letzte Mal {{ doc.criminalRecord.year.value }} vorgezeigt.</div>
      <div v-if="doc.criminalRecord.year.value && doc.criminalRecord.year.value < 2000" class="text-body1">Du hast 20{{ doc.criminalRecord.year.value }} eine Selbsverpflichtungserklärung unterschrieben. Diese ist nur ein Jahr lang gültig.</div>
      <div v-if="doc.criminalRecord.status.value" class="text-body1">Du musst hier nichts weiter machen.</div>
      <div v-if="!doc.criminalRecord.status.value" class="text-body1">Bitte zeige ein Führungszeugnis, was nicht älter als drei Monate ist, bis zum SOLA vor.</div>
      <q-btn
        @click="getLetter()"
        label="Antrag herunterladen"
        color="primary"
        class="q-mt-md"
      />
    </div>

    <div class="q-py-md">
      <div class="q-py-md text-h5">
        <q-icon v-show="doc.selfCommitment.status.value && !loading" name="fa-solid fa-check" color="green" />
        <q-icon v-show="!doc.selfCommitment.status.value && !loading" name="fa-solid fa-times" color="red" />
        Verhaltenskodex
      </div>
      <div class="text-body1 q-pb-md">Auch der Verhaltenskodex muss spätestens alle 5 Jahre unterschrieben abgegeben werden. Weitere Infos findest du im
        <q-btn
          flat
          dense
          label="Mitarbeiter A-Z"
          color="primary"
          href="https://a-z.lippesola.de/doc/verhaltenskodex-th7qatXUkb"
        />
      </div>
      <div v-if="doc.selfCommitment.year.value" class="text-body1">Dein letzter Verhaltenskodex ist aus dem Jahr {{ doc.selfCommitment.year.value }}.</div>
      <div v-if="doc.selfCommitment.status.value" class="text-body1">Du musst hier nichts weiter machen.</div>
      <div v-if="!doc.selfCommitment.status.value" class="text-body1">Bitte gib bis zum SOLA einen aktuellen unterschriebenen Verhaltenskodex ab.</div>
    </div>

    <div class="q-py-md">
      <div class="q-py-md text-h5">
        <q-icon v-show="doc.privacyCommitment.status.value && !loading" name="fa-solid fa-check" color="green" />
        <q-icon v-show="!doc.privacyCommitment.status.value && !loading" name="fa-solid fa-times" color="red" />
        Datenschutz
      </div>
      <div class="text-body1 q-pb-md">Die Verpflichtung auf Vertraulichkeit muss jedes Jahr von dir unterschrieben abgegeben werden.</div>
      <div v-if="doc.privacyCommitment.year.value" class="text-body1">Dein letzter Datenschutz ist aus dem Jahr {{ doc.privacyCommitment.year.value }}.</div>
      <div v-if="doc.privacyCommitment.status.value" class="text-body1">Du musst hier nichts weiter machen.</div>
      <div v-if="!doc.privacyCommitment.status.value" class="text-body1">Bitte gib bis zum SOLA einen aktuellen unterschriebenen Zettel ab. Den zu unterschreibenden Zettel findest du im
        <q-btn
          flat
          dense
          label="Mitarbeiter A-Z"
          color="primary"
          href="https://a-z.lippesola.de/doc/datenschutz-Bg3UZsv0L7"
        />
      </div>
    </div>

    <div class="q-py-md" v-if="underage">
      <div class="q-py-md text-h5">
        <q-icon v-show="doc.parentalConsent.status.value && !loading" name="fa-solid fa-check" color="green" />
        <q-icon v-show="!doc.parentalConsent.status.value && !loading" name="fa-solid fa-times" color="red" />
        U18-Zettel
      </div>
      <div class="text-body1 q-pb-md">Der U18-Zettel muss von einem Erziehungsberechtigten unterschrieben werden, wenn du zum Zeitpunkt des SOLA jünger als 18 Jahre alt bist.</div>
      <div v-if="doc.parentalConsent.status.value" class="text-body1">Du musst hier nichts weiter machen.</div>
      <div v-if="!doc.parentalConsent.status.value" class="text-body1">Bitte gib bis zum SOLA einen unterschriebenen U18-Zettel ab.</div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import moment from 'moment'
export default {
  name: 'PaperworkPage',

  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const c = proxy.$constants
    const uuid = proxy.$keycloak.tokenParsed.sub
    const settings = proxy.$settings;
    const underage = ref(false)

    const doc = {
      criminalRecord: {
        year: ref(''),
        status: ref(0)
      },
      selfCommitment: {
        year: ref(''),
        status: ref(0)
      },
      parentalConsent: {
        year: ref(''),
        status: ref(0)
      },
      privacyCommitment: {
        year: ref(''),
        status: ref(0)
      }
    }
    const loading = ref(true)

    function getLetter() {
      api.get('/userCriminalRecord/' + uuid, {
        responseType: 'blob'
      }).then((response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', "AntragFuehrungszeugnis.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }).catch((e) => {
        console.log(e);
      })
    }

    api.get('/userDocument/' + uuid)
    .then(function(userDocumentResponse) {
      api.get('/user/' + uuid)
      .then(function(userResponse) {
        doc.criminalRecord.year.value = userDocumentResponse.data.criminalRecord
        doc.selfCommitment.year.value = userDocumentResponse.data.selfCommitment
        doc.criminalRecord.status.value = settings.currentYear < (userDocumentResponse.data.criminalRecord + 5) || userDocumentResponse.data.criminalRecord == settings.currentYear - 2000
        doc.selfCommitment.status.value = settings.currentYear < (userDocumentResponse.data.selfCommitment + 5)
        doc.privacyCommitment.year.value = userDocumentResponse.data.privacyCommitment
        doc.privacyCommitment.status.value = settings.currentYear < (userDocumentResponse.data.privacyCommitment + 1)
        if (moment(c.events.teens.start).diff(moment(userResponse.data.birthday), 'years') < 18) {
          underage.value = true
          doc.parentalConsent.status.value = settings.currentYear < (userDocumentResponse.data.parentalConsent + 1 )
        }
        loading.value = false;
      })
    }).catch(function(e){
      if (e.response.status === 404) {
        loading.value = false;
      } else {
        $q.notify({
          message: 'Ein Fehler ist aufgetreten. Bitte versuche es später noch einmal.',
          color: 'red',
          icon: 'fa-solid fa-circle-xmark'
        })
      }
    })
    return {
      loading,
      doc,
      getLetter
    }
  }

}
</script>
