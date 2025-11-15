<template>
  <q-dialog v-model="dialog" position="bottom">
    <q-card class="q-pa-md" style="width: 100%;">
      <div>
        <div>
          <div class="text-h5 row">
            Kommentar bearbeiten
            <q-space />
            <q-btn
              v-if="!undeletable"
              size="sm"
              text-color="red"
              flat
              icon="fa-solid fa-trash"
              @click="trashDialog = true"
            />
            <q-btn
              v-if="undeletable"
              icon="fa-solid fa-times"
              flat
              dense
              class="q-ma-none"
              @click="dialog = false"
            />
          </div>
        </div>
        <q-editor
          class="q-my-md"
          v-model="textChange"
          min-height="15rem"
          :toolbar="toolbarButtons"
          :autofocus="true"
        />
        <q-space class="q-py-sm" />
        <q-btn label="Speichern" @click="savePost" color="primary"/>
      </div>
    </q-card>
  </q-dialog>
  <q-dialog v-model="trashDialog">
    <q-card class="q-pa-md" style="width: 100%;">
      <div class="text-h5">
        Beitrag löschen
      </div>
      <div class="q-py-md">
        Bist du sicher, dass du den Beitrag löschen möchtest?
      </div>
      <div class="row float-right">
        <q-btn class="q-mr-md" label="löschen" @click="deletePost" color="red"/>
        <q-btn label="Abbrechen" @click="trashDialog = false" color="green"/>
      </div>
    </q-card>
  </q-dialog>
  <q-item class="q-pb-lg" v-if="!removed">
    <q-item-section top side v-if="!$q.platform.is.mobile">
      <q-item-label caption>
        {{ createdDate }}
      </q-item-label>
      <q-item-label class="q-py-sm row">
        <div>
          <q-avatar v-if="!avatar" rounded size="32px" color="primary" text-color="white" icon="fa-solid fa-user"></q-avatar>
          <q-avatar v-if="avatar" rounded size="32px" color="primary" text-color="white">
            <img :src="avatar" />
          </q-avatar>
        </div>
        <div class="q-pl-sm" style="max-width: 100px;">
          {{ userName }}
        </div>
      </q-item-label>
      <q-item-label caption>
        <q-btn
          :label="likeCount + (likeCount === 1 ? ' like' : ' likes')"
          :icon="(liked ? 'fa-solid' : 'fa-regular') + ' fa-heart'"
          text-color="red"
          flat
          dense
          class="q-pa-none"
          size="sm"
          @click="like(!liked)"
        />
      </q-item-label>
      <q-item-label>
        <q-separator />
      </q-item-label>
      <q-item-label caption v-if="editable">
        <q-btn
          label="Bearbeiten"
          icon="fa-solid fa-edit"
          text-color="primary"
          flat
          dense
          class="q-pa-none"
          size="sm"
          @click="dialog = true"
        />
      </q-item-label>
    </q-item-section>
    <q-separator vertical class="q-mr-md" v-if="!$q.platform.is.mobile"/>
    <q-item-section top>
      <q-item-section class="q-pb-lg" v-if="$q.platform.is.mobile">
        <div class="row">
          <q-item-label>
            {{ userName }}
          </q-item-label>
          <q-space />
          <q-item-label>
            {{ createdDate }}
          </q-item-label>
        </div>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <div v-html="textRef"></div> 
        </q-item-label>
      </q-item-section>
      <q-item-section class="q-py-md" v-if="$q.platform.is.mobile">
        <div class="row">
          <q-item-label caption v-if="editable">
            <q-btn
              label="Bearbeiten"
              icon="fa-solid fa-edit"
              text-color="primary"
              flat
              dense
              class="q-pa-none"
              size="sm"
              @click="dialog = true"
            />
          </q-item-label>
          <q-space />
          <q-item-label>
            <q-btn
              :label="likeCount + (likeCount === 1 ? ' like' : ' likes')"
              :icon="(liked ? 'fa-solid' : 'fa-regular') + ' fa-heart'"
              text-color="red"
              flat
              dense
              class="q-pa-none"
              size="sm"
              @click="like(!liked)"
            />
          </q-item-label>
        </div>
      </q-item-section>
    </q-item-section>
  </q-item>
</template>




<script>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios';
import { defineComponent, ref, getCurrentInstance } from 'vue'
import moment from 'moment';

export default defineComponent({
  name: 'ThreadItem',
  props: {
    id: {
      type: Number,
      defaultValue: 0
    },
    text: {
      type: String,
      defaultValue: ''
    },
    createdAt: {
      type: String,
      defaultValue: ''
    },
    createdBy: {
      type: String,
      defaultValue: 0
    },
    mainPostId: {
      type: Number,
      defaultValue: 0
    }
  },

  setup(props) {
    const $q = useQuasar()
    const userName = ref('')
    const avatar = ref('')
    const createdDate = ref(moment(props.createdAt).format('DD.MM.YYYY HH:mm'));
    const likeCount = ref(0)
    const liked = ref(false)
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$keycloak.tokenParsed.sub
    const isLT = proxy.$keycloak.tokenParsed.groups.includes('Leitungsteam')
    const editable = ref((props.createdBy === uuid || isLT))
    const undeletable = ref(props.mainPostId === props.id)
    const dialog = ref(false)
    const trashDialog = ref(false)
    const textRef = ref(props.text)
    const textChange = ref(props.text)
    const removed = ref(false)
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

    api.get('/userPost?postId=' + props.id).then(function(userPostResponse) {
      likeCount.value = userPostResponse.data.filter((item) => item.like).length
      liked.value = userPostResponse.data.filter((item) => item.uuid === uuid && item.like).length > 0
    }).catch((e) => {})

    api.get('/user/' + props.createdBy).then(function(response) {
      userName.value = (response.data.nickname || response.data.firstName) + ' ' + response.data.lastName
    }).catch((e) => {})

    api.get('/avatar/' + props.createdBy, {
      responseType: 'blob'
    }).then(function(response) {
      avatar.value = URL.createObjectURL(response.data, 'binary').toString('base64')
    }).catch((e) => {})

    function like(value) {
      api.post('/userPost/' + uuid + '/' + props.id, {
        like: value
      }).then(function(response) {
        liked.value = value
        likeCount.value = value ? likeCount.value + 1 : likeCount.value - 1
      }).catch((e) => {})
    }

    function savePost() {
      api.post('/post/' + props.id, {
        text: textChange.value
      }).then(function(response) {
        api.get('/post/' + props.id).then(function(response) {
          $q.notify({
            message: 'Beitrag wurde gespeichert',
            color: 'green',
            icon: 'fa-solid fa-check'
          })
          textRef.value = response.data.text
          dialog.value = false
        }).catch(function(e) {})
      }).catch(function(e) {})
    }
    
    function deletePost() {
      api.delete('/post/' + props.id).then(function(response) {
        $q.notify({
          message: 'Beitrag wurde gelöscht',
          color: 'green',
          icon: 'fa-solid fa-check'
        })
        trashDialog.value = false
        dialog.value = false
        removed.value = true
      }).catch(function(e) {})
    }

    return {
      userName,
      avatar,
      createdDate,
      likeCount,
      liked,
      editable,
      undeletable,
      dialog,
      trashDialog,
      textRef,
      textChange,
      removed,
      toolbarButtons,
      savePost,
      deletePost,
      like
    }
  }
})
</script>
