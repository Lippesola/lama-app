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

export default defineComponent({
  name: 'NotLoggedIn',
  setup () {
    const $q = useQuasar()
    $q.dark.set('auto')

  }
})
</script>
