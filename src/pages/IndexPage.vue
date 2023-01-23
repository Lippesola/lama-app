<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Hab ich eine SOLA ID?</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Wenn du 2020 oder später als MA angemeldet warst, haben wir dir eine SOLA ID erstellt.
        Dein Benutzername sieht normalerweise so aus: <strong>vorname.nachname</strong>
      </q-card-section>
      <q-card-section class="q-pt-none">
        Falls du dein Passwort vergessen hast, klick auf "LOGIN MIT SOLA ID" und dann auf "Password vergessen?".
      </q-card-section>
      <q-card-section class="q-pt-none">
        Bei weiteren Fragen zur SOLA ID, kannst du einfach eine Mail an <q-btn href="mailto:it-support@lippesola.de" label="it-support@lippesola.de" flat dense color="primary" /> schicken.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

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
        <div class="q-py-md text-h4">Willkommen</div>
        <div class="q-pb-md text-body1">
          Um dich im Mitarbeiter-Bereich anmelden zu können, benötigst du deine SOLA ID.<br />
          Wenn du noch keine SOLA ID hast, kannst du dich hier einfach registrieren.
        </div>
        <q-btn
          icon="fa-solid fa-question-circle"
          flat
          dense
          @click="dialog=true"
        >
        <div class="q-pl-md text-caption">
          Hab ich eine Sola ID?
        </div>
        </q-btn>
      </div>
      <q-btn
        class="q-ma-md"
        label="Login mit SOLA ID"
        color="primary"
        href="/l/"
      />
      <q-btn
        class="q-ma-md"
        label="SOLA ID erstellen"
        color="primary"
        to="/registration"
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
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const dialog = ref(false)
    return {
      dialog
    }
  }
})
</script>
