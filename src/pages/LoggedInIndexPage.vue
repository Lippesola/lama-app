<template>
  <q-page class="flex flex-center">
    <div class="col-sm-6" style="max-width: 768px;">
      <div class="q-pa-md">
        <q-item class="q-pl-none">
          <q-item-section side>
            <img
              alt="LAMA logo"
              src="~assets/lama-logo.svg"
              style="width: 75px; height: 75px;"
              :class="animate"
              @click="imageClickHandler()"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div class="text-h4">LAMA</div>
            </q-item-label>
            <q-item-label caption>
              Lippesola Administration und Mitarbeiter-Anmeldung
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-ma-md" />
        <div class="q-py-md text-h4">Willkommen bei LAMA</div>
        <div class="q-pb-md text-body1">
          LAMA ist ein komplett neues Tool, was extra für das SOLA entwickelt wurde. Es ist leider sehr wahrscheindlich, dass nicht alles von Anfang an so läuft, wie wir es uns wünschen. <br />
          Wenn du Feedback oder Fragen hast, dann gib die bitte an uns weiter! Nur dann können wir einen MA-Bereich haben, wie ihn sich jeder wünscht.<br />
          Danke!
        </div>
        <q-btn
          label="Feedback geben"
          color="primary"
          href="mailto:micha.preusser@lippesola.de"
        />
      </div>
    </div>
  </q-page>

</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const animate = ref('');
    const animations = ["bounce", "flash", "flip", "pulse", "rubberBand", "shakeX", "shakeY", "headShake", "swing", "tada", "wobble", "jello", "heartBeat"];
    function imageClickHandler() {
      animate.value = "animated slower " + animations[Math.floor(Math.random() * animations.length)];
      setTimeout(() => {animate.value = ''}, 1000);
    }
    return {
      animate,
      imageClickHandler
    }
  }
})
</script>
