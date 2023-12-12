<template>
  <div class="q-pa-md text-h4">Motivationsbogen anpassen</div>
  <div class="q-pa-md" style="max-width: 768px">
    <div id="motivationList">
      <div v-for="item in motivation" :key="item.id">
        <q-card class="q-my-md" flat>
          <q-card-section>
            <div class="row q-pb-sm">
              <q-icon class="dragMe fa-solid fa-grip-lines q-pr-md"></q-icon>
              {{
                item.type === "h5"
                  ? "Überschrift"
                  : item.type === "p"
                  ? "Text"
                  : item.type === "input.text"
                  ? "Textfeld"
                  : item.type === "input.textarea"
                  ? "Textfeld (mehrzeilig)"
                  : item.type === "checkbox"
                  ? "Checkbox"
                  : item.type === "separator"
                  ? "Trennlinie"
                  : item.type
              }}
              <q-space />
              <q-btn
                flat
                dense
                round
                size="sm"
                icon="fa-solid fa-trash"
                @click="motivation.splice(motivation.indexOf(item), 1)"
              />
            </div>
            <div v-if="item.type === 'h5'">
              <q-input v-model="item.content" filled />
            </div>
            <div v-else-if="item.type === 'p'">
              <q-editor
                v-model="item.content"
                :toolbar="pToolbarButtons"
              />
            </div>
            <div v-else-if="item.type.split('.')[0] === 'input'">
              <q-editor
                v-model="item.hint"
                label="Hinweistext"
                class="q-mb-sm"
                :toolbar="inputHintToolbarButtons"
              />
              <q-input v-model="item.content" filled label="Label" />
            </div>
            <div v-else-if="item.type === 'checkbox'">
              <q-input v-model="item.content" filled label="Option" />
            </div>
            <div v-else-if="item.type === 'separator'">
              <q-separator />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  <q-page-sticky position="top-right" :offset="[18, 18]">
    <q-btn
      color="primary"
      icon="fa-solid fa-save"
      label="Speichern"
      @click="saveMotivation"
    />
  </q-page-sticky>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-fab
      color="primary"
      icon="fa-solid fa-plus"
      direction="up"
      vertical-actions-align="right"
    >
      <q-fab-action
        @click="addNewEntry('separator')"
        icon="fa-solid fa-minus"
        label="Trennlinie"
        color="secondary"
        text-color="black"
      />
      <q-fab-action
        @click="addNewEntry('checkbox')"
        icon="fa-solid fa-check-square"
        label="Checkbox"
        color="secondary"
        text-color="black"
      />
      <q-fab-action
        @click="addNewEntry('input.textarea')"
        icon="fa-solid fa-font"
        label="Textfeld (mehrzeilig)"
        color="secondary"
        text-color="black"
      />
      <q-fab-action
        @click="addNewEntry('input.text')"
        icon="fa-solid fa-font"
        label="Textfeld"
        color="secondary"
        text-color="black"
      />
      <q-fab-action
        @click="addNewEntry('p')"
        icon="fa-solid fa-paragraph"
        label="Text"
        color="secondary"
        text-color="black"
      />
      <q-fab-action
        @click="addNewEntry('h5')"
        icon="fa-solid fa-heading"
        label="Überschrift"
        color="secondary"
        text-color="black"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import { defineComponent, ref } from "vue";
import { api } from "src/boot/axios";
import Sortable from "sortablejs";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "MotivationFormPage",
  setup() {
    const $q = useQuasar();
    const motivation = ref([]);
    const pToolbarButtons = ref([
      ["bold", "italic", "underline", "strike"],
      ["undo", "redo"],
      ["unordered", "ordered", "outdent", "indent"],
    ]);
    const inputHintToolbarButtons = ref([
      ["bold", "italic", "underline", "strike"],
    ]);
    api
      .get("/motivation")
      .then(function (response) {
        motivation.value = response.data;
        console.log(motivation.value);
      })
      .catch(function (e) {
        console.log(e);
      });
    const saveMotivation = () => {
      motivation.value.forEach((item, index) => {
        item.prio = index;
      });
      api
        .post("/motivation", motivation.value)
        .then(function (response) {
          $q.notify({
            message: "Gespeichert",
            color: "positive",
            icon: "fa-solid fa-check",
          });
        })
        .catch(function (e) {
          $q.notify({
            message: "Fehler beim Speichern",
            color: "negative",
            icon: "fa-solid fa-times",
          });
          console.log(e);
        });
    };
    const addNewEntry = (type) => {
      motivation.value.push({
        id: Math.random().toString(36).slice(-8),
        type: type,
        content: "",
        hint: "",
        prio: motivation.value.length,
      });
    };

    return {
      motivation,
      pToolbarButtons,
      inputHintToolbarButtons,
      saveMotivation,
      addNewEntry,
    };
  },
  mounted() {
    const el = document.getElementById("motivationList");
    Sortable.create(el, {
      animation: 150,
      handle: ".dragMe",
      direction: "vertical",
      onEnd: function (evt) {
        const moved = this.motivation.splice(evt.oldIndex, 1)[0];
        this.motivation.splice(evt.newIndex, 0, moved);
      }.bind(this),
    });
  },
});
</script>
