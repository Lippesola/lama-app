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
        <q-input outlined hide-bottom-space style="width: 300px" type="text" v-model="plate" label="KFZ-Kennzeichen" hint="Dient der Parkplatzzuweisung auf dem Lagerplatz" :error="error.plate"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" v-model="church" label="Gemeinde"  :error="error.church"/>
        <q-select outlined hide-bottom-space style="width: 300px" :options="churchContactOptions" v-model="churchContact" label="Gemeindekontakt" hint="Kannst du in deiner Gemeinde Ansprechpartner fürs SOLA sein?" :error="error.churchContact"/>
        <q-input outlined hide-bottom-space style="width: 300px" type="text" v-model="job" label="Beruf"  :error="error.job"/>
        <q-select outlined hide-bottom-space :disable="!allowEditNutrition" style="width: 300px" multiple :options="$constants.nutritionOptions" v-model="nutrition" label="Ernährung" hint="Beachte bitte die Fußnote *" :error="error.nutrition"/>
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
    <div class="text-caption q-py-lg" v-if="allowEditNutrition">
      * Es kann <strong>vegetarisches</strong> und <strong>laktosefreies</strong> Essen angeboten werden.
      Für alle weiteren Fragen schreibst du am besten direkt eine Mail an <q-btn flat dense no-caps text-color="primary" :label="$settings.kitchenLeaderName" :href="'mailto:' + $settings.kitchenLeaderMail" />.
    </div>
    <div class="text-caption q-py-lg" v-if="!allowEditNutrition">
      * Aus organisatorischen Gründen kannst du die Ernährungsdaten jetzt nicht mehr selbst ändern. Wenn du Änderungswünsche hast, schreib bitte direkt eine Mail an <q-btn flat dense no-caps text-color="primary" :label="$settings.kitchenLeaderName" :href="'mailto:' + $settings.kitchenLeaderMail" />.
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref, watchEffect } from 'vue'
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
    const c = proxy.$constants
    const uuid = proxy.$route.params.uuid || proxy.$keycloak.tokenParsed.sub
    const allowEditNutrition = ref(proxy.$route.params.uuid || proxy.$route.path.startsWith('/r'))
    const firstName = ref('')
    const lastName = ref('')
    const nickname = ref('')
    const gender = ref('')
    const genderOptions = [
      {value:'m', label:"Männlich"},
      {value:'w', label:"Weiblich"}
    ]
    const mail = ref('')
    const birthday = ref('')
    const street = ref('')
    const zipCode = ref('')
    const city = ref('')
    const phone = ref('')
    const mobile = ref('')
    const plate = ref('')
    const church = ref('')
    const churchContact = ref('')
    const churchContactOptions = [
      {value:false, label:"Nein"},
      {value:true, label:"Ja"}
    ]
    const job = ref('')
    const nutrition = ref([])
    const error = ref({})
    const loading = ref(true)
    watchEffect(() => {
      allowEditNutrition.value = proxy.$route.params.uuid || proxy.$route.path.startsWith('/r');
    });
    api.get('/user/' + uuid)
    .then(function(response) {
      firstName.value = response.data.firstName
      lastName.value = response.data.lastName
      nickname.value = response.data.nickname
      gender.value = genderOptions[response.data.gender === 'm' ? 0 : response.data.gender === 'w' ? 1 : '']
      mail.value = response.data.mail
      birthday.value = new moment(response.data.birthday).format('YYYY-MM-DD')
      street.value = response.data.street
      zipCode.value = response.data.zipCode
      city.value = response.data.city
      phone.value = response.data.phone
      mobile.value = response.data.mobile
      plate.value = response.data.plate
      church.value = response.data.church
      churchContact.value = churchContactOptions[response.data.churchContact ? 1 : 0]
      job.value = response.data.job
      if (response.data.vegetarian) {
        nutrition.value.push(c.nutritionOptions[0])
      }
      if (response.data.lactose) {
        nutrition.value.push(c.nutritionOptions[1])
      }
      loading.value = false
    })
    return {
      firstName,
      lastName,
      nickname,
      gender,
      genderOptions,
      mail,
      birthday,
      street,
      zipCode,
      city,
      phone,
      mobile,
      plate,
      church,
      churchContact,
      churchContactOptions,
      job,
      nutrition,
      loading,
      props,
      error,
      allowEditNutrition,
      onSubmit() {
        error.value = {}
        let err = false
        if (!gender.value) {error.value['gender'] = true; err = true;}
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
        const nutritionValue = nutrition.value.map(n => n.value);
        api.post('/user/' + uuid, {
          firstName: firstName.value,
          lastName: lastName.value,
          nickname: nickname.value,
          gender: gender.value.value,
          mail: mail.value,
          birthday: birthday.value,
          street: street.value,
          zipCode: zipCode.value,
          city: city.value,
          phone: phone.value,
          mobile: mobile.value,
          plate: plate.value,
          church: church.value,
          churchContact: churchContact.value.value,
          job: job.value,
          vegetarian: nutritionValue.includes('vegetarian'),
          lactose: nutritionValue.includes('lactose'),
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
