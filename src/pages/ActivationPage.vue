<template>
  <div class="q-pa-md text-h4">Mitarbeiterverwaltung</div>
  <div class="q-pa-md" style="max-width: 600px">
    <q-list separator>
      <UserActivationItem
        v-for="item in userList"
        :key="item"
        v-bind="item"
      />
    </q-list>
  </div>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'
import UserActivationItem from 'src/components/UserActivationItem.vue'
import { api } from 'src/boot/axios'

export default defineComponent({
  name: 'ActivationPage',
  components: {
    UserActivationItem
  },
  setup() {
    const userList = ref([])
    const { proxy } = getCurrentInstance()
    const c = proxy.$constants
    const settings = proxy.$settings
    api.get('/userYear?year=' + settings.currentYear + '&status=' + c.userYearStatus.pending + '&assigneeBundle').then(function(response) {
      Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          userList.value.push({
            uuid: item.uuid,
            registeredAt: item.registeredAt,
            AssigneeModel: item.AssigneeModel
          })
        }))
      userList.value.sort((a, b) => {
        const as = a.registeredAt;
        const bs = b.registeredAt;
        if (as > bs) return 1;
        if (as < bs) return -1;
        return 0;
      })
    }).catch(function(e) {})
    return {
      userList
    }
  }
})
</script>
