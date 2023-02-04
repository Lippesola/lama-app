<template>
  <q-dialog>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h4">Changelog</div>
        <q-space />
        <q-btn icon="fa-solid fa-times" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-for="(changes, version) in $changelog" :key="version">
        <div class="text-h6">{{ version }}</div>
        <ul v-for="change in changes" :key="version+change">
          <li>
            {{ change }}
          </li>
        </ul>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ChangelogDialog',
})
</script>
