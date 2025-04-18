<template>
  <q-dialog>
    <q-card>
      <q-card-section class="items-center q-pb-none">
        <div class="row">
          <div class="text-h4">
            {{ supporter.firstName }} {{ supporter.lastName }}
          </div>
          <q-space />
          <div class="text-h4">
            <q-btn
              flat
              dense
              color="positive"
              icon="fa-solid fa-circle-check"
              @click="confirmDialog"
            >
              <q-tooltip>
                Helfer bestätigen
              </q-tooltip>
            </q-btn>
          </div>
        </div>
        <q-list>
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
            <q-item-section >
              <q-item-label caption>Ernährung</q-item-label>
              <q-item-label v-if="supporter.lactose">Laktoseintolerant</q-item-label>
              <q-item-label v-if="supporter.vegetarian">Vegetarisch</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

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
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import moment from 'moment'
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
    const $q = useQuasar();

    const birthday = ref(moment(props.supporter.birthday).format('DD.MM.YYYY'))
    const days = ref([])
    props.supporter.SupporterDays.forEach((day) => {
      days.value.push(moment(day.day).format('DD.MM.YYYY'))
    })

    function confirmDialog() {
      $q.dialog({
        title: 'MA akzeptieren',
        message: `<p>Möchtest du <strong>${props.supporter.firstName}</strong> wirklich als Helfer bestätigen?<br>Ab dann wird ${props.supporter.gernder === 'm' ? 'er' : 'sie'} auch automatisch in den Mailverteiler für Helfer eingetragen.</p>`,
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
        api.post('supporterYear/' + props.supporter.uuid, {isConfirmed: true}).then(() => {
          $q.notify({
            message: 'Helfer bestätigt',
            color: 'positive',
            position: 'top',
            timeout: 2000
          })
          props.supporter.isConfirmed = true;
        }).catch(() => {
          $q.notify({
            message: 'Fehler beim bestätigt',
            color: 'negative',
            position: 'top',
            timeout: 2000
          })
        })
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }

    return {
      birthday,
      days,
      confirmDialog
    }
  }
})
</script>
