<template>
  <component :is="resolved" :size="size" :stroke-width="strokeWidth" :fill="fill" />
</template>

<script>
import { defineComponent } from 'vue'
import { iconRegistry, fallbackIcon } from 'src/boot/icons'

export default defineComponent({
  name: 'AppIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: undefined
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    },
    fill: {
      type: String,
      default: 'none'
    }
  },
  computed: {
    resolved() {
      const component = iconRegistry[this.name]
      if (!component && process.env.DEV) {
        console.warn(`[AppIcon] unbekanntes Icon: "${this.name}"`)
      }
      return component || fallbackIcon
    }
  }
})
</script>
