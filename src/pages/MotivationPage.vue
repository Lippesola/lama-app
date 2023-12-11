<template>
  <div class="flex flex-center">
    <div class="col-sm- q-pa-md" style="max-width: 768px">
      <div class="q-py-md text-h4 text-primary">
        Motivationsbogen
        <q-btn
          v-if="registrationFlow"
          class="q-ml-md"
          color="primary"
          dense
          flat
          @click="saveUserMotivation(true)"
          icon="fa-solid fa-save"
        />
      </div>
      <div>
        <q-form @submit="saveUserMotivation">
          <DynamicInput
            v-for="item in motivation"
            class="q-mb-md"
            :key="item.id"
            :id="item.id"
            :type="item.type"
            :content="item.content"
            :hint="item.hint"
            :value="userMotivation[item.id]"
            @update:value="(value) => updateInput(value, item.id)"
          />
        </q-form>
      </div>
      <q-btn
        v-if="registrationFlow"
        class="q-mt-md q-mr-md"
        color="primary"
        label="Zwischenstand speichern"
        @click="saveUserMotivation(true)"
      />
      <q-btn
        v-if="registrationFlow"
        class="q-mt-md"
        color="primary"
        label="abgeben"
        @click="saveUserMotivation(false)"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from "vue";
import { useQuasar } from "quasar";
import DynamicInput from "components/DynamicInput.vue";

export default defineComponent({
  name: "MotivationPage",
  components: {
    DynamicInput,
  },
  props: {
    registrationFlow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const $q = useQuasar();
    const { proxy } = getCurrentInstance();
    const uuid = proxy.$keycloak.tokenParsed.sub;
    const paramUuid = proxy.$route.params.uuid;
    const api = proxy.$api;
    const settings = proxy.$settings;
    const c = proxy.$constants;
    const motivation = ref([]);
    const userMotivation = ref({});
    api
      .get("userMotivation/" + (paramUuid || uuid))
      .then((response) => {
        userMotivation.value = JSON.parse(response.data.motivation);
      })
      .catch((error) => {
        console.log(error);
      });
    api
      .get("motivation")
      .then((response) => {
        motivation.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    const saveUserMotivation = (draft) => {
      api
        .post("userMotivation/" + uuid, {
          motivation: JSON.stringify(userMotivation.value),
        })
        .then((response) => {
          if (draft) {
            $q.notify({
              message: "Änderungen gespeichert",
              color: "positive",
              icon: "fa-solid fa-check-circle",
              position: "bottom",
            });
          } else {
            // status updaten
            api
              .post("userYear/" + uuid + "/" + settings.currentYear, {
                status: c.userYearStatus.finishedMotivation,
              })
              .then((response) => {
                $q.notify({
                  message: "Motivationsbogen abgegeben",
                  color: "positive",
                  icon: "fa-solid fa-check-circle",
                  position: "bottom",
                });
                proxy.$router.push("/l/profile");
              })
              .catch((error) => {
                console.log(error);
                $q.notify({
                  message: "Fehler beim Speichern",
                  color: "negative",
                  icon: "fa-solid fa-exclamation-circle",
                  position: "bottom",
                });
              });
          }
        })
        .catch((error) => {
          console.log(error);
          $q.notify({
            message: "Fehler beim Speichern",
            color: "negative",
            icon: "fa-solid fa-exclamation-circle",
            position: "bottom",
          });
        });
    };
    const updateInput = (value, id) => {
      userMotivation.value[id] = value;
    };
    return {
      motivation,
      userMotivation,
      saveUserMotivation,
      updateInput,
    };
  },
});
</script>
