<template>
  <div class="q-pa-md text-h4">Mitarbeiterfreischaltung</div>
  <div class="q-pa-md" style="max-width: 600px">
    <q-list separator>
      <UserItem
        v-for="item in userList"
        :key="item"
        v-bind="item"
      />
      <UserItem
        v-for="item in userList"
        :key="item"
        v-bind="item"
      />
      <UserItem
        v-for="item in userList"
        :key="item"
        v-bind="item"
      />
      <UserItem
        v-for="item in userList"
        :key="item"
        v-bind="item"
      />
      <UserItem
        v-for="item in userList"
        :key="item"
        v-bind="item"
      />
    </q-list>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import UserItem from 'src/components/UserActivationItem.vue'
import { api } from 'src/boot/axios'
import { settings } from 'src/boot/settings'

export default defineComponent({
  name: 'ActivationPage',
  components: {
    UserItem
  },
  setup() {
    const userList = ref([])
    api.get('/userYear?year=' + settings.currentYear).then(function(response) {
      Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          if (!item.status) {
            userList.value.push({uuid: item.uuid, createdAt: item.createdAt})
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
