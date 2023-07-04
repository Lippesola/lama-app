<template>
  <ImageDialog
    v-model="dialog"
    :img="avatar"
    :title="(user.nickname || user.firstName) + ' ' + user.lastName"
  />
  
  <div class="q-pa-lg text-h4">
    <div class="q-gutter-md q-pb-md row" v-show="loading">
      <q-spinner
        color="primary"
        size="2em"
      />
      <span>Profil wird geladen..</span>
    </div>
    <q-avatar v-if="!avatar" rounded size="48px" color="primary" text-color="white" icon="fa-solid fa-user"></q-avatar>
    <q-avatar v-if="avatar" rounded size="48px" color="primary" text-color="white">
      <img class="cursor-pointer" :src="avatar" @click="dialog = true" />
    </q-avatar>
    <span class="q-pl-md"> {{ name }} </span>
    <div v-if="$keycloak.tokenParsed.groups.includes($settings.currentYear + '_LT')">
      <q-btn
        flat
        icon="fa-solid fa-pencil"
        text-color="primary"
        >
          <q-menu>
            <q-list>
              <q-item clickable :to="'/l/profile/' + uuid + '/edit'" v-close-popup>
                <q-item-section>Allgemeines Profil</q-item-section>
              </q-item>
              <q-item clickable :to="'/l/engagement/' + uuid + '/edit'" v-close-popup>
                <q-item-section>Mitarbeit auf dem SOLA</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="addDocument('criminalRecord')">
                <q-item-section>Führungszeugnis</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="addDocument('selfCommitment')">
                <q-item-section>Verhaltenskodex</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
      </q-btn>
      <q-btn
        flat
        color=""
        icon="fa-solid fa-campground"
        text-color="primary"
        :to="'/l/engagement/' + user.uuid"
      />
      <q-btn
        flat
        icon="fa-solid fa-file-lines"
        text-color="primary"
        @click="getMotivation()"
      />
      <q-btn
        flat
        icon="fa-solid fa-handcuffs"
        text-color="primary"
        @click="getCriminalRecord()"
      />
    </div>
  </div>
  <q-list>
    <ContactItem
      v-for="item in itemList"
      :key="item"
      v-bind="item"
    />
  </q-list>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import 'vue-advanced-cropper/dist/style.css';
import ContactItem from 'src/components/UserDetailItem.vue'
import ImageDialog from 'src/components/ImageDialog.vue'
import moment from 'moment'
export default {
  name: 'ProfilePage',
  components: {
    ContactItem,
    ImageDialog
  },
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const avatar = ref('')
    const dialog = ref(false)
    const itemList = ref([])
    const loading = ref(true)
    const uuid = proxy.$route.params.uuid
    const currentYear = proxy.$settings.currentYear
    const user = ref({})
    const name = ref({})


    api.get('/user/' + uuid)
    .then(function(response) {
      user.value = response.data
      name.value = response.data.firstName + ' ' + (response.data.nickname ? '"' + response.data.nickname + '"': '') + ' ' + response.data.lastName
      loading.value = false
      
      const address = (response.data.street && response.data.zipCode && response.data.city) ? response.data.street + ", " + response.data.zipCode + " " + response.data.city : '';

      itemList.value = [
        {
          label: "E-Mail",
          value: response.data.mail || 'Nicht angegeben',
          icon: "fa-solid fa-envelope",
          link: "mailto:" + response.data.mail
        },
        {
          label: "Adresse",
          value: address || 'Nicht angegeben',
          icon: "fa-solid fa-location-dot",
          link: address ? 'https://www.google.com/maps/search/' + address : '#',
          linkHint: 'GoogleMaps'
        },
        {
          label: "Geburtstag",
          value: response.data.birthday ? new moment(response.data.birthday).format('DD.MM.YYYY') : 'Nicht angegeben',
          icon: "fa-solid fa-cake",
        },
        {
          label: "Handynummer",
          value: response.data.mobile || 'Nicht angegeben',
          icon: "fa-solid fa-mobile",
          link: response.data.mobile ? 'tel:' + response.data.mobile : '#'
        },
        {
          label: "Telefon",
          value: response.data.phone || 'Nicht angegeben',
          icon: "fa-solid fa-phone",
          link: response.data.phone ? 'tel:' + response.data.phone : '#'
        },
        {
          label: "Gemeinde",
          value: response.data.church || 'Nicht angegeben',
          icon: "fa-solid fa-church",
        },
        {
          label: "Beruf",
          value: response.data.job || 'Nicht angegeben',
          icon: "fa-solid fa-briefcase",
        },
      ]
    }).catch(function(e){})

    api.get('/avatar/' + uuid, {
      responseType: 'blob'
    }).then(function(response) {
      avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
    }).catch(function(e){})

    function addDocument(docType) {
      if (docType !== 'criminalRecord' && docType !== 'selfCommitment') {
        return
      }
      const cr = docType === 'criminalRecord'
      const year = ref(currentYear)
      $q.dialog({
        title: cr ? 'Führungszeugnis' : 'Verhaltenskodex',
        message: 'Wann hat ' + name.value + ' ' + (cr ? 'das Führungszeugnis vorgezeigt' : 'den Verhaltenskodex abgegeben') + '?',
        html: true,
        prompt: {
          model: year,
          type: 'number'
        },
        ok: {
          color: 'positive',
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative'
        },
      }).onOk(() => {
        var data = {};
        data[docType] = parseInt(year.value)
        api.post('/userDocument/' + uuid, data).then(function(response) {
          $q.notify({
            message: 'Dokument hinzugefügt',
            color: 'positive',
            icon: 'fa-solid fa-check'
          })
        }).catch(function(e){
          $q.notify({
            message: 'Fehler beim Hinzufügen des Dokuments',
            color: 'negative',
            icon: 'fa-solid fa-times'
          })
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    function getMotivation() {
      api.get('/userMotivation/' + uuid + '/' + currentYear, {
        responseType: 'blob'
      }).then((response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', "MVB.pdf"); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }).catch((e) => {})
    }
    function getCriminalRecord() {
      api.get('/userCriminalRecord/' + uuid, {
        responseType: 'blob'
      }).then((response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', "AntragFZ-" + name.value + ".pdf"); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }).catch((e) => {})
    }

    return {
      avatar,
      dialog,
      itemList,
      loading,
      user,
      name,
      uuid,
      addDocument,
      getCriminalRecord,
      getMotivation
    }
  }
}
</script>
