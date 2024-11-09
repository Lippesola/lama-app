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
        <div class="q-py-md text-h4">Willkommen im MA-Bereich</div>
        <div class="q-pb-md text-body1">
          Hier kannst du deine persönlichen Daten anpassen, deine Mitarbeit auf dem SOLA verwalten und andere Mitarbeiter finden.
          Wenn du Fragen oder Feedback zu LAMA hast, klick einfach auf den Button.
        </div>
        <q-btn
          label="LAMA Hilfe-Button"
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
