<template>
  <q-dialog>
    <q-card style="min-width: 400px; max-width: 700px; width: 90vw">
      <q-card-section class="items-center q-pb-none">
        <div class="row items-center">
          <div class="text-h4">
            {{ supporter.firstName }} {{ supporter.lastName }}
          </div>
          <q-space />
          <q-btn
            flat
            dense
            color="primary"
            icon="fa-solid fa-pen-to-square"
            @click="startEdit"
            v-if="!editing"
          >
            <q-tooltip>Bearbeiten</q-tooltip>
          </q-btn>
          <template v-if="!editing">
            <q-btn
              flat
              dense
              color="positive"
              icon="fa-solid fa-circle-check"
              @click="confirmDialog"
            >
              <q-tooltip>Helfer bestätigen</q-tooltip>
            </q-btn>
          </template>
          <template v-if="editing">
            <q-btn
              flat
              dense
              color="positive"
              icon="fa-solid fa-floppy-disk"
              @click="saveEdit"
            >
              <q-tooltip>Speichern</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              color="negative"
              icon="fa-solid fa-xmark"
              @click="editing = false"
            >
              <q-tooltip>Abbrechen</q-tooltip>
            </q-btn>
          </template>
        </div>

        <!-- Read-Modus -->
        <q-list v-if="!editing">
          <q-item>
            <q-item-section>
              <q-item-label caption>Geschlecht</q-item-label>
              <q-item-label>{{ supporter.gender === 'm' ? 'Männlich' : 'Weiblich' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Geburtstag</q-item-label>
              <q-item-label>{{ birthday }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Adresse</q-item-label>
              <q-item-label>{{ supporter.street }}</q-item-label>
              <q-item-label>{{ supporter.zipCode }} {{ supporter.city }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="supporter.phone">
            <q-item-section>
              <q-item-label caption>Telefon</q-item-label>
              <q-item-label>{{ supporter.phone }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Handy</q-item-label>
              <q-item-label>{{ supporter.mobile }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>E-Mail</q-item-label>
              <q-item-label>{{ supporter.mail }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Beruf</q-item-label>
              <q-item-label>{{ supporter.job }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="supporter.lactose || supporter.vegetarian">
            <q-item-section>
              <q-item-label caption>Ernährung</q-item-label>
              <q-item-label v-if="supporter.lactose">Laktoseintolerant</q-item-label>
              <q-item-label v-if="supporter.vegetarian">Vegetarisch</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Edit-Modus -->
        <div v-if="editing" class="q-gutter-md q-pt-md">
          <div class="row q-gutter-md">
            <q-input outlined style="width: 200px" v-model="form.firstName" label="Vorname" />
            <q-input outlined style="width: 200px" v-model="form.lastName" label="Nachname" />
          </div>
          <div class="row q-gutter-md">
            <q-input outlined style="width: 200px" type="date" v-model="form.birthday" label="Geburtstag" />
            <q-select outlined style="width: 200px" :options="genderOptions" v-model="form.genderOption" label="Geschlecht" />
          </div>
          <div class="row q-gutter-md">
            <q-input outlined style="width: 200px" type="email" v-model="form.mail" label="E-Mail" />
            <q-input outlined style="width: 200px" v-model="form.job" label="Beruf" />
          </div>
          <div class="row q-gutter-md">
            <q-input outlined style="width: 200px" v-model="form.street" label="Straße" />
            <q-input outlined style="width: 200px" v-model="form.zipCode" label="PLZ" />
            <q-input outlined style="width: 200px" v-model="form.city" label="Ort" />
          </div>
          <div class="row q-gutter-md">
            <q-input outlined style="width: 200px" v-model="form.phone" label="Telefon" />
            <q-input outlined style="width: 200px" v-model="form.mobile" label="Handy" />
          </div>
          <div class="row q-gutter-md">
            <q-select outlined style="width: 420px" multiple :options="nutritionOptions" v-model="form.nutritionOptions" label="Ernährung" />
          </div>
          <div class="row q-gutter-md">
            <q-select outlined style="width: 200px" multiple :options="driverOptions" v-model="form.driverOptions" label="Fahrer" />
            <q-select outlined style="width: 200px" multiple :options="vehicleOptions" v-model="form.vehicleOptions" label="Fahrzeug" />
          </div>
          <div class="row q-col-gutter-sm">
            <q-item
              v-for="task in supporterTasks"
              :key="task.name"
              tag="label"
              v-ripple
              style="width: 200px"
            >
              <q-item-section avatar>
                <q-checkbox v-model="form.supportType[task.name]" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ task.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div>
            <div class="text-subtitle1 q-mb-sm">Termine</div>
            <q-date
              v-model="form.days"
              first-day-of-week="1"
              :default-year-month="calStart"
              multiple
              minimal
              flat
              :options="dateOptions"
              :navigation-min-year-month="calStart"
              :navigation-max-year-month="calEnd"
            />
          </div>
          <q-input v-if="form.supportType['other']" outlined v-model="form.supportOther" label="Sonstiges (Art)" />
          <q-input
            outlined
            autogrow
            v-model="form.referralSource"
            label="Woher kennst du das SOLA?"
          />
          <q-input
            outlined
            autogrow
            type="textarea"
            v-model="form.internalComment"
            label="Interner Kommentar"
          />
        </div>
      </q-card-section>

      <template v-if="!editing">
        <q-separator v-if="tasks.length"/>
        <q-card-section v-if="tasks.length">
          <div class="text-body1">Aufgaben</div>
          <div class="text-caption">{{ tasks.join(', ') }}</div>
        </q-card-section>
        <q-separator v-if="driver.length"/>
        <q-card-section v-if="driver.length">
          <div class="text-body1">Fahrer</div>
          <div class="text-caption">{{ driver.join(', ') }}</div>
        </q-card-section>
        <q-separator v-if="vehicle.length"/>
        <q-card-section v-if="vehicle.length">
          <div class="text-body1">Fahrzeug</div>
          <div class="text-caption">{{ vehicle.join(', ') }}</div>
        </q-card-section>
        <q-separator v-if="supporter.SupporterDays.length"/>
        <q-card-section v-if="supporter.SupporterDays.length">
          <div class="text-body1">Termine</div>
          <div class="text-caption">{{ days.join(", ") }}</div>
        </q-card-section>
        <q-separator v-if="supporter.supportOther"/>
        <q-card-section v-if="supporter.supportOther">
          <div class="text-body1">Sonstiges</div>
          <div class="text-caption">{{ supporter.supportOther }}</div>
        </q-card-section>
        <q-separator v-if="supporter.referralSource"/>
        <q-card-section v-if="supporter.referralSource">
          <div class="text-body1">Woher kennst du das SOLA?</div>
          <div class="text-caption">{{ supporter.referralSource }}</div>
        </q-card-section>
        <q-separator v-if="supporter.internalComment"/>
        <q-card-section v-if="supporter.internalComment">
          <div class="text-body1">Interner Kommentar</div>
          <div class="text-caption">{{ supporter.internalComment }}</div>
        </q-card-section>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

export default defineComponent({
  name: 'SupporterDialog',
  props: {
    supporter: {
      type: Object,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    },
    driver: {
      type: Array,
      required: true
    },
    vehicle: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const moment = extendMoment(Moment);
    const $q = useQuasar();
    const { proxy } = getCurrentInstance();
    const c = proxy.$constants;

    const genderOptions = c.genderOptions;
    const nutritionOptions = c.nutritionOptions;
    const driverOptions = c.driverOptions;
    const vehicleOptions = c.vehicleOptions;
    const supporterTasks = c.supporterTasks;

    const dateOptions = ref([]);
    const events = [
      c.events.prepare2, c.events.prepare3, c.events.prebuild,
      c.events.training, c.events.build, c.events.teens,
      c.events.kids, c.events.cleanup,
    ];
    events.forEach((event) => {
      if (event) {
        const range = moment.range(event.start, event.end);
        Array.from(range.by('day')).forEach((day) => {
          dateOptions.value.push(day.format('YYYY/MM/DD'));
        });
      }
    });
    const calStart = dateOptions.value.length > 0
      ? moment(dateOptions.value[0], 'YYYY/MM/DD').format('YYYY/MM')
      : moment().format('YYYY/MM');
    const calEnd = c.events.cleanup
      ? moment(c.events.cleanup.end).format('YYYY/MM')
      : moment().format('YYYY/MM');

    const editing = ref(false);
    const form = ref({});

    const birthday = ref(moment(props.supporter.birthday).format('DD.MM.YYYY'));
    const days = ref([]);
    props.supporter.SupporterDays.forEach((day) => {
      days.value.push(moment(day.day).format('DD.MM.YYYY'));
    });

    function startEdit() {
      form.value = {
        firstName: props.supporter.firstName,
        lastName: props.supporter.lastName,
        birthday: props.supporter.birthday ? moment(props.supporter.birthday).format('YYYY-MM-DD') : '',
        genderOption: genderOptions.find(o => o.value === props.supporter.gender) || null,
        mail: props.supporter.mail,
        job: props.supporter.job,
        street: props.supporter.street,
        zipCode: props.supporter.zipCode,
        city: props.supporter.city,
        phone: props.supporter.phone || '',
        mobile: props.supporter.mobile,
        nutritionOptions: nutritionOptions.filter(o =>
          (o.value === 'vegetarian' && props.supporter.vegetarian) ||
          (o.value === 'lactose' && props.supporter.lactose)
        ),
        driverOptions: driverOptions.filter(o => props.supporter[o.backendName]),
        vehicleOptions: vehicleOptions.filter(o => props.supporter[o.backendName]),
        supportType: Object.fromEntries(supporterTasks.map(t => [t.name, !!props.supporter[t.backendName]])),
        supportOther: props.supporter.supportOther || '',
        referralSource: props.supporter.referralSource || '',
        internalComment: props.supporter.internalComment || '',
        days: (props.supporter.SupporterDays || []).map(d => moment(d.day).format('YYYY/MM/DD')),
      };
      editing.value = true;
    }

    function saveEdit() {
      const f = form.value;
      const nutritionVal = (f.nutritionOptions || []).map(n => n.value);
      const driverVal = (f.driverOptions || []).map(n => n.backendName);
      const vehicleVal = (f.vehicleOptions || []).map(n => n.backendName);

      const payload = {
        firstName: f.firstName,
        lastName: f.lastName,
        birthday: f.birthday,
        gender: f.genderOption ? f.genderOption.value : props.supporter.gender,
        mail: f.mail,
        job: f.job,
        street: f.street,
        zipCode: f.zipCode,
        city: f.city,
        phone: f.phone,
        mobile: f.mobile,
        vegetarian: nutritionVal.includes('vegetarian'),
        lactose: nutritionVal.includes('lactose'),
        supportTypeDriverCar: driverVal.includes('supportTypeDriverCar'),
        supportTypeDriverTrailer: driverVal.includes('supportTypeDriverTrailer'),
        supportTypeDriverTruck: driverVal.includes('supportTypeDriverTruck'),
        supportTypeVehicleTrailer: vehicleVal.includes('supportTypeVehicleTrailer'),
        supportTypeVehicleCar: vehicleVal.includes('supportTypeVehicleCar'),
        supportTypeVehicleVan: vehicleVal.includes('supportTypeVehicleVan'),
        supportTypeTasks: !!f.supportType['tasks'],
        supportTypeDeco: !!f.supportType['deco'],
        supportTypeMaterial: !!f.supportType['material'],
        supportTypeTraining: !!f.supportType['training'],
        supportTypeWorkshops: !!f.supportType['workshops'],
        supportTypeSeminars: !!f.supportType['seminars'],
        supportTypeInfrastructure: !!f.supportType['infrastructure'],
        supportTypeKitchen: !!f.supportType['kitchen'],
        supportTypeMedia: !!f.supportType['media'],
        supportTypePrayer: !!f.supportType['prayer'],
        supportTypeGames: !!f.supportType['games'],
        supportTypeNightwatch: !!f.supportType['nightwatch'],
        supportTypeOther: !!f.supportType['other'],
        supportOther: f.supportOther,
        referralSource: f.referralSource,
        internalComment: f.internalComment,
        days: (f.days || []).map(d => moment(d, 'YYYY/MM/DD').format('YYYY-MM-DD')),
      };

      api.post('supporterYear/' + props.supporter.uuid, payload).then(() => {
        Object.assign(props.supporter, payload);
        props.supporter.SupporterDays = payload.days.map(day => ({ uuid: props.supporter.uuid, day, status: 1 }));
        birthday.value = moment(payload.birthday).format('DD.MM.YYYY');
        days.value = payload.days.map(d => moment(d).format('DD.MM.YYYY'));
        $q.notify({ message: 'Gespeichert', color: 'positive', position: 'top', timeout: 2000 });
        editing.value = false;
      }).catch(() => {
        $q.notify({ message: 'Fehler beim Speichern', color: 'negative', position: 'top', timeout: 2000 });
      });
    }

    function confirmDialog() {
      $q.dialog({
        title: 'MA akzeptieren',
        message: `<p>Möchtest du <strong>${props.supporter.firstName}</strong> wirklich als Helfer bestätigen?<br>Ab dann wird ${props.supporter.gender === 'm' ? 'er' : 'sie'} auch automatisch in den Mailverteiler für Helfer eingetragen.</p>`,
        html: true,
        ok: {
          color: 'positive',
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        api.post('supporterYear/' + props.supporter.uuid, { isConfirmed: true }).then(() => {
          $q.notify({
            message: 'Helfer bestätigt',
            color: 'positive',
            position: 'top',
            timeout: 2000
          });
          props.supporter.isConfirmed = true;
        }).catch(() => {
          $q.notify({
            message: 'Fehler beim Bestätigen',
            color: 'negative',
            position: 'top',
            timeout: 2000
          });
        });
      });
    }

    return {
      birthday,
      days,
      editing,
      form,
      genderOptions,
      nutritionOptions,
      driverOptions,
      vehicleOptions,
      supporterTasks,
      dateOptions,
      calStart,
      calEnd,
      startEdit,
      saveEdit,
      confirmDialog,
    };
  }
})
</script>
