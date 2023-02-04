<template>
  <q-item clickable :to="'/l/profile/' + uuid" v-ripple style="width: 300px;">
    <q-item-section side>
      <q-avatar v-if="!avatar" rounded size="48px" color="primary" text-color="white" icon="fa-solid fa-user"></q-avatar>
      <q-avatar v-if="avatar" rounded size="48px" color="primary" text-color="white">
        <img :src="avatar" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label v-if="!showNick">{{ name }}</q-item-label>
      <q-item-label v-if="showNick">{{ nick }}</q-item-label>
      
      <q-item-label caption>
          {{ responsibilityString }}
      </q-item-label>
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
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      defaultValue: ''
    },
    responsibilityList: {
      type: Array,
      defaultValue: []
    },
    showNick: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const avatar = ref('')
    const name = ref('')
    const nick = ref('')
    const responsibilityString = ref('')
    name.value = props.firstName + ' ' + props.lastName
    nick.value = (props.nickname || props.firstName) + ' ' + props.lastName

    api.get('/avatar/' + props.uuid, {
      responseType: 'blob'
    }).then(function(response) {
      avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
    }).catch((e) => {})

    const responsibilities = props.responsibilityList.filter(responsibility => responsibility.uuid === props.uuid);
    let responsibilityNames = [];
    responsibilities.forEach((res) => {
      responsibilityNames.push(res.name)
    })
    responsibilityString.value = responsibilityNames.join(", ");

    return {
      avatar,
      name,
      responsibilityString,
      nick
    }
  }
})
</script>
