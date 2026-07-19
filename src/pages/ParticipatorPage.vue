<template>
  <div class="q-pa-md row items-center justify-between">
    <div class="text-h4">
      {{ participator.firstName }} {{ participator.lastName }} -
      {{ participator.week === "teens" ? "Teens" : "Kids" }}
    </div>
    <q-btn
      :label="editMode ? 'Speichern' : 'Bearbeiten'"
      :color="editMode ? 'positive' : 'primary'"
      @click="editMode ? saveDetails() : (editMode = true)"
    />
  </div>
  <div class="q-pa-md">
    <div class="q-gutter-md q-pb-md row" v-show="loading">
      <q-spinner color="primary" size="2em" />
      <span>Die Daten werden noch geladen..</span>
    </div>

    <q-expansion-item
      expand-separator
      label="Kontakt / Eltern"
      default-opened
      class="text-h6"
    >
      <div class="q-pa-md row text-body1">
        <q-item
          v-for="field in contactFields"
          :key="field.id"
          style="width: 300px"
        >
          <q-item-section>
            <q-item-label caption>{{ field.label }}</q-item-label>
            <q-item-label v-if="!editMode">
              {{ displayValue(field.id) }}
            </q-item-label>
            <q-input
              v-else
              dense
              outlined
              v-model="participator[field.id]"
            />
          </q-item-section>
        </q-item>
      </div>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      :label="category.label"
      v-for="category in categories"
      :key="category"
      class="text-h6"
    >
      <div class="q-pa-md row text-body1">
        <q-item
          v-for="question in questions[category.id]"
          :key="question.id"
          style="width: 300px"
        >
          <q-item-section>
          <q-item-label caption>{{ question.label }}</q-item-label>
          <q-item-label v-if="!editMode">
              {{ displayValue(question.id) }}
          </q-item-label>
          <q-input
            v-else
            dense
            outlined
            :type="isDateField(question.id) ? 'date' : 'text'"
            v-model="participator[question.id]"
          />
          </q-item-section>
        </q-item>
      </div>
    </q-expansion-item>
    <div>
      <q-btn
        v-if="!participator.status || participator.status == 3"
        label="Freischalten"
        color="primary"
        @click="confirmBooking"
        class="q-ma-md"
      />
      <q-btn
        v-if="!participator.status"
        label="Warteliste"
        color="primary"
        @click="confirmQueue"
        class="q-ma-md"
      />
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";

// Feste Order-Felder aus Pretix, die kein eigenes participatorQuestion-Modell haben
// (siehe ORDER_ADDRESS_FIELDS/ORDER_TOP_LEVEL_FIELDS in lama-api participator.controller.js).
const CONTACT_FIELDS = [
  { id: "parentFirstName", label: "Vorname (Eltern)" },
  { id: "parentLastName", label: "Nachname (Eltern)" },
  { id: "parentMail", label: "E-Mail" },
  { id: "phone", label: "Telefon" },
  { id: "street", label: "Straße" },
  { id: "zipCode", label: "PLZ" },
  { id: "city", label: "Ort" },
  { id: "addressExtra", label: "Adresszusatz" },
];

function isDateValue(value) {
  return typeof value === "string" && moment(value, "YYYY-MM-DD", true).isValid();
}

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
    const loading = ref(true);
    const editMode = ref(false);

    const categories = ref([]);
    const questions = ref({});
    const participator = ref({});
    const orderId = proxy.$route.params.orderId;
    const positionId = proxy.$route.params.positionId;

    getParticipator();
    getCategories();
    getQuestions();

    function getParticipator() {
      api
        .get("/participator/" + orderId + "/" + positionId)
        .then(function (response) {
          const data = {};
          Object.entries(response.data).forEach(([key, value]) => {
            // Datumsfelder werden auf reines YYYY-MM-DD normalisiert (Rohwert fürs Editieren,
            // Anzeige erfolgt formatiert über displayValue()).
            data[key] = (typeof value === "string" && isDateValue(value.split("T")[0]))
              ? value.split("T")[0]
              : value;
          });
          participator.value = data;
          loading.value = false;
        })
        .catch(function (e) {
          loading.value = false;
          console.log(e);
        });
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
          response.data.forEach((question) => {
            if (questions.value[question.category] === void 0) {
              questions.value[question.category] = [];
            }
            questions.value[question.category].push(question);
          });
        })
        .catch(function (e) {
          console.log(e);
        });
    }

    function isDateField(key) {
      return isDateValue(participator.value[key]);
    }

    function displayValue(key) {
      const value = participator.value[key];
      if (isDateValue(value)) {
        return moment(value, "YYYY-MM-DD").format("DD.MM.YYYY");
      }
      return value;
    }

    function updateParticipator() {
      api.post("/participator/" + orderId + "/" + positionId, participator.value)
        .then(function (response) {
          $q.notify({
            message: "Die Daten wurden erfolgreich gespeichert",
            color: "positive",
            position: "top",
            timeout: 2000,
          });
        })
        .catch(function (e) {
          console.log(e);
        });
    }

    function saveDetails() {
      api
        .post("/participator/" + orderId + "/" + positionId + "/details", participator.value)
        .then(function () {
          editMode.value = false;
          $q.notify({
            message: "Die Daten wurden erfolgreich gespeichert",
            color: "positive",
            position: "top",
            timeout: 2000,
          });
          getParticipator();
        })
        .catch(function (e) {
          console.log(e);
          $q.notify({
            message: "Die Daten konnten nicht gespeichert werden",
            color: "negative",
            position: "top",
            timeout: 3000,
          });
        });
    }

    function confirmBooking() {
      $q.dialog({
        title: "Freischalten",
        message: "Soll " + participator.value.firstName + " freigeschaltet werden?" + (participator.value.status === 3 ? " Der Teilnehmer wird von der Warteliste genommen." : ""),
        cancel: true,
        persistent: true,
      }).onOk(() => {
        participator.value.status = 1;
        updateParticipator();
      });
    }

    function confirmQueue() {
      $q.dialog({
        title: "Warteliste",
        message: "Soll " + participator.value.firstName + " auf die Warteliste gesetzt werden?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        participator.value.status = 3;
        updateParticipator();
      });
    }

    return {
      loading,
      filter,
      editMode,
      categories,
      questions,
      participator,
      contactFields: CONTACT_FIELDS,
      isDateField,
      displayValue,
      saveDetails,
      confirmBooking,
      confirmQueue,
    };
  },
});
</script>
