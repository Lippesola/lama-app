<template>
  <q-item clickable :to="'/l/threads/' + id" v-ripple v-if="commentCount >= 0">
    <q-item-section top side>
      <q-avatar v-if="!avatar" rounded size="36px" color="primary" text-color="white" icon="fa-solid fa-user"></q-avatar>
      <q-avatar v-if="avatar" rounded size="36px" color="primary" text-color="white">
        <img :src="avatar" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-body1">
        {{ title }}
      </q-item-label>
      <q-item-label caption>
        Erstellt am {{ createdDate }} von {{ userName }}
      </q-item-label>
      <q-item-label caption>
        Letzte Aktivität: {{ updateDate }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label caption>
        {{ commentCount }}&nbsp;&nbsp;<q-icon name="fa-solid fa-comment" color="primary" />
      </q-item-label>
      <q-item-label caption>
        {{ likeCount }}&nbsp;&nbsp;<q-icon name="fa-solid fa-heart" color="red" />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>




<script>
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue'
import moment from 'moment';

export default defineComponent({
  name: 'ThreadItem',
  props: {
    id: {
      type: Number,
      defaultValue: 0
    },
    title: {
      type: String,
      defaultValue: ''
    },
    createdAt: {
      type: String,
      defaultValue: ''
    }
  },

  setup(props) {
    const userName = ref('')
    const avatar = ref('')
    const createdDate = ref(moment(props.createdAt).format('DD.MM.YYYY'));
    const updateDate = ref('');
    const commentCount = ref(0)
    const likeCount = ref(0)
    const mainPost = ref({})

    api.get('/post/?threadId=' + props.id).then(function(postResponse) {
      mainPost.value = postResponse.data[0];
      commentCount.value = postResponse.data.length - 1;
      const createdBy = mainPost.value.createdBy;
      updateDate.value = moment(postResponse.data[commentCount.value]['createdAt']).format('DD.MM.YYYY HH:mm');
      api.get('/userPost?postId=' + mainPost.value.id).then(function(userPostResponse) {
        likeCount.value = userPostResponse.data.filter((item) => item.like).length
      }).catch((e) => {})

      api.get('/user/' + createdBy).then(function(response) {
        userName.value = (response.data.nickname || response.data.firstName) + ' ' + response.data.lastName
      }).catch((e) => {})

      api.get('/avatar/' + createdBy, {
        responseType: 'blob'
      }).then(function(response) {
        avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
      }).catch((e) => {})
    }).catch((e) => {})

    return {
      userName,
      avatar,
      createdDate,
      updateDate,
      commentCount,
      likeCount
    }
  }
})
</script>
