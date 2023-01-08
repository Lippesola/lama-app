<template>
<q-item clickable v-ripple style="max-width: 400px;">
  <q-item-section side>
    <q-avatar v-if="!avatar" rounded size="48px" color="primary" text-color="white" icon="fa-solid fa-user"></q-avatar>
    <q-avatar v-if="avatar" rounded size="48px" color="primary" text-color="white">
      <img :src="avatar" />
    </q-avatar>
  </q-item-section>
  <q-item-section>
    <q-item-label>{{ name }}</q-item-label>
  </q-item-section>
</q-item>


</template>




<script>
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'UserItem',
  props: {
    uuid: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const avatar = ref('')

    api.get('/avatar/' + props.uuid, {
      responseType: 'blob'
    }).then(function(response) {
      avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
    })
    return {
      avatar
    }
  }
})
</script>
