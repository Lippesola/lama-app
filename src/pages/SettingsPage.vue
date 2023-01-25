<template>
  <div class="q-pa-md" style="max-width: 750px;">
    <q-table
      title="Einstellungen"
      flat
      :rows="rows"
      :columns="columns"
      row-key="name"
      :pagination="{rowsPerPage: 25}"
      hide-bottom
    >
    </q-table>
    <div class="text-caption q-py-md">
      Bitte beachte, dass falsche Einstellungen dafür sorgen könnten, dass LAMA nicht mehr funktioniert.
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, getCurrentInstance } from 'vue'
  import { useRouter } from 'vue-router'
  import moment from 'moment'
  export default defineComponent({
  name: 'SettingsPage',

    setup () {

      const { proxy } = getCurrentInstance()
      const api = proxy.$api
      const c = proxy.$constants
      const settings = proxy.$settings
      const router = useRouter()
      console.log(settings);
      const rows = []


      Object.entries(settings).forEach((entry => {
        const [index, item] = entry
        let row = {}
        row['key'] = index
        row['value'] = item
        rows.push(row)
      }))

      const columns = [
        { name: 'key', align: 'left', label: 'Key', field: 'key', sortable: true },
        { name: 'value', align: 'left', label: 'Value', field: 'value', sortable: false },
      ]
      

      function rowClickHandler(evt, row) {
        router.push({
          path: '/l/profile/' + row.uuid
        })
      }


      return {
        columns,
        rows,
        rowClickHandler
      }
    }
  })
</script>
