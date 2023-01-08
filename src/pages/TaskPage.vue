<template>

  <div class="q-pa-md text-h4">Todos</div>
  <div class="q-pa-md">
    <div class="q-gutter-md q-pb-md row" v-show="loading">
      <q-spinner
        color="primary"
        size="2em"
      />
      <span>Deine Daten werden noch geladen..</span>
    </div>
    <div class="q-py-md">
      <div class="q-py-md text-h5">
        <q-icon v-show="tasks.criminalRecord.status.value === 1" name="fa-solid fa-check" color="green" />
        <q-icon v-show="tasks.criminalRecord.status.value === 0" name="fa-solid fa-times" color="red" />
        Führungszeugnis
      </div>
      <div class="text-body1">
        Dein Führungszeugnis muss spätestens alle 5 Jahre einmal vorgezeigt werden. Beim Vorzeigen darf es nicht älter als 3 Monate sein. Weitere Infos findest du im
        <q-btn
          flat
          dense
          label="Mitarbeiter A-Z"
          color="primary"
          href="https://a-z.lippesola.de/Fuehrungszeugnis.html"
        />
      </div>
      <div v-if="tasks.criminalRecord.date.value !== ''" class="text-body1">Du hast dein Führungszeugnis das letzte Mal am {{ tasks.criminalRecord.date.value }} vorgezeigt.</div>
    </div>

    <div class="q-py-md">
      <div class="q-py-md text-h5">
        <q-icon v-show="tasks.selfCommitment.status.value === 1" name="fa-solid fa-check" color="green" />
        <q-icon v-show="tasks.selfCommitment.status.value === 0" name="fa-solid fa-times" color="red" />
        Verhaltenskodex
      </div>
      <div class="text-body1">Auch der Verhaltenskodex muss spätestens alle 5 Jahre unterschrieben abgegeben werden. Weitere Infos findest du im
        <q-btn
          flat
          dense
          label="Mitarbeiter A-Z"
          color="primary"
          href="https://a-z.lippesola.de/Verhaltenskodex.html"
        />
      </div>
      <div v-if="tasks.selfCommitment.date.value !== ''" class="text-body1">Dein letzter Verhaltenskodex ist vom {{ tasks.selfCommitment.date.value }}.</div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import moment from 'moment'
export default {
  name: 'TaskPage',

  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$keycloak.tokenParsed.sub

    const tasks = {
      criminalRecord: {
        date: ref(''),
        status: ref('')
      },
      selfCommitment: {
        date: ref(''),
        status: ref('')
      }
    }
    const loading = ref(true)

    api.get('/userTask?uuid=' + uuid)
    .then(function(response) {
      response.data.map(function(res){
        tasks[res.task]['date']['value'] = new moment(res.date).format('DD.MM.YYYY')
        tasks[res.task]['status']['value'] = res.status
      })
      loading.value = false;
    }).catch(function(e){console.log(e)})
    return {
      loading,
      tasks
    }
  }
  
}
</script>
