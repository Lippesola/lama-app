<template>
  <q-page class="flex flex-center">
    <div class="col-sm-6" style="max-width: 768px;">
      <div class="q-pa-md">
        <q-item class="q-pl-none">
          <q-item-section side>
            <q-avatar size="75px">
              <img
              alt="LAMA logo"
              src="~assets/lama-logo.svg"
              style="width: 100%; height: 100%;"
              >
            </q-avatar>
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
        <div class="q-py-md text-h4">Warte auf Freischaltung</div>
        <div class="q-pb-md text-body1">
          Hey - Leider wurdest du bis jetzt noch nicht als MA freigeschaltet.<br />
          Der VB MA arbeitet sehr stark daran, dass das so schnell wie möglich passiert.<br />
          Bitte gedulde dich noch ein bisschen.
        </div>
      </div>
    </div>
    <q-footer class="flex flex-center bg-dark">
      <q-btn
          flat
          label="Impressum"
          href="https://www.lippesola.de/sola/kontakt/impressum/"
      />
      <q-separator vertical inset />
      <q-btn
        flat
        label="Datenschutzerklärung"
        href="https://www.lippesola.de/sola/datenschutzerklaerung/"
      />
      <q-separator vertical inset />
      <q-btn
        flat
        label="Feedback / Fragen"
        href="mailto:micha.preusser@lippesola.de"
      />
    </q-footer>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WaitingPage',
  setup() {
    return {
    }
  }
})
</script>
