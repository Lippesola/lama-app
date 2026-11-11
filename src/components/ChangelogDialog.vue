<template>
  <q-dialog>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h4">Changelog</div>
        <q-space />
        <q-btn flat round dense v-close-popup><AppIcon name="times" /></q-btn>
      </q-card-section>

      <q-card-section v-for="entry in $changelog" :key="entry.date">
        <div class="text-h6">{{ entry.label }}</div>
        <ul>
          <li v-for="change in entry.changes" :key="change">
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
