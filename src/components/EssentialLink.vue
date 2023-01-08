<template>
  <q-item
  clickable
  :to="link"
  >
  <q-item-section
  v-if="icon"
  avatar
  >
  <q-badge class="q-ml-md" v-show="badge > 0" color="orange" text-color="black" :label="badge" on-right/>
  <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    badge: {
      type: String,
      default: '0'
    }
  }
})
</script>
