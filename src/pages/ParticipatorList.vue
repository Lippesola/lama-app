<template>
  <div class="q-pa-md">
    <q-table
      title="participatorList"
      flat
      :rows="rows"
      :columns="columns"
      :filter="filter"
      row-key="name"
      :visible-columns="visibleColumns"
      :pagination="{ rowsPerPage: -1 }"
      hide-bottom
      @row-click="rowClickHandler"
    >
      <template v-slot:top="props">
        <div class="col-2 q-table__title row" style="width: 100%">
          TN-Liste - Anzahl: {{ rows.length }}
          <q-space />
          <q-input outline dense debounce="300" v-model="filter" label="Suche">
          </q-input>
          <q-btn
            flat
            round
            dense
            :icon="
              'fa-solid ' + (props.inFullscreen ? 'fa-compress' : 'fa-expand')
            "
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />
        </div>
        <div class="row" style="width: 100%">
          <q-select
            flat
            round
            dense
            label="Woche"
            class="q-ml-md"
            v-model="selectedWeek"
            :options="weekOptions"
            @update:model-value="filterParticipatorList"
            style="min-width: 100px"
          />
          <q-select
            flat
            round
            dense
            label="Status"
            class="q-ml-md"
            v-model="selectedStatus"
            :options="statusOptions"
            @update:model-value="filterParticipatorList"
            style="min-width: 100px"
          />
        </div>
        <q-select
          v-for="category in categories"
          :key="category"
          class="q-pa-md"
          v-model="visibleColumns"
          multiple
          dense
          :display-value="category.label"
          emit-value
          :options="questions[category.id]"
          option-value="id"
          style="min-width: 150px"
          @update:model-value="updateVisibleColumns"
        />
        <q-btn
          :label="visibleColumns.includes('groups') ? 'Gruppen ausblenden' : 'Gruppen einblenden'"
          flat
          dense
          @click="showGroups"
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
import { exportFile, useQuasar } from "quasar";
import { defineComponent, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
export default defineComponent({
  name: "AdvancedUserList",

  setup() {
    const $q = useQuasar();
    const { proxy } = getCurrentInstance();
    const api = proxy.$api;
    const c = proxy.$constants;
    const settings = proxy.$settings;
    const router = useRouter();
    const filter = ref("");

    const visibleColumns = ref(
      window.localStorage.ParticipatorListColumns
        ? JSON.parse(window.localStorage.ParticipatorListColumns)
        : ["firstName", "lastName"],
    );
    const categories = ref([]);
    const questions = ref({});

    const allRows = ref([]);
    const rows = ref([]);
    const allColumns = ref([]);
    const columns = ref([]);

    const weekOptions = ref(["Beide", "Teens", "Kids"]);
    const statusOptions = ref([
      { value: -1, label: "Alle" },
      { value: 0, label: "Ausstehend" },
      { value: 1, label: "Bestätigt" },
      { value: 2, label: "Storniert" },
      { value: 3, label: "Warteliste" },
    ]);
    const selectedWeek = ref(window.localStorage.ParticipatorListWeek || "Beide");
    const selectedStatus = ref(statusOptions.value[window.localStorage.ParticipatorListStatus || 0]);

    getParticipatorList();
    getCategories();
    getQuestions();

    function filterParticipatorList() {
      let filteredRows =
        selectedWeek.value === "Beide"
          ? allRows.value
          : allRows.value.filter((row) => {
              return row.week === selectedWeek.value.toLowerCase();
            });
      filteredRows =
        selectedStatus.value["value"] === -1
          ? filteredRows
          : filteredRows.filter((row) => {
              return row.status === selectedStatus.value["value"];
            });

      window.localStorage.ParticipatorListWeek = selectedWeek.value;
      window.localStorage.ParticipatorListStatus = selectedStatus.value["value"] + 1;

      rows.value = filteredRows;
    }

    function getParticipatorList() {
      api
        .get("/participator")
        .then(function (participatorResponse) {
          allRows.value = [];
          api.get('/group?year=' + settings.currentYear)
            .then(function (groupResponse) {
              Object.entries(participatorResponse.data).forEach((entry) => {
                const [index, item] = entry;
                item.id = index;
                const group = groupResponse.data.find((group) => {
                  return item.groupId === group.id;
                });
                item.group = group ? group.groupNumber + ' - ' + group.title : '';
                allRows.value.push(item);
              });
              filterParticipatorList();
            })
            .catch(function (e) {
              console.log(e);
            });
        })
        .catch(function (e) {});
    }

    function getCategories() {
      api
        .get("/participatorQuestionCategory")
        .then(function (response) {
          categories.value = response.data;
        })
        .catch(function (e) {
          console.log(e);
        });
    }

    function getQuestions() {
      api
        .get("/participatorQuestion")
        .then(function (response) {
          allColumns.value = [];
          response.data.forEach((question) => {
            if (questions.value[question.category] === void 0) {
              questions.value[question.category] = [];
            }
            questions.value[question.category].push(question);
            allColumns.value.push({
              name: question.id,
              label: question.label,
              field: question.id,
              sortable: true,
              align: "left",
              format: (val, row) => {
                if (typeof val === 'string' && moment(val.split('T')[0], 'YYYY-MM-DD', true).isValid()) {
                  return moment(val).format("DD.MM.YYYY");
                }
                return val;
              },
            });
          });
          allColumns.value.push({
            name: 'group',
            label: 'Gruppen',
            field: 'group',
            sortable: true,
            align: 'left',
          })
          visibleColumns.value.forEach((col) => {
            columns.value.push(
              allColumns.value.find((c) => {
                return c.name === col;
              }),
            );
          });
        })
        .catch(function (e) {
          console.log(e);
        });
    }

    function showGroups() {
      if (visibleColumns.value.includes("group")) {
        visibleColumns.value.splice(visibleColumns.value.indexOf("group"), 1);
      } else {
        visibleColumns.value.push("group");
      }
      updateVisibleColumns(visibleColumns.value);
    }

    function updateVisibleColumns(value) {
      columns.value = [];
      value.forEach((col) => {
        columns.value.push(
          allColumns.value.find((c) => {
            return c.name === col;
          }),
        );
      });
      window.localStorage.ParticipatorListColumns = JSON.stringify(value);
    }

    function rowClickHandler(evt, row) {
      router.push({
        path: "/l/leader/participator/" + row.orderId + "/" + row.positionId,
      });
    }

    function wrapCsvValue(val, formatFn, row) {
      let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
      formatted =
        formatted === void 0 || formatted === null ? "" : String(formatted);
      formatted = formatted.split('"').join('""');
      return `"${formatted}"`;
    }

    function exportList() {
      const exportCols = columns.value.filter((col) => {
        return visibleColumns.value.includes(col.name);
      });

      const content = [exportCols.map((col) => '"' + col.label + '"').join(";")]
        .concat(
          rows.value.map((row) =>
            exportCols
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format,
                  row,
                ),
              )
              .join(";"),
          ),
        )
        .join("\r\n");

      const status = exportFile(
        "table-export.csv",
        "\uFEFF" + content,
        "text/csv",
      );

      if (status !== true) {
        $q.notify({
          message: "Die Liste kontte nicht ",
          color: "negative",
          icon: "warning",
        });
      }
    }

    return {
      filter,
      visibleColumns,
      columns,
      rows,
      weekOptions,
      selectedWeek,
      statusOptions,
      selectedStatus,
      categories,
      questions,
      updateVisibleColumns,
      rowClickHandler,
      getParticipatorList,
      filterParticipatorList,
      exportList,
      showGroups
    };
  },
});
</script>
