<template>
  <div class="q-pa-md row items-center">
    <div class="text-h4">Helfer-Liste {{ $settings.currentYear }}</div>
    <q-space />
    <q-btn
      color="primary"
      icon="fa-solid fa-download"
      label="Exportieren"
      @click="exportList()"
    />
  </div>
  <div class="q-pa-md" style="max-width: 600px">
    <q-list>
      <q-expansion-item
        expand-separator
        label="Brauchen Aktivierung"
        class="text-h6"
        :default-opened=true
      >
        <div>
          <div v-for="item in supporterList" :key="item" class="text-body1">
            <div v-if="!item.isConfirmed" class="q-py-sm">
              <SupporterItem v-bind="{ item: item }" />
            </div>
          </div>
        </div>
      </q-expansion-item>
      <q-expansion-item
        expand-separator
        label="Ohne Datumsangabe"
        class="text-h6"
      >
        <div>
          <div v-for="item in supporterList" :key="item" class="text-body1">
            <div v-if="item.isConfirmed && !item.SupporterDays.length" class="q-py-sm">
              <SupporterItem v-bind="{ item: item }" />
            </div>
          </div>
        </div>
      </q-expansion-item>
      <q-expansion-item
        expand-separator
        :label="event.name"
        v-for="event in dateOptions"
        :key="event"
        class="text-h6"
      >
        <div v-for="date in event.dates" :key="date" class="text-body1">
          <q-separator />
          <div class="q-pa-md text-bold text-primary">
            {{ date.formattedDate }}
          </div>
          <div>
            <div v-for="item in supporterList" :key="item">
              <div
                v-if="
                  item.isConfirmed &&
                  item.SupporterDays.some(
                    (supporterDay) => supporterDay.day === date.date,
                  )
                "
                class="q-py-sm"
              >
                <SupporterItem v-bind="{ item: item }" />
              </div>
            </div>
          </div>
        </div>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from "vue";
import { exportFile, useQuasar } from "quasar";
import SupporterItem from "src/components/SupporterItem.vue";
import Moment from "moment";
import { extendMoment } from "moment-range";

