<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 1024px;" v-if="!registrated">
      <div class="q-py-md text-h4">Helfer-Anmeldung</div>
      <div class="q-pb-md text-body1">
        Wenn du nicht komplett beim SOLA dabei sein kannst und trotzdem gerne helfen möchtest, kannst du dich hier als Helfer anmelden.
      </div>
      <q-form @submit="onSubmit">
        <div class="q-pt-md text-h5">Über dich</div>
        <div class="q-pb-md text-body1"></div>
        <div class="q-gutter-md row">
          <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="given-name" v-model="firstName" label="Vorname"  :error="error.firstName"/>
          <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="family-name" v-model="lastName" label="Nachname"  :error="error.lastName"/>
          <q-input outlined hide-bottom-space style="width: 300px" type="date" autocomplete="bday" v-model="birthday" label="Geburtstag"  :error="error.birthday"/>
          <q-select outlined hide-bottom-space style="width: 300px" :options="genderOptions" v-model="gender" label="Geschlecht"  :error="error.gender"/>
          <q-input outlined hide-bottom-space style="width: 300px" type="email" autocomplete="email" v-model="mail" label="E-Mail"  :error="error.mail"/>
          <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="street-address" v-model="street" label="Straße und Hausnummer"  :error="error.street"/>
          <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="postal-code" v-model="zipCode" label="Postleitzahl" hint="Wenn nicht vorhanden, gib bitte 00000 an."  maxlength="5"  :error="error.zipCode"/>
          <q-input outlined hide-bottom-space style="width: 300px" type="text" autocomplete="address-level2" v-model="city" label="Ort"  :error="error.city"/>
          <q-input outlined hide-bottom-space style="width: 300px" type="tel" autocomplete="tel-national" v-model="phone" label="Telefonnummer"  :error="error.phone"/>
          <q-input outlined hide-bottom-space style="width: 300px" type="tel" autocomplete="tel" v-model="mobile" label="Handynummer"  :error="error.mobile"/>
          <q-input outlined hide-bottom-space style="width: 300px" type="text" v-model="job" label="Beruf"  :error="error.job"/>
          <q-select outlined hide-bottom-space style="width: 300px" multiple :options="nutritionOptions" v-model="nutrition" label="Ernährung" hint="Beachte bitte die Fußnote *" :error="error.nutrition"/>
        </div>
        <div class="text-caption q-py-lg">
          * Die Küche versucht auf Besonderheiten bei der Ernährung aufgrund von Unverträglichkeiten, Allergien o. Ä. einzugehen.
          Hierbei kann <strong>vegetarisches</strong> und <strong>laktosefreies</strong> Essen angeboten werden.
          Für alle weiteren Fragen schreibst du <q-btn flat dense no-caps text-color="primary" :label="$settings.kitchenLeaderName" :href="'mailto:' + $settings.kitchenLeaderMail" /> am besten direkt.
        </div>

        <div class="q-pt-md text-h5">Art der Unterstützung</div>
        <div class="q-pb-md text-body1">Auf welche Weise könntest du uns beim SOLA unterstützen? Gib gerne mehrere Optionen an.</div>
        <div class="q-gutter-md row">
          <q-select outlined hide-bottom-space style="width: 300px" multiple :options="driverOptions" v-model="driver" label="Fahrer" hint="Was kannst / darfst du fahren?" :error="error.nutrition"/>
          <q-select outlined hide-bottom-space style="width: 300px" multiple :options="vehicleOptions" v-model="vehicle" label="Fahrzeug" hint="Was Fahrzeuge kannst du mitbringen / besorgen?" :error="error.nutrition"/>
          <q-item v-for="supportTypeOption in supportTypeOptions" tag="label" :key="supportTypeOption.name" v-ripple style="width: 300px;">
            <q-item-section avatar>
              <q-checkbox v-model="supportType[supportTypeOption.name]" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ supportTypeOption.label }}</q-item-label>
              <q-item-label caption>{{ supportTypeOption.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <q-input
          class="q-mt-md"
          v-if="supportType['other']"
          v-model="supportOther"
          outlined
          type="text"
          label="Sonstiges"
        />
        <div class="q-pb-lg"></div>

        <div class="q-pt-lg text-h5">Termine</div>
        <div class="q-pb-md text-body1">Wähle bitte die Tage aus, an denen du uns unterstützen kannst.</div>
        <q-date
          class="q-mt-md"
          v-model="days"
          first-day-of-week="1"
          :default-year-month="calStart"
          multiple
          minimal
          flat
          :options="dateOptions"
          :navigation-min-year-month="calStart"
          :navigation-max-year-month="calEnd"
        />
        <div class="q-pt-lg">
          <q-btn label="Speichern" type="submit" color="primary"/>
        </div>
      </q-form>
    </div>
    <div v-if="registrated">
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
          <div class="text-body1 q-py-lg">Vielen Dank, dass du uns beim Sola unterstützen möchtest, {{ firstName }}!</div>
          <div class="text-body2 q-pb-lg">Wir werden uns bei dir melden, sobald wir wissen, wie wir dich gerne einsetzen würden.</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import { constants } from '../boot/constants'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
export default {
  name: 'EditEngagementPage',
  
  props: {
    registrationFlow: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const moment = extendMoment(Moment);
    const { proxy } = getCurrentInstance()
    const $q = useQuasar()
    const c = proxy.$constants
    const error = ref({})

    const registrated = ref(false)

    const genderOptions = [
      {value:'m', label:"Männlich"},
      {value:'w', label:"Weiblich"}
    ]
    const nutritionOptions = [
      {value:'vegetarian', label:"Vegetarisch"},
      {value:'lactose', label:"Laktosefrei"}
    ]
    const driverOptions = [
      {value:'car', label:"PKW"},
      {value:'trailer', label:"Anhänger bis 3,5 t"},
      {value:'truck', label:"LKW bis 7,5 t"},
    ]
    const vehicleOptions = [
      {value:'trailer', label:"Anhänger"},
      {value:'car', label:"Zugfahrzeug"},
      {value:'van', label:"Transporter"},
    ]
    const firstName = ref('')
    const lastName = ref('')
    const birthday = ref('1999-01-01')
    const gender = ref('')
    const mail = ref('')
    const street = ref('')
    const zipCode = ref('')
    const city = ref('')
    const phone = ref('')
    const mobile = ref('')
    const church = ref('')
    const job = ref('')
    const nutrition = ref([])
    const driver = ref([])
    const vehicle = ref([])

    const supportType = ref({
      tasks: false,
      deco: false,
      material: false,
      training: false,
      workshops: false,
      seminars: false,
      infrastructure: false,
      kitchen: false,
      media: false,
      prayer: false,
      games: false,
      nightwatch: false,
      other: false
    })
    const supportTypeOptions = [
      {name: 'tasks', label: 'Praktische Aufgaben', description: 'Z.B. Aufbau, Abbau, Instandhaltung des Materials, Strom- oder Wasserinstallation, ...'},
      {name: 'deco', label: 'Deko', description: 'Planung, Herstellung, vor Ort dekorieren, ...'},
      {name: 'material', label: 'Material', description: 'Material Materialien für das SOLA besorgen'},
      {name: 'training', label: 'Schulungen', description: 'Schulungen für die Mitarbeiter bei Vorbereitungswochenenden'},
      {name: 'workshops', label: 'Workshops', description: 'Workshops für die Kids auf dem Platz'},
      {name: 'seminars', label: 'Seminare', description: 'Seminare für die Teens auf dem Platz'},
      {name: 'infrastructure', label: 'Springer', description: 'Das Springerteam auf dem Platz oder bei den Vorbereitungen unterstützen'},
      {name: 'kitchen', label: 'Küche', description: 'Das Küchenteam auf dem Platz oder bei den Vorbereitungen unterstützen'},
      {name: 'media', label: 'Medienteam', description: 'Das Medienteam auf dem Platz oder bei den Vorbereitungen unterstützen'},
      {name: 'prayer', label: 'Gebetsteam', description: 'Das Gebetsteam auf dem Platz oder bei den Vorbereitungen unterstützen'},
      {name: 'games', label: 'Geländespiele', description: 'Bei den Geländespielen auf dem Platz helfen, z.B. eine Station betreuen oder einen Schergen spielen.'},
      {name: 'nightwatch', label: 'Nachtwache', description: 'Die Nachtwache auf dem Platz übernehmen'},
      {name: 'other', label: 'Sonstiges', description: 'Sonstiges, was du gerne machen würdest (bitte im Textfeld angeben)'}
    ]    
    const supportOther = ref('')

    const days = ref([])
    const dateOptions = ref([])
    const events = [
      c.events.prepare3,
      c.events.prebuild,
      c.events.training,
      c.events.build,
      c.events.teens,
      c.events.kids,
      c.events.cleanup
    ]
    events.forEach(event => {
      if (event) {
        const range = moment.range(event.start, event.end)
        Array.from(range.by('day')).forEach(day => {
          dateOptions.value.push(day.format('YYYY/MM/DD'))
        })
      }
    })

    const calStart = new moment(c.events.prepare3.start).format('YYYY/MM')
    const calEnd = new moment(c.events.cleanup.end).format('YYYY/MM')

    function onSubmit() {
      let err = false;
      if (!gender.value) {error.value['gender'] = true; err = true;}
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
      const driverValue = driver.value.map(n => n.value);
      const vehicleValue = vehicle.value.map(n => n.value);
      const supportTypeValue = Object.keys(supportType.value).filter(key => supportType.value[key]);

      api.post('/supporterYear', {
        firstName: firstName.value,
        lastName: lastName.value,
        birthday: birthday.value,
        gender: gender.value.value,
        mail: mail.value,
        street: street.value,
        zipCode: zipCode.value,
        city: city.value,
        phone: phone.value,
        mobile: mobile.value,
        church: church.value,
        job: job.value,
        vegetarian: nutritionValue.includes('vegetarian'),
        lactose: nutritionValue.includes('lactose'),
        supportTypeDriverCar: driverValue.includes('car'),
        supportTypeDriverTrailer: driverValue.includes('trailer'),
        supportTypeDriverTruck: driverValue.includes('truck'),
        supportTypeVehicleTrailer: vehicleValue.includes('trailer'),
        supportTypeVehicleCar: vehicleValue.includes('car'),
        supportTypeVehicleVan: vehicleValue.includes('van'),
        supportTypeTasks: supportTypeValue.includes('tasks'),
        supportTypeDeco: supportTypeValue.includes('deco'),
        supportTypeMaterial: supportTypeValue.includes('material'),
        supportTypeTraining: supportTypeValue.includes('training'),
        supportTypeWorkshops: supportTypeValue.includes('workshops'),
        supportTypeSeminars: supportTypeValue.includes('seminars'),
        supportTypeInfrastructure: supportTypeValue.includes('infrastructure'),
        supportTypeKitchen: supportTypeValue.includes('kitchen'),
        supportTypeMedia: supportTypeValue.includes('media'),
        supportTypePrayer: supportTypeValue.includes('prayer'),
        supportTypeGames: supportTypeValue.includes('games'),
        supportTypeNightwatch: supportTypeValue.includes('nightwatch'),
        supportTypeOther: supportTypeValue.includes('other'),
        supportOther: supportOther.value,
        days: days.value
      }).then(() => {
        $q.notify({
          message: 'Erfolgreich gespeichert!',
          timeout: 250,
          color: 'green-4',
          icon: 'fa-solid fa-check',
        })
        registrated.value = true;
      }).catch((e) => {
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

    return {
      error,
      registrated,
      genderOptions,
      nutritionOptions,
      driverOptions,
      vehicleOptions,
      firstName,
      lastName,
      birthday,
      gender,
      mail,
      street,
      zipCode,
      city,
      phone,
      mobile,
      church,
      job,
      nutrition,
      driver,
      vehicle,
      supportType,
      supportTypeOptions,
      supportOther,
      days,
      dateOptions,
      calStart,
      calEnd,
      onSubmit
    }
  }
  
}
</script>
