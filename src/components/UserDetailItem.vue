<template>
  <q-item bordered clickable v-ripple @click="copyToClipboard(value, label)">
    <q-item-section avatar top>
      <q-avatar :text-color="color" :icon="icon"/>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ value }}</q-item-label>
      <q-item-label caption>{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import {defineComponent} from 'vue'
import {copyToClipboard} from 'quasar';

export default defineComponent({
  name: "UserDetailItem",
  props: {
    icon: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
    link: {
      type: String,
      default: '#'
    }
  },
  methods: {
    copyToClipboard(value, label) {
      navigator.clipboard.writeText(value).then(() => {
        this.$q.notify({
          message:`${label} kopiert!`,
          color: 'positive',
          position: 'top'
        })
      }).catch(() => {
        this.$q.notify({
          message: 'Kopieren fehlgeschlagen',
          color: 'negative',
          position: 'top'
        })
      })
    }
  }
})
</script> 