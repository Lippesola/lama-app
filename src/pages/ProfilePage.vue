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
          link: response.data.mobile ? 'tel:response.data.mobile' : '#'
        },
        {
          label: "Telefon",
          value: response.data.phone || 'Nicht angegeben',
          icon: "fa-solid fa-phone",
          link: response.data.phone ? 'tel:response.data.mobile' : '#'
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
    }).catch(function(e){console.log(e)})

    api.get('/avatar/' + uuid, {
      responseType: 'blob'
    }).then(function(response) {
      avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
    }).catch(function(e){console.log(e)})

    return {
      avatar,
      dialog,
      itemList,
      loading,
      user,
      name
    }
  }
}
</script>
