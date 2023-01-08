<template>
<q-item clickable v-ripple>
  <q-item-section side>
    <q-avatar v-if="!avatar" rounded size="48px" color="primary" text-color="white" icon="fa-solid fa-user"></q-avatar>
    <q-avatar v-if="avatar" rounded size="48px" color="primary" text-color="white">
      <img :src="avatar" />
    </q-avatar>
  </q-item-section>
  <q-item-section>
    <q-item-label>{{ name }}</q-item-label>
  </q-item-section>
  <q-item-section side>
    {{ date }}
  </q-item-section>
</q-item>


</template>




<script>
import moment from 'moment';
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'UserItem',
  props: {
    uuid: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true
    }
  },

  setup(props) {
    const name = ref('')
    const date = ref('')
    const avatar = ref('')

    api.get('/user/' + props.uuid).then(function(response) {
      name.value = response.data.firstName + ' ' + response.data.lastName
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
    return {
      name,
      date,
      avatar
    }
  }
})
</script>
