<template>
  <div>
    <div v-if="type.split('.')[0] == 'input' || type.split('.')[0] == 'checkbox'">
      <div class="q-pb-sm">
        <label :for="id">{{ hint }}</label>
      </div>
      <div>
        <q-input
          v-if="type.split('.')[0] == 'input'"
          :name="id"
          :id="id"
          :type="type.split('.')[1] || 'text'"
          :label="content"
          outlined
          :model-value="value"
          @change="e => emitValue(e)" 
        />
        <q-checkbox
          v-else-if="type.split('.')[0] == 'checkbox'"
          :name="id"
          :label="content"
          :model-value="!!value"
          @update:model-value="e => emitValue(e)"
        />
      </div>
    </div>
    <div v-else>
      <p
        v-if="type.split('.')[0] == 'p'"
        :name="id"
        v-html="content"
      ></p>
      <div
        v-else-if="type.split('.')[0] == 'h5'"
        class="text-h5 q-pt-md text-secondary"
        :name="id"
        v-html="content"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DynamicInput",
  props: {
    id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    hint: {
      type: String,
      default: "",
    },

    value: {
      type: [String, Boolean],
      default: "",
    },
  },
  methods: {
    emitValue(value) {
      this.$emit("update:value", value);
    },
  }
});
</script>