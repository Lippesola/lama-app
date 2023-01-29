<template>
  <div class="q-pa-md text-h4">MA-Liste {{ $settings.currentYear }}</div>
    <div class="q-pa-md">
      <q-btn-toggle
        v-model="showNick"
        push
        no-caps
        toggle-color="primary"
        color="dark"
        text-color="grey"
        :options="[
          {value: false, slot: 'one'},
          {value: true, slot: 'two'},
        ]"
      >
        <template v-slot:one>
          <div class="row items-center no-wrap">
            <div class="text-center">
              Vorname
            </div>
            <q-icon right name="fa-solid fa-id-card" />
          </div>
        </template>

        <template v-slot:two>
          <div class="row items-center no-wrap">
            <div class="text-center">
              Spitzname
            </div>
            <q-icon right name="fa-solid fa-signature" />
          </div>
        </template>
      </q-btn-toggle>
    </div>
    <div class="q-pa-md row">
      <UserItem
        v-for="item in userList"
        :key="item"
        v-bind="{uuid: item.uuid, firstName: item.firstName, lastName: item.lastName, nickname: item.nickname, showNick: showNick}"
      />
    </div>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'
import UserItem from 'src/components/UserItem.vue'

export default defineComponent({
  name: 'UserList',
  components: {
    UserItem
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const api = proxy.$api
    const settings = proxy.$settings
    const c = proxy.$constants
    const userList = ref([])
    const showNick = ref(false)
    api.get('/user').then(function(response) {
      Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          userList.value.push(item)
        }))
    }).catch(function(e) {})
    return {
      userList,
      showNick
    }
  }
})
</script>
