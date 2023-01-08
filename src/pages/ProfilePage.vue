<template>

  <div class="q-pa-md text-h4">Dein Profil</div>
  <div class="q-pa-md" style="max-width: 400px">
    <div class="q-gutter-md q-pb-md row" v-show="loading">
      <q-spinner
        color="primary"
        size="2em"
      />
      <span>Deine Daten werden noch geladen..</span>
    </div>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input outlined type="text" v-model="firstName" label="Vorname" stack-label :rules="[val => !!val || 'Eingabe erforderlich']" />
      <q-input outlined type="text" v-model="lastName" label="Nachname" stack-label :rules="[val => !!val || 'Eingabe erforderlich']" />
      <q-input outlined type="text" v-model="nickname" label="Spitzname" hint="Wie möchtest du auf dem SOLA genannt werden?" />
      <q-input outlined type="text" v-model="relationship" label="Beziehungsstatus" stack-label />
      <q-input outlined type="text" v-model="gender" label="Geschlecht" stack-label :rules="[val => !!val || 'Eingabe erforderlich']" />
      <q-input outlined type="email" v-model="mail" label="E-Mail" stack-label :rules="[val => !!val || 'Eingabe erforderlich']" />
      <q-input outlined type="date" v-model="birthday" label="Geburtstag" stack-label :rules="[val => !!val || 'Eingabe erforderlich']" />
      <q-input outlined type="text" v-model="street" label="Straße und Hausnummer" stack-label :rules="[val => !!val || 'Eingabe erforderlich']" />
      <q-input outlined type="text" v-model="zipCode" label="Postleitzahl" stack-label :rules="[val => !!val || 'Eingabe erforderlich']" />
      <q-input outlined type="text" v-model="city" label="Ort" stack-label :rules="[val => !!val || 'Eingabe erforderlich']" />
      <q-input outlined type="tel" v-model="phone" label="Telefonnummer" stack-label />
      <q-input outlined type="tel" v-model="mobile" label="Handynummer" stack-label :rules="[val => !!val || 'Eingabe erforderlich']" />
      <q-input outlined type="text" v-model="church" label="Gemeinde" stack-label />
      <q-input outlined type="text" v-model="churchContact" label="Gemeindekontakt" stack-label hint="Kannst du in deiner Gemeinde Ansprechpartner fürs SOLA sein?"/>
      <q-input outlined type="text" v-model="job" label="Beruf" stack-label />
      <div class="q-py-md">
        <q-btn label="Speichern" type="submit" color="primary"/>
      </div>
    </q-form>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import 'vue-advanced-cropper/dist/style.css';
import moment from 'moment'
export default {
  name: 'ProfilePage',
  
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$keycloak.tokenParsed.sub

    const firstName = ref('')
    const lastName = ref('')
    const nickname = ref('')
    const gender = ref('')
    const relationship = ref('')
    const mail = ref('')
    const birthday = ref('')
    const street = ref('')
    const zipCode = ref('')
    const city = ref('')
    const phone = ref('')
    const mobile = ref('')
    const church = ref('')
    const churchContact = ref('')
    const job = ref('')

    const loading = ref(true)

    api.get('/user/' + uuid)
    .then(function(response) {
      firstName.value = response.data.firstName
      lastName.value = response.data.lastName
      nickname.value = response.data.nickname
      gender.value = response.data.gender
      relationship.value = response.data.relationship
      mail.value = response.data.mail
      birthday.value = new moment(response.data.birthday).format('YYYY-MM-DD')
      street.value = response.data.street
      zipCode.value = response.data.zipCode
      city.value = response.data.city
      phone.value = response.data.phone
      mobile.value = response.data.mobile
      church.value = response.data.church
      churchContact.value = response.data.churchContact
      job.value = response.data.job
      loading.value = false
    })
    return {
      firstName,
      lastName,
      nickname,
      gender,
      relationship,
      mail,
      birthday,
      street,
      zipCode,
      city,
      phone,
      mobile,
      church,
      churchContact,
      job,
      loading,
      onSubmit() {
        api.post('/user/' + uuid, {
          firstName: firstName.value,
          lastName: lastName.value,
          nickname: nickname.value,
          gender: gender.value,
          relationship: relationship.value,
          mail: mail.value,
          birthday: birthday.value,
          street: street.value,
          zipCode: zipCode.value,
          city: city.value,
          phone: phone.value,
          mobile: mobile.value,
          church: church.value,
          churchContact: churchContact.value,
          job: job.value
        })
        .then(function() {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fa-solid fa-check',
            message: 'Gespeichert'
          })
        })
        .catch(function() {
          $q.notify({
            color: 'red-4',
            textColor: 'white',
            icon: 'fa-solid fa-circle-xmark ',
            message: 'Fehler'
          })
        })
      }
    }
  }
  
}
</script>
