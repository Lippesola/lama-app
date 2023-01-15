<template>
  <q-page class="flex flex-center">
    <div class="col-sm-6" style="max-width: 768px;">
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
      <div class="q-py-md text-h4">Willkommen</div>
      <div class="q-pb-md text-body1">
        Um dich im Mitarbeiter-Bereich anmelden zu können, benötigst du deine SOLA-ID.<br />
        Wenn du noch keine SOLA-ID hast, kannst du dich hier einfach registrieren.
      </div>
      <q-btn
        class="q-mr-md"
        label="Login mit SOLA-ID"
        color="primary"
        href="/l/"
      />
      <q-btn
        label="SOLA-ID erstellen"
        color="primary"
        to="/register"
      />
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
  name: 'IndexPage'
})
</script>
