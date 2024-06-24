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

    const doc = {
      criminalRecord: {
        year: ref(''),
        status: ref(0)
      },
      selfCommitment: {
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
    .then(function(response) {
      doc.criminalRecord.year.value = response.data.criminalRecord
      doc.selfCommitment.year.value = response.data.selfCommitment
      doc.criminalRecord.status.value = settings.currentYear < (response.data.criminalRecord + 5) || response.data.criminalRecord == settings.currentYear - 2000
      doc.selfCommitment.status.value = settings.currentYear < (response.data.selfCommitment + 5)
      loading.value = false;
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
