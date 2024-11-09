<template>
  <ImageDialog
    v-model="imageDialog"
    :img="avatar"
    :title="name"
  />

  <q-item class="q-px-none" v-if="show === 'true'">


    <q-list style="width:100%">
      <q-item class="q-px-none">
        <q-item-section side>
          <q-avatar v-if="!avatar" rounded size="48px" color="primary" text-color="white" icon="fa-solid fa-user"></q-avatar>
          <q-avatar v-if="avatar" rounded size="48px" color="primary" text-color="white">
            <img class="cursor-pointer" :src="avatar" @click="imageDialog = true" />
          </q-avatar>
        </q-item-section>

        <q-item-section >
          <q-item-label>{{ name }}</q-item-label>
          <q-item-label caption> {{ mail }} </q-item-label>
        </q-item-section>
        <q-item-section top side>
          <q-item-label caption>{{ date }}</q-item-label>
          <q-item-label caption>
            <q-avatar
              v-if="assigneeAvatar"
              class="cursor-pointer"
              size="32px"
              :title="assignee.firstName + ' ' + assignee.lastName"
              @click="toggleAssignee"
            >
              <img
                v-if="assigneeAvatar"
                :src="assigneeAvatar"
              />
            </q-avatar>
            <q-avatar
              v-if="!assigneeAvatar"
              class="cursor-pointer"
              size="32px"
              :color="assignee ? 'primary' : 'grey-9'"
              text-color="white"
              :title="assignee ? (assignee.firstName + ' ' + assignee.lastName) : 'Mir zuweisen'"
              :icon="assigneeAvatar ? '' : 'fa-solid fa-user'"
              @click="toggleAssignee"
            />
          </q-item-label>
        </q-item-section>
      </q-item>


      <q-item class="q-px-none">

        <q-item-section side>
          <q-btn
            flat
            dense
            color="primary"
            icon="fa-solid fa-user"
            :to="'/l/engagement/' + uuid"
          >
            <q-tooltip>
              Infos zur Person
            </q-tooltip>
          </q-btn>
        </q-item-section>

        <q-item-section side>
          <q-btn
            flat
            dense
            color="primary"
            icon="fa-solid fa-file-lines"
            :to="'/l/motivation/' + uuid"
          >
            <q-tooltip>
              MVB anzeigen
            </q-tooltip>
          </q-btn>
        </q-item-section>

        <q-item-section side>
          <q-btn
            flat
            dense
            color="primary"
            icon="fa-solid fa-envelope"
            :href="'mailto:' + mail"
          >
            <q-tooltip>
              E-Mail an MA schicken
            </q-tooltip>
          </q-btn>
        </q-item-section>

        <q-item-section>
        </q-item-section>

        <q-item-section side>
          <q-btn
            flat
            dense
            color="positive"
            icon="fa-solid fa-circle-check"
            @click="acceptDialog"
          >
            <q-tooltip>
              MA freischalten
            </q-tooltip>
          </q-btn>
        </q-item-section>

        <q-item-section side>
          <q-btn
            flat
            dense
            color="negative"
            icon="fa-solid fa-circle-xmark"
            @click="declineDialog"
          >
            <q-tooltip>
              MA ablehnen
            </q-tooltip>
          </q-btn>
        </q-item-section>

      </q-item>
    </q-list>
  </q-item>
</template>




<script>
import moment from 'moment';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { defineComponent, ref, getCurrentInstance } from 'vue'
import ImageDialog from './ImageDialog.vue';

