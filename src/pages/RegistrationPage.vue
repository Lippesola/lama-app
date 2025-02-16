<template>
  <q-page class="flex flex-center">
    <div class="col-sm-6" style="max-width: 768px;">
      <div v-if="idCreated === 'false'">
        <div class="q-pa-md">
          <div class="q-py-md text-h4">SOLA ID erstellen</div>
          <div class="q-pb-md text-body1">
            Die SOLA ID gibt dir als Mitarbeiter die Möglichkeit, dich in (fast) allen SOLA-Anwendungen anmelden zu können und mit der Anmeldung für dieses Jahr zu starten.
          </div>
        </div>

        <q-form @submit="onSubmit" >
          <div class="q-gutter-md row">
            <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="given-name" v-model="firstName" label="Vorname" :rules="[val => !!val || 'Eingabe erforderlich']" />
            <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="family-name" v-model="lastName" label="Nachname" :rules="[val => !!val || 'Eingabe erforderlich']" />
            <q-input outlined hide-bottom-space style="width: 300px" type="email" autocomplete="email" v-model="mail" label="E-Mail" :rules="[val => !!val || 'Eingabe erforderlich']" />
          </div>
          <q-btn class="q-ma-md" label="Speichern" type="submit" color="primary"/>
        </q-form>
      </div>
      <div v-if="idCreated === 'true'">
        <div class="q-py-md text-h4">Deine SOLA ID wurde erfolgreich erstellt 🎉</div>
        <div class="q-pb-md text-body1">
          Wenn du auf weiter klickst, kannst du dich direkt mit folgenden Daten anmelden.<br />
          Bitte kopier das Passwort, bevor du auf den Button klickst!
          <p class="q-py-md">
            Benutzername: <strong>{{ username }}</strong> <br />
            Passwort: <strong>{{ password }}</strong>
          </p>
        </div>
        <q-btn label="Mit SOLA ID anmelden" href="/l/" color="primary"/>
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
import { api } from 'src/boot/axios'
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'RegistrationPage',
  setup() {
    const $q = useQuasar();

    const firstName = ref('')
    const lastName = ref('')
    const mail = ref('')
    const username = ref('')
    const password = ref('')
    const idCreated = ref('false')

    return {
      firstName,
      lastName,
      mail,
      username,
      password,
      idCreated,
      onSubmit() {
        api.post('/registration', {
          firstName: firstName.value,
          lastName: lastName.value,
          mail: mail.value
        })
        .then(function(a) {
          username.value = a.data.username
          password.value = a.data.password
          idCreated.value = 'true'
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fa-solid fa-check',
            message: 'Gespeichert'
          })
        })
        .catch(function(e) {
          $q.notify({
            color: 'red-4',
            textColor: 'white',
            icon: 'fa-solid fa-circle-xmark',
            message: e.response?.data || 'Fehler'
          })
        })
      }
    }
  }
})
</script>
