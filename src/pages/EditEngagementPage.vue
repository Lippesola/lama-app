<template>
  <div class="q-pa-md text-h4">Dein SOLA {{ $settings.currentYear }}</div>
  <div class="q-pa-md">
    <div class="q-gutter-md q-pb-md row" v-show="loading">
      <q-spinner color="primary" size="2em" />
      <span>Deine Daten werden noch geladen..</span>
    </div>
    <q-form @submit="onSubmit">
      <div class="q-pt-md text-h5">Termine</div>
      <div class="q-pb-md text-body1">
        Für die Planung ist es wichtig, dass wir möglichst früh wissen, wann du
        dabei sein kannst. Wenn du "Wahrscheinlich ja" oder "Wahrscheinlich
        nein" angibst, denk bitte daran, diese Info zu aktualisieren, sobald
        Gewissheit herrscht!
      </div>
      <div class="q-gutter-md row">
        <q-select
          outlined
          stack-label
          hide-bottom-space
          behavior="menu"
          style="width: 300px"
          v-for="item in participationList"
          v-model="participationSelect[item.id]['value']"
          :key="item.id"
          :options="item.options"
          :label="item.title"
          :hint="item.hint"
          :error="error[item.id]"
        />
      </div>

      <div class="q-pt-xl text-h5">Deine Mitarbeit beim SOLA</div>
      <div class="q-pb-md text-body1">
        In welchem Team möchtest du beim SOLA mitarbeiten?
      </div>
      <div class="q-gutter-md row">
        <q-select
          outlined
          stack-label
          hide-bottom-space
          behavior="menu"
          style="width: 300px"
          v-for="item in wishList"
          v-model="wishSelect[item.id]['value']"
          :key="item.id"
          :id="item.id"
          :options="item.options"
          :label="item.title"
          :hint="item.hint"
          :error="error[item.id]"
        />
      </div>

      <q-input
        v-if="wishSelect?.wishOther?.value?.value"
        v-model="wishOtherText"
        type="textarea"
        outlined
        label="Sonstige Wünsche"
        class="q-mt-md"
        required
      />

      <div class="q-pt-xl text-h5">Wo kannst du noch unterstützen?</div>
      <div class="q-pb-md text-body1">
        Die untenstehenden Punkte sind unabhängig von dem Team, in dem du
        mitarbeitest
      </div>
      <div class="q-gutter-md row">
        <q-select
          outlined
          stack-label
          hide-bottom-space
          behavior="menu"
          style="width: 300px"
          v-for="item in roleList"
          v-model="roleSelect[item.id]['value']"
          :key="item.id"
          :options="item.options"
          :label="item.title"
          :hint="item.hint"
          :error="error[item.id]"
        />
      </div>

      <div class="q-pt-xl text-h5">Sonstige Anmerkungen</div>
      <div class="q-pb-md text-body1"></div>
      <q-input
        v-model="comment"
        outlined
        type="textarea"
        :label="
          'Dinge, die relevant für deine Mitarbeit beim SOLA ' +
          $settings.currentYear +
          ' sind.'
        "
      />
      <div class="q-pt-lg">
        <q-btn label="Speichern" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from "vue";
import { api } from "../boot/axios";
import { useQuasar } from "quasar";
import { settings } from "../boot/settings";
import moment from "moment";
export default {
  name: "EditEngagementPage",

  props: {
    registrationFlow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const $q = useQuasar();
    const { proxy } = getCurrentInstance();
    const uuid = proxy.$route.params.uuid || proxy.$keycloak.tokenParsed.sub;
    const c = proxy.$constants;

    const loading = ref(true);

    const wishOtherText = ref("");
    const comment = ref("");
    const participationList = c.engagement.participation;
    const roleList = c.engagement.roles;
    const wishList = c.engagement.wishes;

    const error = ref({});

    let participationSelect = {};
    let roleSelect = {};
    let wishSelect = {};

    Object.entries(participationList).forEach((entry) => {
      const [index, item] = entry;
      participationSelect[item.id] = ref("");
    });
    Object.entries(roleList).forEach((entry) => {
      const [index, item] = entry;
      roleSelect[item.id] = ref("");
    });
    Object.entries(wishList).forEach((entry) => {
      const [index, item] = entry;
      wishSelect[item.id] = ref("");
    });

    api
      .get("/userYear/" + uuid + "/" + settings.currentYear)
      .then(function (response) {
        Object.entries(participationList).forEach((entry) => {
          const [index, item] = entry;
          if (participationSelect[item.id]) {
            participationSelect[item.id]["value"] =
              participationList[item.id]["options"][response.data[item.id]];
          }
        });
        Object.entries(roleList).forEach((entry) => {
          const [index, item] = entry;
          if (roleSelect[item.id]) {
            roleSelect[item.id]["value"] =
              roleList[item.id]["options"][response.data[item.id]];
          }
        });
        Object.entries(wishList).forEach((entry) => {
          const [index, item] = entry;
          if (wishSelect[item.id]) {
            wishSelect[item.id]["value"] =
              wishList[item.id]["options"][response.data[item.id]];
          }
        });
        wishOtherText.value = response.data.wishOtherText;
        comment.value = response.data.comment;
        loading.value = false;
      });
    return {
      participationList,
      participationSelect,
      roleList,
      roleSelect,
      wishList,
      wishSelect,
      wishOtherText,
      comment,
      error,
      loading,
      onSubmit() {
        var body = {};
        let err = false;
        Object.entries(participationList).forEach((entry) => {
          const [index, item] = entry;
          if (participationSelect[item.id]["value"]) {
            body[item.id] = participationSelect[item.id]["value"]["value"];
          } else {
            error.value[item.id] = true;
            err = true;
          }
        });
        Object.entries(roleList).forEach((entry) => {
          const [index, item] = entry;
          if (roleSelect[item.id]["value"]) {
            body[item.id] = roleSelect[item.id]["value"]["value"];
          } else {
            error.value[item.id] = true;
            err = true;
          }
        });
        Object.entries(wishList).forEach((entry) => {
          const [index, item] = entry;
          if (wishSelect[item.id]["value"]) {
            body[item.id] = wishSelect[item.id]["value"]["value"];
          } else {
            error.value[item.id] = true;
            err = true;
          }
        });
        if (err) {
          $q.notify({
            color: "red-4",
            textColor: "white",
            icon: "fa-solid fa-circle-xmark ",
            message: "Bitte fülle alle Felder aus",
          });
          return;
        }
        body["wishOtherText"] = wishOtherText.value;
        body["comment"] = comment.value;

        api
          .post("/userYear/" + uuid + "/" + settings.currentYear, body)
          .then(function () {
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "fa-solid fa-check",
              message: "Gespeichert",
            });
            if (props.registrationFlow) {
              location.href = "/r/";
            }
          })
          .catch(function () {
            $q.notify({
              color: "red-4",
              textColor: "white",
              icon: "fa-solid fa-circle-xmark ",
              message: "Fehler",
            });
          });
      },
    };
  },
};
</script>