export default defineComponent({
  name: 'UserActivationItem',

  components: {
    ImageDialog
  },

  props: {
    uuid: {
      type: String,
      required: true
    },
    updatedAt: {
      type: String,
      required: true
    },
    AssigneeModel: {
      type: Object,
      required: false
    }
  },

  setup(props) {
    const avatar = ref('')
    const assigneeAvatar = ref('')
    const date = new moment(props.updatedAt).format('DD.MM.YYYY')
    const imageDialog = ref(false)
    const mail = ref('')
    const name = ref('')
    const show = ref('true')
    const $q = useQuasar();
    const { proxy } = getCurrentInstance()
    const c = proxy.$constants
    const settings = proxy.$settings
    const ownUuid = proxy.$keycloak.tokenParsed.sub
    const assignee = ref(props.AssigneeModel)

    var m = false;


    api.get('/user/' + props.uuid).then(function(response) {
      name.value = response.data.firstName + ' ' + response.data.lastName
      mail.value = response.data.mail
      m = response.data.gender === 'm'
    }).catch(function(e) {})

    api.get('/avatar/' + props.uuid, {
      responseType: 'blob'
    }).then(function(response) {
      avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
    }).catch((e) => {})

    function getAssigneeAvatar() {
      if (assignee.value) {
        api.get('/avatar/' + assignee.value.uuid, {
          responseType: 'blob'
        }).then(function(response) {
          assigneeAvatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
        }).catch((e) => {})
      }
    }

    function setStatus(status) {
      api.post('/userYear/' + props.uuid + '/' + settings.currentYear, {
        status: status
      })
      .then(function() {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'fa-solid fa-check',
          message: 'Status wurde gesetzt'
        })
        show.value = 'false'
      })
      .catch(function(e) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'fa-solid fa-circle-xmark ',
          message: e.response?.data || 'Fehler'
        })
      })
    }

    function setAssignee(assigneeId) {
      api.post('/userYear/' + props.uuid + '/' + settings.currentYear, {
        assignee: assigneeId
      })
      .then(function() {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'fa-solid fa-check',
          message: assigneeId ? 'Die Anmeldung wurde dir zugewiesen' : 'Die Zuweisung wurde entfernt'
        })
        if (assigneeId) {
          api.get('/user/' + assigneeId).then(function(response) {
            assignee.value = response.data
            getAssigneeAvatar()
          }).catch(function(e) {})
        } else {
          assignee.value = null
          assigneeAvatar.value = null
        }
      })
      .catch(function(e) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'fa-solid fa-circle-xmark ',
          message: e.response?.data || 'Fehler'
        })
      })
    }

    function acceptDialog() {
      $q.dialog({
        title: 'MA akzeptieren',
        message: `<p>Möchtest du <strong>${name.value}</strong> wirklich als Mitarbeiter${m ? '' : 'in'} akzeptieren?</p><p>Bedenke, dass ${m ? 'er' : 'sie'} dann automatisch die Cloud, Element und LAMA benutzen kann.</p><p>Nachdem du ${m ? 'ihn' : 'sie'} freigeschaltet hast, bekommt ${m ? 'er' : 'sie'} eine automatische eine Bestätigungsmail zugeschickt.`,
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
        setStatus(c.userYearStatus.activated)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    function declineDialog() {
      $q.dialog({
        title: 'MA ablehnen',
        message: `<p>Möchtest du <strong>${name.value}</strong> wirklich als Mitarbeiter${m ? '' : 'in'} ablehnen?</p><p>Bitte schick ${m ? 'ihm' : 'ihr'} unbedingt eine Mail mit Begründung an ${mail.value} oder ruf ${m ? 'ihn' : 'sie'} an!`,
        html: true,
        ok: {
          color: 'negative',
          push: true,
        },
        cancel: {
          color: 'positive',
          push: true,
        },
        persistent: true
      }).onOk(() => {
        setStatus(c.userYearStatus.rejected)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    function toggleAssignee() {
      const title = assignee.value ? "Zuweisung entfernen" : "Anmeldung zuweisen";
      const message = assignee.value ? `Möchtest du die Zuweisung von <strong>${name.value}</strong> wirklich entfernen?` : `Möchtest du die Anmeldung von <strong>${name.value}</strong> wirklich übernehmen?`;
      $q.dialog({
        title: title,
        message: message,
        html: true,
        ok: {
          color: 'positive',
          push: true,
        },
        cancel: {
          color: 'negative',
          push: true,
        },
        persistent: true
      }).onOk(() => {
        setAssignee(assignee.value ? null : ownUuid)
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }
    getAssigneeAvatar()

    return {
      avatar,
      assignee,
      assigneeAvatar,
      acceptDialog,
      declineDialog,
      toggleAssignee,
      imageDialog,
      date,
      mail,
      show,
      name,
    }
  }
})
</script>
