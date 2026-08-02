<template>
  <ImageDialog
    v-model="imageDialog"
    :img="avatar"
    :title="name"
  />

  <q-dialog v-model="commentDialog">
    <q-card style="min-width: 350px; max-width: 700px; width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Kommentar zu {{ name }}</div>
        <q-space />
        <q-btn flat round dense @click="cancelComment"><AppIcon name="times" /></q-btn>
      </q-card-section>

      <q-card-section>
        <q-editor
          v-model="comment"
          min-height="10rem"
          :toolbar="toolbarButtons"
          placeholder="Kein Kommentar hinterlegt"
        />
      </q-card-section>

      <q-card-section class="row q-gutter-sm">
        <q-btn label="Speichern" @click="saveComment" color="primary" />
        <q-btn label="Abbrechen" @click="cancelComment" flat />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-item class="q-px-none" v-if="show === 'true'">


    <q-list style="width:100%">
      <q-item class="q-px-none">
        <q-item-section side>
          <q-avatar v-if="!avatar" rounded size="48px" color="primary" text-color="white"><AppIcon name="user" /></q-avatar>
          <q-avatar v-if="avatar" rounded size="48px" color="primary" text-color="white">
            <img class="cursor-pointer" :src="avatar" @click="imageDialog = true" style="object-fit: cover;" />
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
              @click="toggleAssignee"
            >
              <AppIcon name="user" />
            </q-avatar>
          </q-item-label>
        </q-item-section>
      </q-item>


      <q-item class="q-px-none">

        <q-item-section side>
          <q-btn
            flat
            dense
            color="primary"
            :to="'/l/engagement/' + uuid"
          >
            <AppIcon name="user" />
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
            :to="'/l/motivation/' + uuid"
          >
            <AppIcon name="file-lines" />
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
            :href="'mailto:' + mail"
          >
            <AppIcon name="envelope" />
            <q-tooltip>
              E-Mail an MA schicken
            </q-tooltip>
          </q-btn>
        </q-item-section>

        <q-item-section side>
          <q-btn
            flat
            dense
            :color="hasComment ? 'primary' : 'grey-7'"
            @click="commentDialog = true"
          >
            <AppIcon name="comment" />
            <q-tooltip>
              {{ hasComment ? 'Kommentar ansehen / bearbeiten' : 'Kommentar hinzufügen' }}
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
            @click="acceptDialog"
          >
            <AppIcon name="circle-check" />
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
            @click="declineDialog"
          >
            <AppIcon name="circle-xmark" />
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
    registeredAt: {
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
    const date = new moment(props.registeredAt).format('DD.MM.YYYY')
    const imageDialog = ref(false)
    const mail = ref('')
    const name = ref('')
    const show = ref('true')
    const commentDialog = ref(false)
    const comment = ref('')
    const savedComment = ref('')
    const hasComment = ref(false)
    const toolbarButtons = ref([
      [
        'bold',
        'italic',
        'underline',
        'strike'
      ],
      [
        'undo',
        'redo'
      ],
      [
        'unordered',
        'ordered',
        'outdent',
        'indent'
      ],
    ])
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

    api.get('/userComment/' + props.uuid).then(function(response) {
      comment.value = response.data.comment || ''
      savedComment.value = comment.value
      hasComment.value = comment.value.replace(/<[^>]*>/g, '').trim().length > 0
    }).catch(function(e) {})

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
          icon: 'check',
          message: 'Status wurde gesetzt'
        })
        show.value = 'false'
      })
      .catch(function(e) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'circle-xmark',
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
          icon: 'check',
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
          icon: 'circle-xmark',
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
    function saveComment() {
      api.post('/userComment/' + props.uuid, {
        comment: comment.value
      }).then(function() {
        savedComment.value = comment.value
        hasComment.value = comment.value.replace(/<[^>]*>/g, '').trim().length > 0
        commentDialog.value = false
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'check',
          message: 'Kommentar gespeichert'
        })
      }).catch(function(e) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'circle-xmark',
          message: e.response?.data || 'Fehler beim Speichern des Kommentars'
        })
      })
    }

    function cancelComment() {
      comment.value = savedComment.value
      commentDialog.value = false
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
      commentDialog,
      comment,
      hasComment,
      toolbarButtons,
      saveComment,
      cancelComment,
    }
  }
})
</script>
