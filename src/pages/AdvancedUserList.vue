<template>
  <div class="q-pa-md">
    <q-table
      title="userlist"
      flat
      :rows="rows"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
      :pagination="{rowsPerPage: 25}"
      :rows-per-page-options="[25, 50, 100]"
      rows-per-page-label="Ergebnisse pro Seite"
      @row-click="rowClickHandler"
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
        <q-space />
        <q-btn
          color="primary"
          icon="fa-solid fa-download"
          label="Exportieren"
          @click="exportList()"
        />
      </template>

    </q-table>
    <div class="text-caption q-py-md">
      Es werden alle Mitarbeiter angezeigt, die sich vollständig angemeldet haben - auch, wenn sie noch nicht freigeschaltet wurden.
    </div>
  </div>
</template>

<script>
  import { exportFile, useQuasar } from 'quasar'
  import { defineComponent, ref, getCurrentInstance } from 'vue'
  import { useRouter } from 'vue-router'
  import moment from 'moment'
  export default defineComponent({
  name: 'AdvancedUserList',

    setup () {

      const $q = useQuasar
      const { proxy } = getCurrentInstance()
      const api = proxy.$api
      const c = proxy.$constants
      const settings = proxy.$settings
      const router = useRouter()

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
      
      api.get('/userYear?status=3&status=4&year=' + settings.currentYear + '&userBundle').then(function(response) {
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

      function rowClickHandler(evt, row) {
        router.push({
          path: '/l/profile/' + row.uuid
        })
      }
      
      function wrapCsvValue (val, formatFn, row) {
        let formatted = formatFn !== void 0 ? formatFn(val, row) : val
        formatted = formatted === void 0 || formatted === null ? '' : String(formatted)
        formatted = formatted.split('"').join('""')
        return `"${formatted}"`
      }

      function exportList() {

        const exportCols = columns.filter((col) => {
          return visibleColumns.value.includes(col.name)
        })

        const content = [exportCols.map(col => '"' + col.label + '"').join(';')].concat(
          rows.value.map(row => exportCols.map(col => wrapCsvValue(typeof col.field === 'function' ? col.field(row) : row[ col.field === void 0 ? col.name : col.field ], col.format, row )).join(';'))
        ).join('\r\n')

        const status = exportFile(
          'table-export.csv',
          "\uFEFF" + content,
          'text/csv'
        )

        if (status !== true) {
          $q.notify({
            message: 'Die Liste kontte nicht ',
            color: 'negative',
            icon: 'warning'
          })
        }
      }


      return {
        profileColumns,
        participationColumns,
        roleColumns,
        wishColumns,
        visibleColumns,
        columns,
        rows,
        rowClickHandler,
        exportList
      }
    }
  })
</script>
