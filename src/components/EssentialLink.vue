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
  <q-icon :name="icon" />
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
    if (props.badge == 'paperwork') {
      showBadge.value = 0
      const { proxy } = getCurrentInstance()
      const uuid = proxy.$keycloak.tokenParsed.sub
      api.get('/userDocument/' + uuid)
      .then(function(response) {
        const criminalRecordDate = new moment(response.data.criminalRecord)
        const selfCommitmentDate = new moment(response.data.selfCommitment)
        showBadge.value += criminalRecordDate.isAfter(moment(c.events.kids.end).subtract(5, 'years')) ? 0 : 1
        showBadge.value += selfCommitmentDate.isAfter(moment(c.events.kids.end).subtract(5, 'years')) ? 0 : 1
      }).catch(function(e){})
    }
    return {
      showBadge
    }
  }
})
</script>
