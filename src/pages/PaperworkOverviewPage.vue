<template>
  <div class="q-pa-md text-h4">
    Ausstehende Dokumente {{ $settings.currentYear }}
  </div>
  <q-list
    v-for="list in lists"
    :key="list"
  >
    <q-expansion-item
        expand-separator
        :label="list.label"
        class="text-h6"
      >
      <div>
          <q-table
            flat
            :rows="userList.filter(i=>i[list.name] === 3)"
            :columns="columns"
            row-key="name"
            :pagination="{rowsPerPage: -1}"
            hide-bottom
            @row-click="rowClickHandler"
          />
        </div>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'paperworkOverviewPage',
  setup() {
    const router = useRouter()
    const { proxy } = getCurrentInstance()
    const api = proxy.$api
    const settings = proxy.$settings
    const c = proxy.$constants
    const userList = ref([])
    const lists = ref([
      {
        "label": "Teens",
        "name": "teens"
      },
      {
        "label": "Kids",
        "name": "kids"
      }
    ])
    const columns = ref([
      {
        name: 'name',
        label: 'Name',
        field: row => row.UserModel.firstName + ' ' + row.UserModel.lastName,
        align: 'left',
        sortable: true
      },
      {
        name: 'criminalRecord',
        label: 'Führungszeugnis',
        field: row => row.UserDocument?.criminalRecord,
        format: val => `${(val && val < 2000) ? 'Selbsverpflichtung 20' + val : (val || '')}`,
        align: 'left',
        sortable: true
      },
      {
        name: 'selfCommitment',
        label: 'Verhaltenskodex',
        field: row => row.UserDocument?.selfCommitment,
        align: 'left',
        sortable: true
      },
    ])
    api.get('/userYear?year=' + settings.currentYear + '&status=4&userBundle&documentBundle').then(function(response) {
      Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          userList.value.push(item)
        }))
        orderBy('date')
    }).catch(function(e) {})

    function orderBy(orderKey) {
      userList.value.sort((a, b) => {
        const as = a[orderKey].toLowerCase();
        const bs = b[orderKey].toLowerCase();
        if (as > bs) return 1;
        if (as < bs) return -1;
        return 0;
      });
    }
    function rowClickHandler(evt, row) {
      router.push({
        path: '/l/profile/' + row.uuid
      })
    }
    return {
      userList,
      lists,
      columns,
      orderBy,
      rowClickHandler
    }
  }
})
</script>
