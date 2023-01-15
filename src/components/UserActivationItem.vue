<template>
  <ImageDialog
    v-model="imageDialog"
    :img="avatar"
    :title="name"
  />
  
  <q-item class="q-px-none">

    
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
        </q-item-section>
      </q-item>


      <q-item class="q-px-none">

        <q-item-section side>
          <q-btn
            flat
            dense
            color="primary"
            icon="fa-solid fa-user"
            :to="'/l/profile/' + uuid"
          >
            <q-tooltip>
              Persönliche Daten anzeigen
            </q-tooltip>
          </q-btn>
        </q-item-section>

        <q-item-section side>
          <q-btn
          flat
          dense
          color="primary"
          icon="fa-solid fa-campground"
            :to="'/l/engagement/' + uuid"
          >
            <q-tooltip>
              Angaben zum SOLA {{ $settings.currentYear }}
            </q-tooltip>
          </q-btn>
        </q-item-section>

        <q-item-section side>
          <q-btn
            flat
            dense
            color="primary"
            icon="fa-solid fa-file-arrow-down"
          >
            <q-tooltip>
              MVB herunterladen
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
import { defineComponent, ref } from 'vue'
import ImageDialog from './ImageDialog.vue';

export default defineComponent({
  name: 'UserItem',

  components: {
    ImageDialog
  },

  props: {
    uuid: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const avatar = ref('')
    const date = ref('')
    const imageDialog = ref(false)
    const mail = ref('')
    const name = ref('')
    const $q = useQuasar();

    var m = false;


    api.get('/user/' + props.uuid).then(function(response) {
      name.value = response.data.firstName + ' ' + response.data.lastName
      mail.value = response.data.mail
      m = response.data.gender === 'm'
      const diff = new moment().diff(new moment(response.data.createdAt), 'days')
      if (diff === 0) {
        date.value = 'Heute'
      } else {
        date.value = 'Vor ' + diff + ' Tagen'
      }
    }).catch(function(e) {
      console.log(e);
    })

    api.get('/avatar/' + props.uuid, {
      responseType: 'blob'
    }).then(function(response) {
      avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
    })


    function acceptDialog() {
      $q.dialog({
        title: 'MA akzeptieren',
        message: `<p>Möchtest du <strong>${name.value}</strong> wirklich als Mitarbeiter${m ? '' : 'in'} akzeptieren?</p><p>Bedenke, dass ${m ? 'er' : 'sie'} dann automatisch die Cloud, Element und LAMA benutzen kann.</p><p>Bitte schick ${m ? 'ihm' : 'ihr'} nach dem Akzeptieren eine Bestätigungsmail an ${mail.value}`,
        html: true,
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
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
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    return {
      avatar,
      acceptDialog,
      declineDialog,
      imageDialog,
      date,
      mail,
      name,
    }
  }
})
</script>