export default defineComponent({
  name: "SupporterList",
  components: {
    SupporterItem,
  },
  setup() {
    const moment = extendMoment(Moment);
    const { proxy } = getCurrentInstance();
    const $q = useQuasar();
    const api = proxy.$api;
    const settings = proxy.$settings;
    const c = proxy.$constants;
    const supporterList = ref([]);
    const dateOptions = ref({});
    const eventNames = [
      { id: "prepare2", name: "2. VW" },
      { id: "prepare3", name: "3. VW" },
      { id: "prebuild", name: "Voraufbau" },
      { id: "training", name: "Schulungstage" },
      { id: "build", name: "Aufbau" },
      { id: "teens", name: "Teens" },
      { id: "kids", name: "Kids" },
      { id: "cleanup", name: "Abbau" },
    ];
    eventNames.forEach((eventName) => {
      const event = c.events[eventName.id];
      if (event) {
        const range = moment.range(event.start, event.end);
        let i = 0;
        dateOptions.value[eventName.id] = {
          name: eventName.name,
          dates: [],
        };
        Array.from(range.by("day")).forEach((day) => {
          i++;
          dateOptions.value[eventName.id]["dates"].push({
            formattedDate: "Tag " + i + " - " + day.format("DD.MM.YYYY"),
            date: day.format("YYYY-MM-DD"),
          });
        });
      }
    });
    api
      .get("/supporterYear")
      .then(function (response) {
        Object.entries(response.data).forEach((entry) => {
          const [index, item] = entry;
          supporterList.value.push(item);
        });
        supporterList.value.sort((a, b) => {
          const as = (a.lastName || '').toLowerCase();
          const bs = (b.lastName || '').toLowerCase();
          if (as > bs) return 1;
          if (as < bs) return -1;
          return 0;
        });
      })
      .catch(function (e) {});

    const exportColumns = [
      { label: 'Vorname', field: 'firstName' },
      { label: 'Nachname', field: 'lastName' },
      { label: 'Geschlecht', field: 'gender' },
      { label: 'Geburtstag', field: 'birthday', format: (v) => v ? moment(v).format('DD.MM.YYYY') : '' },
      { label: 'E-Mail', field: 'mail' },
      { label: 'Straße', field: 'street' },
      { label: 'PLZ', field: 'zipCode' },
      { label: 'Ort', field: 'city' },
      { label: 'Telefon', field: 'phone' },
      { label: 'Handy', field: 'mobile' },
      { label: 'Beruf', field: 'job' },
      { label: 'Vegetarisch', field: 'vegetarian', format: (v) => v ? 'Ja' : '' },
      { label: 'Laktosefrei', field: 'lactose', format: (v) => v ? 'Ja' : '' },
      { label: 'Fahrer PKW', field: 'supportTypeDriverCar', format: (v) => v ? 'Ja' : '' },
      { label: 'Fahrer Anhänger', field: 'supportTypeDriverTrailer', format: (v) => v ? 'Ja' : '' },
      { label: 'Fahrer LKW', field: 'supportTypeDriverTruck', format: (v) => v ? 'Ja' : '' },
      { label: 'Fahrzeug Anhänger', field: 'supportTypeVehicleTrailer', format: (v) => v ? 'Ja' : '' },
      { label: 'Fahrzeug PKW', field: 'supportTypeVehicleCar', format: (v) => v ? 'Ja' : '' },
      { label: 'Fahrzeug Transporter', field: 'supportTypeVehicleVan', format: (v) => v ? 'Ja' : '' },
      { label: 'Aufgaben', field: 'supportTypeTasks', format: (v) => v ? 'Ja' : '' },
      { label: 'Deko', field: 'supportTypeDeco', format: (v) => v ? 'Ja' : '' },
      { label: 'Material', field: 'supportTypeMaterial', format: (v) => v ? 'Ja' : '' },
      { label: 'Schulung', field: 'supportTypeTraining', format: (v) => v ? 'Ja' : '' },
      { label: 'Workshops', field: 'supportTypeWorkshops', format: (v) => v ? 'Ja' : '' },
      { label: 'Seminare', field: 'supportTypeSeminars', format: (v) => v ? 'Ja' : '' },
      { label: 'Infrastruktur', field: 'supportTypeInfrastructure', format: (v) => v ? 'Ja' : '' },
      { label: 'Küche', field: 'supportTypeKitchen', format: (v) => v ? 'Ja' : '' },
      { label: 'Medien', field: 'supportTypeMedia', format: (v) => v ? 'Ja' : '' },
      { label: 'Gebet', field: 'supportTypePrayer', format: (v) => v ? 'Ja' : '' },
      { label: 'Spiele', field: 'supportTypeGames', format: (v) => v ? 'Ja' : '' },
      { label: 'Nachtwache', field: 'supportTypeNightwatch', format: (v) => v ? 'Ja' : '' },
      { label: 'Sonstiges (bool)', field: 'supportTypeOther', format: (v) => v ? 'Ja' : '' },
      { label: 'Sonstiges (Text)', field: 'supportOther' },
      { label: 'Woher kennst du das SOLA?', field: 'referralSource' },
      { label: 'Bestätigt', field: 'isConfirmed', format: (v) => v ? 'Ja' : 'Nein' },
      { label: 'Interner Kommentar', field: 'internalComment' },
      { label: 'Termine', field: 'SupporterDays', format: (v) => Array.isArray(v) ? v.map(d => d.day).join(', ') : '' },
    ];

    function wrapCsvValue(val, formatFn, row) {
      let formatted = formatFn !== undefined ? formatFn(val, row) : val;
      formatted = formatted === undefined || formatted === null ? '' : String(formatted);
      formatted = formatted.split('"').join('""');
      return `"${formatted}"`;
    }

    function exportList() {
      const content = [
        exportColumns.map(col => '"' + col.label + '"').join(';')
      ].concat(
        supporterList.value.map(row =>
          exportColumns.map(col => wrapCsvValue(row[col.field], col.format, row)).join(';')
        )
      ).join('\r\n');

      const status = exportFile(
        'helfer-export.csv',
        '﻿' + content,
        'text/csv'
      );

      if (status !== true) {
        $q.notify({
          message: 'Export fehlgeschlagen',
          color: 'negative',
          icon: 'warning'
        });
      }
    }

    return {
      supporterList,
      dateOptions,
      exportList,
    };
  },
});
</script>
