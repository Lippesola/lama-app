<template>
  <div class="q-pa-md text-h4">
    <ImageDialog
      v-model="dialog"
      :img="avatar"
      :title="user.firstName + ' ' + user.lastName"
    />
    <q-avatar v-if="!avatar" rounded size="48px" color="primary" text-color="white" icon="fa-solid fa-user"></q-avatar>
    <q-avatar v-if="avatar" rounded size="48px" color="primary" text-color="white">
      <img class="cursor-pointer" :src="avatar" @click="dialog = true" />
    </q-avatar>
    {{ user.firstName }} {{ user.lastName }}
  </div>
  <div>
    <span class="q-pa-md">
      Legende:
    </span>
    <span class="q-pa-md">
      <q-icon color="positive" name="fa-solid fa-circle"></q-icon>
      Ja
    </span>
    <span class="q-pa-md">
      <q-icon color="warning" name="fa-solid fa-circle"></q-icon>
      Vielleicht
    </span>
    <span class="q-pa-md">
      <q-icon color="negative" name="fa-solid fa-circle"></q-icon>
      Nein
    </span>
  </div>
  <div class="q-pl-md">
    <div class="q-pt-md text-h5">Termine</div>
    <q-list class="q-gutter-md row">
      <UserDetailItem
        style="width: 400px"
        v-for="item in $constants.engagement.participation"
        v-bind="participationList[item.id]['value']"
        :key="item.id"
      />
    </q-list>
    <div class="q-pt-md text-h5">Team</div>
    <q-list class="q-gutter-md row">
      <UserDetailItem
        style="width: 400px"
        v-for="item in $constants.engagement.wishes"
        v-bind="wishList[item.id]['value']"
        :key="item.id"
      />
    </q-list>
    <div class="q-pt-md text-h5">Sonstiges</div>
    <q-list class="q-gutter-md row">
      <UserDetailItem
        style="width: 400px"
        v-for="item in $constants.engagement.roles"
        v-bind="roleList[item.id]['value']"
        :key="item.id"
      />
    </q-list>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import 'vue-advanced-cropper/dist/style.css';
import UserDetailItem from 'src/components/UserDetailItem.vue'
import ImageDialog from 'src/components/ImageDialog.vue'
import moment from 'moment'
export default {
  name: 'ProfilePage',
  components: {
    UserDetailItem,
    ImageDialog
  },
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const avatar = ref('')
    const dialog = ref(false)
    const loading = ref(true)
    const uuid = proxy.$route.params.uuid
    const user = ref({})
    const c = proxy.$constants
    const settings = proxy.$settings

    let participationList = {}
    let roleList = {}
    let wishList = {}

    Object.entries(c.engagement.participation).forEach((entry => {
      const [index, item] = entry;
      participationList[item.id] = ref({})
    }))
    Object.entries(c.engagement.roles).forEach((entry => {
      const [index, item] = entry;
      roleList[item.id] = ref({})
    }))
    Object.entries(c.engagement.wishes).forEach((entry => {
      const [index, item] = entry;
      wishList[item.id] = ref({})
    }))

    api.get('/userEngagement/' + uuid + '/' + settings.currentYear)
    .then(function(response) {
      Object.entries(c.engagement.participation).forEach((entry => {
        const [index, item] = entry
        if (participationList[item.id]) {
          participationList[item.id]['value']['value'] = c.engagement.participation[item.id]['options'][response.data[item.id]]['label']
          participationList[item.id]['value']['label'] = c.engagement.participation[item.id]['title']
          participationList[item.id]['value']['icon'] = c.engagement.participation[item.id]['icon']
          participationList[item.id]['value']['color'] = response.data[item.id] === 0 ? 'negative' : response.data[item.id] === 3 ? 'positive' : 'warning'
          if (item.id === 'build' && response.data[item.id] === 0) {
            participationList[item.id]['value']['color'] = response.data['teens'] === 0 ? 'negative' : response.data['teens'] === 3 ? 'positive' : 'warning'
          } else if(item.id === 'cleanup' && response.data[item.id] === 0) {
            participationList[item.id]['value']['color'] = response.data['kids'] === 0 ? 'negative' : response.data['kids'] === 3 ? 'positive' : 'warning'
          }
        }
      }))
      Object.entries(c.engagement.wishes).forEach((entry => {
        const [index, item] = entry
        if (wishList[item.id]) {
          wishList[item.id]['value']['value'] = c.engagement.wishes[item.id]['options'][response.data[item.id]]['label']
          wishList[item.id]['value']['label'] = c.engagement.wishes[item.id]['title']
          wishList[item.id]['value']['icon'] = c.engagement.wishes[item.id]['icon']
          wishList[item.id]['value']['color'] = response.data[item.id] === 0 ? 'negative' : response.data[item.id] === 3 ? 'positive' : 'warning'
        }
      }))
      Object.entries(c.engagement.roles).forEach((entry => {
        const [index, item] = entry
        if (roleList[item.id]) {
          roleList[item.id]['value']['value'] = c.engagement.roles[item.id]['options'][response.data[item.id]]['label']
          roleList[item.id]['value']['label'] = c.engagement.roles[item.id]['title']
          roleList[item.id]['value']['icon'] = c.engagement.roles[item.id]['icon']
          roleList[item.id]['value']['color'] = response.data[item.id] > 0 ? 'positive' : 'negative'
        }
      }))
      loading.value = false
    })
    
    // {
    //   label: "E-Mail",
    //   value: response.data.mail || 'Nicht angegeben',
    //   icon: "fa-solid fa-envelope"
    // }
    
    api.get('/user/' + uuid)
    .then(function(response) {
      user.value = response.data
    }).catch(function(e){console.log(e)})

    api.get('/avatar/' + uuid, {
      responseType: 'blob'
    }).then(function(response) {
      avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
    }).catch(function(e){console.log(e)})

    return {
      participationList,
      wishList,
      roleList,
      avatar,
      dialog,
      loading,
      user,
    }
  }
}
</script>
