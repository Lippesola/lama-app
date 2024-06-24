<template>
  <div class="q-pa-md text-h4">
    {{ participator.firstName }} {{ participator.lastName }} -
    {{ participator.week === "teens" ? "Teens" : "Kids" }}
  </div>
  <div class="q-pa-md">
    <div class="q-gutter-md q-pb-md row" v-show="loading">
      <q-spinner color="primary" size="2em" />
      <span>Die Daten werden noch geladen..</span>
    </div>

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
          <q-item-label>
              {{ participator[question.id] }}
          </q-item-label>
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
          Object.entries(response.data).forEach((entry) => {
            const [index, item] = entry;
            participator.value[index] = (typeof item === 'string' && moment(item.split('T')[0], 'YYYY-MM-DD', true).isValid()) ? moment(item).format("DD.MM.YYYY") : item;
          });
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
      categories,
      questions,
      participator,
      confirmBooking,
      confirmQueue,
    };
  },
});
</script>
