<template>
  <div class="flex flex-center">
    <transition name="fade">
      <div
        v-if="registrationFlow && autosaveStatus"
        class="autosave-indicator text-caption"
        :class="autosaveError ? 'text-negative' : 'text-grey-7'"
      >
        {{ autosaveStatus }}
      </div>
    </transition>
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
        >
          <AppIcon name="save" />
        </q-btn>
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
import { defineComponent, ref, getCurrentInstance, onBeforeUnmount } from "vue";
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
    let loaded = false;
    api
      .get("userMotivation/" + (paramUuid || uuid))
      .then((response) => {
        userMotivation.value = JSON.parse(response.data.motivation);
        loaded = true;
      })
      .catch((error) => {
        console.log(error);
        // Nothing stored yet: safe to start autosaving.
        if (error?.response?.status === 404) {
          loaded = true;
        }
      });
    api.get("userYear/additionalInfo/" + (paramUuid || uuid))
      .then((response) => {
        const isNew = response.data.isNew;
        const isLeader = response.data.isLeader;

        api
          .get("motivation")
          .then((response) => {
            const data = response.data;
            data.forEach(element => {
              if (isLeader) {
                if (element.showForLeader) {
                  motivation.value.push(element)
                }
                return;
              }
              if (isNew && element.showForNew) {
                motivation.value.push(element)
                return;
              }
              if (!isNew && element.showForExisting) {
                motivation.value.push(element)
                return;
              }
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
    const autosaveDelay = 3000;
    let autosaveTimer = null;
    const autosaveStatus = ref("");
    const autosaveError = ref(false);
    let hideTimer = null;
    // Small, unobtrusive hint that hides itself again.
    const showAutosaveStatus = (message, error, hideAfter) => {
      clearTimeout(hideTimer);
      autosaveStatus.value = message;
      autosaveError.value = error;
      if (hideAfter) {
        hideTimer = setTimeout(() => (autosaveStatus.value = ""), hideAfter);
      }
    };
    const cancelAutosave = () => {
      if (autosaveTimer) {
        clearTimeout(autosaveTimer);
        autosaveTimer = null;
      }
    };
    const autosave = () => {
      autosaveTimer = null;
      showAutosaveStatus("Speichert …", false, 0);
      api
        .post("userMotivation/" + uuid, {
          motivation: JSON.stringify(userMotivation.value),
        })
        .then(() => {
          showAutosaveStatus("✓ Gespeichert", false, 2000);
        })
        .catch((error) => {
          console.log(error);
          showAutosaveStatus("Automatisches Speichern fehlgeschlagen", true, 5000);
        });
    };
    const scheduleAutosave = () => {
      // Only drafts in the registration flow are autosaved, and only
      // after the existing data has been loaded (avoids overwriting it).
      if (!props.registrationFlow || !loaded) {
        return;
      }
      cancelAutosave();
      autosaveTimer = setTimeout(autosave, autosaveDelay);
    };
    onBeforeUnmount(() => {
      // Flush pending changes instead of losing them on navigation.
      if (autosaveTimer) {
        cancelAutosave();
        autosave();
      }
    });
    const saveUserMotivation = (draft) => {
      cancelAutosave();
      api
        .post("userMotivation/" + uuid, {
          motivation: JSON.stringify(userMotivation.value),
        })
        .then((response) => {
          if (draft) {
            $q.notify({
              message: "Änderungen gespeichert",
              color: "positive",
              icon: "check-circle",
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
                  icon: "check-circle",
                  position: "bottom",
                });
                proxy.$router.push("/l/profile");
              })
              .catch((error) => {
                console.log(error);
                $q.notify({
                  message: "Fehler beim Speichern",
                  color: "negative",
                  icon: "exclamation-circle",
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
            icon: "exclamation-circle",
            position: "bottom",
          });
        });
    };
    const updateInput = (value, id) => {
      userMotivation.value[id] = value;
      scheduleAutosave();
    };
    return {
      autosaveStatus,
      autosaveError,
      motivation,
      userMotivation,
      saveUserMotivation,
      updateInput,
    };
  },
});
</script>

<style scoped>
.autosave-indicator {
  position: fixed;
  right: 16px;
  top: 12px;
  z-index: 2000;
  padding: 2px 10px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
