<template>
  <div class="q-pa-md">
    <q-table
      title="userlist"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
      :pagination="{rowsPerPage: 25}"
      :rows-per-page-options="[25, 50, 100]"
      rows-per-page-label="Ergebnisse pro Seite"
    >
      <template v-slot:top="props">
        <div class="col-2 q-table__title" style="width:100%">
          MA-Liste
          <q-btn
            flat round dense
            :icon="'fa-solid ' + (props.inFullscreen ? 'fa-compress' : 'fa-expand')"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />
        </div>
        <q-select
          class="q-pa-md"
          v-model="visibleColumns"
          multiple
          dense
          display-value="Profil"
          emit-value
          :options="profileColumns"
          option-value="name"
          style="min-width: 150px"
        />
        <q-select
          class="q-pa-md"
          v-model="visibleColumns"
          multiple
          dense
          display-value="Termine"
          emit-value
          :options="participationColumns"
          option-value="name"
          style="min-width: 150px"
        />
        <q-select
          class="q-pa-md"
          v-model="visibleColumns"
          multiple
          dense
          display-value="Unterstützung"
          emit-value
          :options="roleColumns"
          option-value="name"
          style="min-width: 150px"
        />
        <q-select
          class="q-pa-md"
          v-model="visibleColumns"
          multiple
          dense
          display-value="Wünsche"
          emit-value
          :options="wishColumns"
          option-value="name"
          style="min-width: 150px"
        />
      </template>

    </q-table>
  </div>
</template>

<script>
  import { defineComponent, ref, getCurrentInstance } from 'vue'
  import moment from 'moment'
  export default defineComponent({
  name: 'AdvancedUserList',

    setup () {

      const { proxy } = getCurrentInstance()
      const api = proxy.$api
      const c = proxy.$constants
      const settings = proxy.$settings

      const visibleColumns = ref(['firstName', 'lastName', 'teens', 'kids'])
      const profileColumns = []
      const participationColumns = []
      const roleColumns = []
      const wishColumns = []

      const rows = ref([])

      Object.entries(c.profile).forEach((entry => {
        const [index, item] = entry;
        profileColumns.push({
          name: item.id,
          label: item.title,
          field: item.id,
          sortable: true,
          align: 'left'
        })
      }))
      Object.entries(c.engagement.participation).forEach((entry => {
        const [index, item] = entry;
        participationColumns.push({
          name: item.id,
          label: item.title,
          field: item.id,
          sortable: true,
          align: 'left',
          format: (val, row) => `${item.options[val] ? item.options[val]['label'] : ''}`
        })
      }))
      Object.entries(c.engagement.roles).forEach((entry => {
        const [index, item] = entry;
        roleColumns.push({
          name: item.id,
          label: item.title,
          field: item.id,
          sortable: true,
          align: 'left',
          format: (val, row) => `${item.options[val] ? item.options[val]['label'] : ''}`
        })
      }))
      Object.entries(c.engagement.wishes).forEach((entry => {
        const [index, item] = entry;
        wishColumns.push({
          name: item.id,
          label: item.title,
          field: item.id,
          sortable: true,
          align: 'left',
          format: (val, row) => `${item.options[val] ? item.options[val]['label'] : ''}`
        })
      }))

      const columns = profileColumns.concat(participationColumns, roleColumns, wishColumns)
      
      api.get('/userYear?year=' + settings.currentYear + '&userBundle').then(function(response) {
        Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          let row = item
          Object.entries(item.User).forEach((entry => {
            const [index, item] = entry
            row[index] = item
          }))
          delete row.User;
          row.birthday = new moment(row.birthday).format('DD.MM.YYYY')
          rows.value.push(row)
        }))
      }).catch(function(e) {})


      return {
        profileColumns,
        participationColumns,
        roleColumns,
        wishColumns,
        visibleColumns,
        columns,
        rows
      }
    }
  })
</script>
