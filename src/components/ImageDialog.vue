<template>
  <q-dialog>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div v-if="title" class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="fa-solid fa-times" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <img style="max-width: 100%;" :src="img" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ImageDialog',
  props: {
    img: {
      type: String,
      required: true
    },
    title: {
      type: String
    }
  }
})
</script>
