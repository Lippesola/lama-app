<template>
  <div class="q-pa-md">
    <q-table
      title="userlist"
      flat
      :rows="rows"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
      :pagination="{rowsPerPage: -1}"
      hide-bottom
      @row-click="rowClickHandler"
    >
      <template v-slot:top="props">
        <div class="col-2 q-table__title row" style="width:100%">
          MA-Liste
          <q-select
            flat round dense
            :icon="'fa-solid ' + (props.inFullscreen ? 'fa-compress' : 'fa-expand')"
            class="q-ml-md"
            v-model="selectedYear"
            :options="yearOptions"
            @update:model-value="getUserList"
          />
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
          @update:model-value="updateVisibleColumns"
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
          @update:model-value="updateVisibleColumns"
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
          @update:model-value="updateVisibleColumns"
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
          @update:model-value="updateVisibleColumns"
        />
        <q-select
          class="q-pa-md"
          v-model="visibleColumns"
          multiple
          dense
          display-value="Dokumente"
          emit-value
          :options="documentColumns"
          option-value="name"
          style="min-width: 150px"
          @update:model-value="updateVisibleColumns"
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
      const selectedYear = ref(settings.currentYear)


      const visibleColumns = ref(window.localStorage.AdvancedUserListColumns ? JSON.parse(window.localStorage.AdvancedUserListColumns) : ['firstName', 'lastName', 'teens', 'kids'])
      const profileColumns = []
      const participationColumns = []
      const roleColumns = []
      const wishColumns = []
      const documentColumns = []

      const rows = ref([])

      const yearOptions = ref(proxy.$keycloak.tokenParsed.groups.filter((g) => {
        return g.includes('_LT') && g.split('_')[0] >= 2023;
      }).map((g) => {
        return g.split('_')[0]
      }));

      Object.entries(c.profile).forEach((entry => {
        const [index, item] = entry;
        profileColumns.push({
          name: item.id,
          label: item.title,
          field: item.id,
          sortable: true,
          align: 'left',
          sort: (a, b, rowA, rowB) => {
            if (item.id === 'birthday') {
              a = moment(a).unix()
              b = moment(b).unix()
            }
            if (a === b) return 0
            return a > b ? 1 : -1
          },
          format: (val, row) => {
            if (item.id === 'birthday') {
              return moment(val).format('DD.MM.YYYY') + (moment(c.events.teens.start).diff(moment(val), 'years') < 18 ? ' (u18)' : '');
            }
            return val;
          }
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
      Object.entries(c.documents).forEach((entry => {
        const [index, item] = entry;
        documentColumns.push({
          name: item.id,
          label: item.title,
          field: item.id,
          sortable: true,
          align: 'left',
          format: (val, row) => `${val ? ((selectedYear.value < (val + 5)) ? 'Ja' : 'Nein') + ' (' + val + ')' : 'Nein'}`
        })
      }))

      const columns = profileColumns.concat(participationColumns, roleColumns, wishColumns, documentColumns)
      getUserList();

      function getUserList() {
        api.get('/userYear?status=4&year=' + selectedYear.value + '&userBundle&documentBundle').then(function(response) {
          rows.value = [];
          Object.entries(response.data).forEach((entry => {
            const [index, item] = entry
            let row = item
            Object.entries(item.UserModel).forEach((entry => {
              const [index, item] = entry
              row[index] = item
            }))
            if (item.UserDocument) {
              Object.entries(item.UserDocument).forEach((entry => {
                const [index, item] = entry
                row[index] = item
              }))
            }
            delete row.UserModel;
            delete row.UserDocument;
            //row.birthday = new moment(row.birthday)
            rows.value.push(row)
          }))
        }).catch(function(e) {})
      }

      function updateVisibleColumns (value) {
        window.localStorage.AdvancedUserListColumns = JSON.stringify(value);
      }

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
        documentColumns,
        visibleColumns,
        columns,
        rows,
        yearOptions,
        selectedYear,
        updateVisibleColumns,
        rowClickHandler,
        getUserList,
        exportList
      }
    }
  })
</script>
