<template>
  <div class="q-pa-md text-h4 row">
    MA-Liste {{ $settings.currentYear }}
    <q-space />
    <q-input v-model="search" outline dense debounce="300" label="Suche" clearable />
  </div>
    <div class="q-pa-md">
      <q-btn-toggle
        v-model="toggleValue"
        push
        no-caps
        toggle-color="primary"
        color="dark"
        text-color="grey"
        @update:model-value="orderBy(toggleValue)"
        :options="[
          {value: 'firstName', slot: 'one'},
          {value: 'lastName', slot: 'two'},
        ]"
      >
        <template v-slot:one>
          <div class="row items-center no-wrap">
            <div class="text-center">
              Vorname
            </div>
            <q-icon right name="fa-solid fa-arrow-down-a-z" />
          </div>
        </template>

        <template v-slot:two>
          <div class="row items-center no-wrap">
            <div class="text-center">
              Nachname
            </div>
            <q-icon right name="fa-solid fa-arrow-down-a-z" />
          </div>
        </template>
      </q-btn-toggle>
    </div>
    <q-toggle
      v-model="showNick"
      label="Spitznamen anzeigen"
      color="primary"
    />
    <div class="q-pa-md row">
      <UserItem
        v-for="item in filteredUserList"
        :key="item"
        v-bind="{uuid: item.uuid, firstName: item.firstName, lastName: item.lastName, nickname: item.nickname, responsibilityList: responibilityList, showNick: showNick, birthday: item.birthday}"
      />
    </div>
</template>

<script>
import { defineComponent, ref, computed, getCurrentInstance } from 'vue'
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
    const responibilityList = ref([])
    const showNick = ref(true)
    const toggleValue = ref('firstName')
    const search = ref('')

    const filteredUserList = computed(() => {
      const term = (search.value || '').toLowerCase().trim()
      if (!term) return userList.value
      return userList.value.filter(u =>
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term)
      )
    })

    api.get('/user').then(function(response) {
      Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          userList.value.push(item)
        }))
        orderBy('firstName')
    }).catch(function(e) {})

    api.get('/responsibility').then(function(response) {
      Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          responibilityList.value.push(item)
        }))
    }).catch(function(e) {})

    function orderBy(orderKey) {
      userList.value.sort((a, b) => {
        return a[orderKey].localeCompare(b[orderKey]);
      });
    }
    return {
      userList,
      filteredUserList,
      responibilityList,
      showNick,
      toggleValue,
      search,
      orderBy
    }
  }
})
</script>
