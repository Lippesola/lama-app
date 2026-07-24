<template>
  <q-item
  clickable
  :to="link"
  >
  <q-item-section
  v-if="icon"
  avatar
  >
  <q-badge class="q-ml-md" v-show="showBadge > 0" color="orange" text-color="black" :label="showBadge" on-right/>
  <AppIcon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { api } from 'src/boot/axios'
import moment from 'moment'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    badge: {
      type: String,
      default: '0'
    },
  },
  setup(props) {
    const showBadge = ref(props.badge)
    const { proxy } = getCurrentInstance()
    const c = proxy.$constants
    const settings = proxy.$settings
    if (props.badge == 'paperwork') {
      showBadge.value = 0
      const { proxy } = getCurrentInstance()
      const uuid = proxy.$keycloak.tokenParsed.sub
      api.get('/user/' + uuid)
      .then(function(userResponse) {
        api.get('/userDocument/' + uuid)
        .then(function(userDocumentResponse) {
          showBadge.value += ((settings.currentYear < (userDocumentResponse.data.criminalRecord + 5)) || (userDocumentResponse.data.criminalRecord == settings.currentYear - 2000)) ? 0 : 1
          showBadge.value += (settings.currentYear < (userDocumentResponse.data.selfCommitment + 5)) ? 0 : 1
          showBadge.value += (settings.currentYear < (userDocumentResponse.data.privacyCommitment + 1)) ? 0 : 1
          if (moment(c.events.teens.start).diff(moment(userResponse.data.birthday), 'years') < 18) {
            showBadge.value += (settings.currentYear < ((userDocumentResponse.data.parentalConsent || 0) + 1 )) ? 0 : 1
          }
        }).catch(function(e){
          if (e.response.status === 404) {
            showBadge.value = (moment(c.events.teens.start).diff(moment(userResponse.data.birthday), 'years') < 18) ? 4 : 3
          } else {
            $q.notify({
              message: 'Fehler beim Laden der Daten',
              type: 'negative'
            })
          }
        })
      })
    }
    if (props.badge == 'supporter') {
      showBadge.value = 0
      api.get('/supporterYear')
      .then(function(response) {
        showBadge.value = Object.values(response.data).filter(item => !item.isConfirmed).length
      }).catch(function(e){})
    }
    if (props.badge == 'activation') {
      showBadge.value = 0
      api.get('/userYear?year=' + settings.currentYear + '&status=' + c.userYearStatus.pending)
      .then(function(response) {
        showBadge.value = Object.keys(response.data).length
      }).catch(function(e){})
    }
    return {
      showBadge
    }
  }
})
</script>
