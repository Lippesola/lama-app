<template>
  <div class="q-pa-md text-h4">Dein SOLA {{ $settings.currentYear }}</div>
  <div class="q-pa-md">
    <div class="q-gutter-md q-pb-md row" v-show="loading">
      <q-spinner
        color="primary"
        size="2em"
      />
      <span>Deine Daten werden noch geladen..</span>
    </div>
    <q-form @submit="onSubmit">
      <div class="q-pt-md text-h5">Termine</div>
      <div class="q-pb-md text-body1">Für die Planung ist es wichtig, dass wir möglichst früh wissen, wann du dabei sein kannst. Wenn du "Wahrscheinlich ja" oder "Wahrscheinlich nein" angibst, denk bitte daran, diese Info zu aktualisieren, sobald Gewissheit herrscht!</div>
      <div class="q-gutter-md row">
        <q-select
          outlined
          stack-label
          hide-bottom-space
          behavior="menu"
          style="width: 300px;"
          v-for="item in participationList"
          v-model="participationSelect[item.id]['value']"
          :key="item.id"
          :options="item.options"
          :label="item.title"
          :hint="item.hint"
          :rules="[val => !!val || 'Eingabe erforderlich']"
        />
      </div>    
      
      <div class="q-pt-xl text-h5">Deine Mitarbeit beim Sola</div>
      <div class="q-pb-md text-body1">In welchem Team möchtest du beim Sola mitarbeiten?</div>
      <div class="q-gutter-md row">
        <q-select
          outlined
          stack-label
          hide-bottom-space
          behavior="menu"
          style="width: 300px;"
          v-for="item in wishList"
          v-model="wishSelect[item.id]['value']"
          :key="item.id"
          :options="item.options"
          :label="item.title"
          :hint="item.hint"
          :rules="[val => !!val || 'Eingabe erforderlich']"
        />
      </div>
      
      <div class="q-pt-xl text-h5">Wo kannst du noch unterstützen?</div>
      <div class="q-pb-md text-body1">Die untenstehenden Punkte sind unabhängig von dem Team, in dem zu mitarbeitest</div>
      <div class="q-gutter-md row">
        <q-select
          outlined
          stack-label
          hide-bottom-space
          behavior="menu"
          style="width: 300px;"
          v-for="item in roleList"
          v-model="roleSelect[item.id]['value']"
          :key="item.id"
          :options="item.options"
          :label="item.title"
          :hint="item.hint"
          :rules="[val => !!val || 'Eingabe erforderlich']"
        />
      </div>
      <div class="q-pt-lg">
        <q-btn label="Speichern" type="submit" color="primary"/>
      </div>
    </q-form>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import { settings } from '../boot/settings'
