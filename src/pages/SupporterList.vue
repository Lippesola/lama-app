<template>
  <div class="q-pa-md text-h4">Helfer-Liste {{ $settings.currentYear }}</div>
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
    const api = proxy.$api;
    const settings = proxy.$settings;
    const c = proxy.$constants;
    const supporterList = ref([]);
    const responibilityList = ref([]);
    const showNick = ref(true);
    const toggleValue = ref("date");
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
        orderBy("date");
      })
      .catch(function (e) {});

    function orderBy(orderKey) {
      supporterList.value.sort((a, b) => {
        const as = a[orderKey].toLowerCase();
        const bs = b[orderKey].toLowerCase();
        if (as > bs) return 1;
        if (as < bs) return -1;
        return 0;
      });
    }
    return {
      supporterList,
      responibilityList,
      showNick,
      toggleValue,
      dateOptions,
      orderBy,
    };
  },
});
</script>
