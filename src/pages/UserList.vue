<template>
  <div class="q-pa-md text-h4">MA-Liste {{ $settings.currentYear }}</div>
    <div class="q-pa-md">
      <UserItem
        v-for="item in userList"
        :key="item"
        v-bind="item"
      />
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import UserItem from 'src/components/UserItem.vue'
import { api } from 'src/boot/axios'
import { settings } from 'src/boot/settings'

export default defineComponent({
  name: 'UserList',
  components: {
    UserItem
  },
  setup() {
    const userList = ref([])
    api.get('/userYear?year=' + settings.currentYear + '&status=' + 1).then(function(response) {
      Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          if (item.status) {
            userList.value.push({uuid: item.uuid})
          }
        }))
    }).catch(function(e) {
      console.log(e);
    })
    return {
      userList
    }
  }
})
</script>
