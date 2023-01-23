<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import iconSet from 'quasar/icon-set/fontawesome-v6'

export default defineComponent({
  name: 'NotLoggedIn',
  setup () {
    const $q = useQuasar()
    $q.iconSet = iconSet
    $q.dark.set('auto')

  }
})
</script>