import { events } from '../boot/events'
import moment from 'moment'
export default {
  name: 'EngagementPage',
  
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$keycloak.tokenParsed.sub

    function date2String(event) {
      const s = event.start ? new moment(event.start).format('DD.MM.YYYY') : ''
      const e = event.end ? new moment(event.end).format('DD.MM.YYYY') : ''
      return s ? (s + (e ? (' - ' + e) : '' )) : '';
    }

    const loading = ref(true)

    const statusList = {
      type: {
        id: 'type',
        title: 'Typ',
        hint: ``,
        hidden: true,
        options: [
          {value: 0, label: 'MA'},
          {value: 1, label: 'TH'},
          {value: 2, label: 'Gast / Helfer'}
        ]
      },
      status: {
        id: 'status',
        title: 'Status',
        hint: ``,
        hidden: true,
        options: [
          {value: 0, label: 'Nicht angemeldet'},
          {value: 1, label: 'Ausstehend'},
          {value: 2, label: 'Abgelehnt'},
          {value: 3, label: 'Angemeldet'}
        ]
      },
    }
    const participationList = {
      prepare1: {
        id: 'prepare1',
        title: '1. Vorbereitungswochenende (VW)',
        hint: `${date2String(events.prepare1)}`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Wahrscheinlich Nein'},
          {value: 2, label: 'Wahrscheinlich Ja'},
          {value: 3, label: 'Ja'}
        ]
      },
      prepare2: {
        id: 'prepare2',
        title: '2. Vorbereitungswochenende (VW)',
        hint: `${date2String(events.prepare2)}`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Wahrscheinlich Nein'},
          {value: 2, label: 'Wahrscheinlich Ja'},
          {value: 3, label: 'Ja'}
        ]
      },
      prepare3: {
        id: 'prepare3',
        title: '3. Vorbereitungswochenende (VW)',
        hint: `${date2String(events.prepare3)}`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Wahrscheinlich Nein'},
          {value: 2, label: 'Wahrscheinlich Ja'},
          {value: 3, label: 'Ja'}
        ]
      },
      training: {
        id: 'training',
        title: 'Schulungstage',
        hint: `Vor allem für neue Mitarbeiter empfohlen. ${date2String(events.training)}`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Wahrscheinlich Nein'},
          {value: 2, label: 'Wahrscheinlich Ja'},
          {value: 3, label: 'Ja'}
        ]
      },
      build: {
        id: 'build',
        title: 'Aufbau',
        hint: `Grundsätzlich gilt: Wer beim Teen-Sola dabei ist, ist auch beim Aufbau dabei. ${date2String(events.build)}`,
        options: [
          {value: 0, label: 'Automatisch (Wie bei Teens)'},
          {value: 1, label: 'Ja'},
          {value: 2, label: 'Nein'}
        ]
      },
      teens: {
        id: 'teens',
        title: 'Teen-Sola',
        hint: `${date2String(events.teens)}`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Wahrscheinlich Nein'},
          {value: 2, label: 'Wahrscheinlich Ja'},
          {value: 3, label: 'Ja'}
        ]
      },
      kids: {
        id: 'kids',
        title: 'Kids-Sola',
        hint: `${date2String(events.kids)}`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Wahrscheinlich Nein'},
          {value: 2, label: 'Wahrscheinlich Ja'},
          {value: 3, label: 'Ja'}
        ]
      },
      cleanup: {
        id: 'cleanup',
        title: 'Abbau',
        hint: `Grundsätzlich gilt: Wer beim Kids-Sola dabei ist, ist auch beim Abbau dabei. ${date2String(events.cleanup)}`,
        options: [
          {value: 0, label: 'Automatisch (Wie bei Kids)'},
          {value: 1, label: 'Ja'},
          {value: 2, label: 'Nein'}
        ]
      }
    }
    const roleList = {
      driver: {
        id: 'driver',
        title: 'Fahrgemeinschaft',
        hint: `Fährst du zu den Terminen mit dem Auto und kannst ggf. Leute mitnehmen?`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja, 1 Person'},
          {value: 2, label: 'Ja, 2 Personen'},
          {value: 3, label: 'Ja, 3 Personen'},
          {value: 4, label: 'Ja, 4 Personen'}
        ]
      },
      groupLeader: {
        id: 'groupLeader',
        title: 'Gruppenleiter (GL)',
        hint: `Kannst du dir vorstellen eine Gruppe zu leiten?`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja'}
        ]
      },
      trainer: {
        id: 'trainer',
        title: 'Schulungsleiter',
        hint: `Du könntest Schulungen z.B. bei Vorbereitungswochenenden leiten`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja'}
        ]
      },
      dayLeader: {
        id: 'dayLeader',
        title: 'Tagesleiter',
        hint: `Deine Aufgabe wär es, auf dem Platz einen Tag zu übernehmen`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja'}
        ]
      },
      dayTeamLeader: {
        id: 'dayTeamLeader',
        title: 'TagesTeamLeiter',
        hint: `Die Tage werden von mehreren Teams geplant. Kannst du eines davon leiten?`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja'}
        ]
      },
      guitar: {
        id: 'guitar',
        title: 'Gitarre',
        hint: `Traust du dir zu, alleine am Lagerfeuer Gitarre zu spielen?`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Nein, ich bin Anfänger'},
          {value: 2, label: 'Ja, ich bin fortgeschritten'},
          {value: 3, label: 'Ja, ich bin Profi'}
        ]
      },
      singing: {
        id: 'singing',
        title: 'Gesang',
        hint: `Kannst du den Gesang in deiner Gruppe anleiten?`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja'}
        ]
      },
      band: {
        id: 'band',
        title: 'Band',
        hint: `Möchtest du die Band unterstützen?`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja'}
        ]
      },
      drama: {
        id: 'drama',
        title: 'Anspiel',
        hint: `Siehst du dich im Anspielteam?`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja, als Nebencharakter'},
          {value: 2, label: 'Ja, als Hauptrolle'}
        ]
      }
    }
    const wishList = {
      wishTent: {
        id: 'wishTent',
        title: 'Zelt-MA',
        hint: `Hier bist du direkt mit den Teilnehmern in einer Gruppe`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja, als weitere Alternative'},
          {value: 2, label: 'Ja, als Alternative'},
          {value: 3, label: 'Ja'}
        ]
      },
      wishKitchen: {
        id: 'wishKitchen',
        title: 'Küche',
        hint: `Bei einer Woche Action darf die gute Verpflegung natürlich nicht fehlen`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja, als weitere Alternative'},
          {value: 2, label: 'Ja, als Alternative'},
          {value: 3, label: 'Ja'}
        ]
      },
      wishOffice: {
        id: 'wishOffice',
        title: 'Lagerbüro',
        hint: `Es fallen immer ein paar Aufgaben an, die im Hintergrund erleidgt werden müssen. Vor allem im Bereich IT und Verwaltung`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja, als weitere Alternative'},
          {value: 2, label: 'Ja, als Alternative'},
          {value: 3, label: 'Ja'}
        ]
      },
      wishMedia: {
        id: 'wishMedia',
        title: 'Medienteam',
        hint: `Vor allem, wenn du Lust auf Fotografieren und Filmen hast, bist du hier richtig`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja, als weitere Alternative'},
          {value: 2, label: 'Ja, als Alternative'},
          {value: 3, label: 'Ja'}
        ]
      },
      wishMedic: {
        id: 'wishMedic',
        title: 'Sani',
        hint: `Hier kümmerst du dich um verletzte und kranke Teilnehmer und Mitarbeiter`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja, als weitere Alternative'},
          {value: 2, label: 'Ja, als Alternative'},
          {value: 3, label: 'Ja'}
        ]
      },
      wishInfrastructure: {
        id: 'wishInfrastructure',
        title: 'Springer',
        hint: `Handwerk, Strom, Gas, Wasser - Die Springer kümmern sich unter anderem um eine funktionierende Infrastruktur`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja, als weitere Alternative'},
          {value: 2, label: 'Ja, als Alternative'},
          {value: 3, label: 'Ja'}
        ]
      },
      wishOther: {
        id: 'wishOther',
        title: 'Sonstiges',
        hint: `Wenn dir nichts zusagt oder du spezielle Wünsche hast, schreib sie gerne unten in das Feld für sonstige Anmerkungen`,
        options: [
          {value: 0, label: 'Nein'},
          {value: 1, label: 'Ja, als weitere Alternative'},
          {value: 2, label: 'Ja, als Alternative'},
          {value: 3, label: 'Ja'}
        ]
      }
    }

    let participationSelect = {}
    let roleSelect = {}
    let wishSelect = {}

    Object.entries(participationList).forEach((entry => {
      const [index, item] = entry;
      participationSelect[item.id] = ref('')
    }))
    Object.entries(roleList).forEach((entry => {
      const [index, item] = entry;
      roleSelect[item.id] = ref('')
    }))
    Object.entries(wishList).forEach((entry => {
      const [index, item] = entry;
      wishSelect[item.id] = ref('')
    }))

    api.get('/userEngagement/' + settings.currentYear + '/' + uuid)
    .then(function(response) {
      Object.entries(participationList).forEach((entry => {
        const [index, item] = entry
        if (participationSelect[item.id]) {
          participationSelect[item.id]['value'] = participationList[item.id]['options'][response.data[item.id]]
        }
      }))
      Object.entries(roleList).forEach((entry => {
        const [index, item] = entry
        if (roleSelect[item.id]) {
          roleSelect[item.id]['value'] = roleList[item.id]['options'][response.data[item.id]]
        }
      }))
      Object.entries(wishList).forEach((entry => {
        const [index, item] = entry
        if (wishSelect[item.id]) {
          wishSelect[item.id]['value'] = wishList[item.id]['options'][response.data[item.id]]
        }
      }))
      loading.value = false
    })
    return {
      participationList,
      participationSelect,
      roleList,
      roleSelect,
      wishList,
      wishSelect,
      loading,
      onSubmit() {
        var body = {}

        Object.entries(participationList).forEach((entry => {
          const [index, item] = entry
          body[item.id] = participationSelect[item.id]['value']['value']
        }))
        Object.entries(roleList).forEach((entry => {
          const [index, item] = entry
          body[item.id] = roleSelect[item.id]['value']['value']
        }))
        Object.entries(wishList).forEach((entry => {
          const [index, item] = entry
          body[item.id] = wishSelect[item.id]['value']['value']
        }))

        console.log(body);

        api.post('/userEngagement/' + settings.currentYear + '/' + uuid, body)
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
