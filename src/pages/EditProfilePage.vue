<template>

  <div class="q-pa-md text-h4">Dein Profil</div>
  <div class="q-pa-md">
    <div class="q-gutter-md q-pb-md row" v-show="loading">
      <q-spinner
        color="primary"
        size="2em"
      />
      <span>Deine Daten werden noch geladen..</span>
    </div>
    <q-form @submit="onSubmit">
      <div class="q-gutter-md row">
        <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="given-name" v-model="firstName" label="Vorname"  :error="error.firstName"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="family-name" v-model="lastName" label="Nachname"  :error="error.lastName"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="username" v-model="nickname" label="Spitzname" hint="Wie möchtest du auf dem SOLA genannt werden?"  :error="error.nickname"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="date" autocomplete="bday" v-model="birthday" label="Geburtstag"  :error="error.birthday"/>
        <q-select outlined hide-bottom-space style="width: 300px" :options="genderOptions" v-model="gender" label="Geschlecht"  :error="error.gender"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="email" autocomplete="email" v-model="mail" label="E-Mail"  :error="error.mail"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="street-address" v-model="street" label="Straße und Hausnummer"  :error="error.street"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="postal-code" v-model="zipCode" label="Postleitzahl" hint="Wenn du nicht in Deutschland wohnst, gib 00000 an."  maxlength="5"  :error="error.zipCode"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="address-level2" v-model="city" label="Ort"  :error="error.city"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="tel" autocomplete="tel-national" v-model="phone" label="Telefonnummer"  :error="error.phone"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="tel" autocomplete="tel" v-model="mobile" label="Handynummer"  :error="error.mobile"/>
        <q-select outlined hide-bottom-space style="width: 300px" :options="relationshipOptions" v-model="relationship" label="Beziehungsstatus"  :error="error.relationship"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" v-model="church" label="Gemeinde"  :error="error.church"/>
        <q-select outlined hide-bottom-space style="width: 300px" :options="churchContactOptions" v-model="churchContact" label="Gemeindekontakt" hint="Kannst du in deiner Gemeinde Ansprechpartner fürs SOLA sein?" :error="error.churchContact"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" v-model="job" label="Beruf"  :error="error.job"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" v-model="nutrition" label="Ernährung" hint="Bitte lies dir den Hinweis unten durch *"  :error="error.nutrition"/>
      </div>
      <div class="q-py-md">
        <q-btn label="Speichern" type="submit" color="primary"/>
      </div>
    </q-form>
    <q-btn 
      v-if="!props.registrationFlow"
      flat
      dense
      to="/l/avatar"
      label="Profilbild anpassen"
      color="primary"
    />
    <div class="text-caption q-py-lg">
      * Bitte schreib kein "Alles", "Viel", etc. in das Eingabefeld, sondern nur Dinge, die man ernsthaft beachten muss. Die Küche versucht auf Besonderheiten bei der Ernährung aufgrund von Unverträglichkeiten, Allergien o. Ä. einzugehen.
      Hierbei kann <strong>vegetarisches</strong> und <strong>laktosefreies</strong> Essen angeboten werden.
      Für alle weiteren Fragen schreibst du <q-btn flat dense no-caps text-color="primary" :label="$settings.kitchenLeaderName" :href="'mailto:' + $settings.kitchenLeaderMail" /> am besten direkt.
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import 'vue-advanced-cropper/dist/style.css';
import moment from 'moment'
export default {
  name: 'EditProfilePage',
  props: {
    registrationFlow: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$route.params.uuid || proxy.$keycloak.tokenParsed.sub

    const firstName = ref('')
    const lastName = ref('')
    const nickname = ref('')
    const gender = ref('')
    const genderOptions = [
      {value:'m', label:"Männlich"},
      {value:'w', label:"Weiblich"}
    ]
    const relationship = ref('')
    const relationshipOptions = [
      {value:0, label:"Single"},
      {value:1, label:"In einer Beziehung"},
      {value:2, label:"Bitte fragt mich in einem persönlichen Gespräch"}
    ]
    const mail = ref('')
    const birthday = ref('')
    const street = ref('')
    const zipCode = ref('')
    const city = ref('')
    const phone = ref('')
    const mobile = ref('')
    const church = ref('')
    const churchContact = ref('')
    const churchContactOptions = [
      {value:false, label:"Nein"},
      {value:true, label:"Ja"}
    ]
    const job = ref('')
    const nutrition = ref('')
    const error = ref({})
    const loading = ref(true)

    api.get('/user/' + uuid)
    .then(function(response) {
      firstName.value = response.data.firstName
      lastName.value = response.data.lastName
      nickname.value = response.data.nickname
      gender.value = genderOptions[response.data.gender === 'm' ? 0 : response.data.gender === 'w' ? 1 : '']
      relationship.value = relationshipOptions[response.data.relationship]
      mail.value = response.data.mail
      birthday.value = new moment(response.data.birthday).format('YYYY-MM-DD')
      street.value = response.data.street
      zipCode.value = response.data.zipCode
      city.value = response.data.city
      phone.value = response.data.phone
      mobile.value = response.data.mobile
      church.value = response.data.church
      churchContact.value = churchContactOptions[response.data.churchContact ? 1 : 0]
      job.value = response.data.job
      nutrition.value = response.data.nutrition
      loading.value = false
    })
    return {
      firstName,
      lastName,
      nickname,
      gender,
      genderOptions,
      relationship,
      relationshipOptions,
      mail,
      birthday,
      street,
      zipCode,
      city,
      phone,
      mobile,
      church,
      churchContact,
      churchContactOptions,
      job,
      nutrition,
      loading,
      props,
      error,
      onSubmit() {
        error.value = {}
        let err = false
        if (!gender.value) {error.value['gender'] = true; err = true;}
        if (!relationship.value) {error.value['relationship'] = true; err = true;}
        if (!churchContact.value) {error.value['churchContact'] = true; err = true;}
        if (err) {
          $q.notify({
            color: 'red-4',
            textColor: 'white',
            icon: 'fa-solid fa-circle-xmark ',
            message: "Bitte überprüfe deine Angaben"
          })
          return;
        }
        api.post('/user/' + uuid, {
          firstName: firstName.value,
          lastName: lastName.value,
          nickname: nickname.value,
          gender: gender.value.value,
          relationship: relationship.value.value,
          mail: mail.value,
          birthday: birthday.value,
          street: street.value,
          zipCode: zipCode.value,
          city: city.value,
          phone: phone.value,
          mobile: mobile.value,
          church: church.value,
          churchContact: churchContact.value.value,
          job: job.value,
          nutrition: nutrition.value
        })
        .then(function() {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fa-solid fa-check',

            message: 'Gespeichert'
          })
          if (props.registrationFlow) {
            location.href='/r/'
          }
        })
        .catch(function(e) {
          let errMsg = 'Fehler'
          if (e && e.response && e.response.data) {
            e.response.data.forEach((err) => {
              error.value[err] = true
            })
            errMsg = 'Bitte überprüfe deine Angaben'
          }
          $q.notify({
            color: 'red-4',
            textColor: 'white',
            icon: 'fa-solid fa-circle-xmark ',
            message: errMsg
          })
        })
      }
    }
  }
  
}
</script>
