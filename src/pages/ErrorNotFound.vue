<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
          404
      </div>

      <div class="text-h4" style="opacity:.4">
        Hier hab ich nichts gefunden. Wir sollten woanders suchen. Jetzt heißt es erstmal
        <a href="https://a-z.lippesola.de/Abkuerzungen.html" style="color: white; text-decoration: none;">SABTA</a>
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Zur Startseite"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
