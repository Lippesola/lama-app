<template>
  <q-item bordered :clickable="link ? true : false" v-ripple :href="link">
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
import {defineComponent} from 'vue';

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
  }
})
</script> 