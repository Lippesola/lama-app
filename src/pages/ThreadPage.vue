<template>
  <q-dialog v-model="dialog" position="bottom">
    <q-card class="q-pa-md" style="width: 100%;">
      <div>
        <div>
          <div class="text-h5 row">
            Thema bearbeiten
            <q-space />
            <q-btn
              size="sm"
              text-color="red"
              flat
              icon="fa-solid fa-trash"
              @click="trashDialog = true"
            />
          </div>
        </div>
        <q-input
          class="q-py-md "
          v-model="titleChange"
          label="Titel"
          outlined
          :autofocus="true"
        />
        <q-space class="q-py-sm" />
        <q-btn label="Speichern" @click="saveThread" color="primary"/>
      </div>
    </q-card>
  </q-dialog>
  <q-dialog v-model="trashDialog">
    <q-card class="q-pa-md" style="width: 100%;">
      <div class="text-h5">
        Beitrag löschen
      </div>
      <div class="q-py-md">
        Bist du sicher, dass du den Beitrag "{{ title }}" mit allen Kommentaren löschen möchtest?
      </div>
      <div class="row float-right">
        <q-btn class="q-mr-md" label="löschen" @click="deleteThread" color="red"/>
        <q-btn label="Abbrechen" @click="trashDialog = false" color="green"/>
      </div>
    </q-card>
  </q-dialog>
  <div class="q-pa-md" style="max-width: 1024px;">
    <div class="q-pb-lg row" >
      <div class="text-h4">
        <q-btn
          flat
          icon="fa-solid fa-arrow-left"
          @click="$router.go(-1)"
        />
        {{ title }}
      </div>
      <q-space />
      <div>
        <q-btn
          v-if="editable"
          flat
          label="Bearbeiten"
          text-color="primary"
          icon="fa-solid fa-edit"
          @click="dialog = true"
        />
      </div>
    </div>
    <div>
      <PostItem
        v-for="item in postList"
        :key="item"
        v-bind="{id: item.id, text: item.text, createdAt: item.createdAt, createdBy: item.createdBy, mainPostId: postList[0].id}"
      />
      <q-space class="q-py-md" />
      <q-editor
        v-model="editor"
        min-height="15rem"
        :toolbar="toolbarButtons"
        placeholder="Schreibe einen Kommentar"
      />
      <q-space class="q-py-sm" />
      <q-btn label="Absenden" @click="savePost" color="primary"/>
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import PostItem from 'src/components/PostItem.vue'

export default defineComponent({
  name: 'ThreadPage',
  components: {
    PostItem
  },
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$keycloak.tokenParsed.sub
    const api = proxy.$api
    const settings = proxy.$settings
    const c = proxy.$constants
    const postList = ref([])
    const threadId = proxy.$route.params.id
    const dialog = ref(false)
    const trashDialog = ref(false)
    const title = ref('')
    const titleChange = ref('')
    const editor = ref('')
    const editable = ref(false)
    const currentYear = proxy.$settings.currentYear
    const router = useRouter()
    const isLT = proxy.$keycloak.tokenParsed.groups.includes('Leitungsteam')
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

    api.get('/thread/' + threadId).then(function(response) {
      title.value = response.data.title
      titleChange.value = response.data.title
    }).catch(function(e) {})
    api.get('/post?threadId=' + threadId).then(function(response) {
      Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          postList.value.push(item)
        }))
        if (postList.value[0]['createdBy'] === uuid || isLT) editable.value = true
    }).catch(function(e) {})

    function savePost() {
      api.post('/post', {
        text: editor.value,
        threadId: threadId
      }).then(function() {
        editor.value = ''
        api.get('/post?threadId=' + threadId).then(function(response) {
          postList.value = []
          Object.entries(response.data).forEach((entry => {
            const [index, item] = entry
            postList.value.push(item)
          }))
        }).catch(function(e) {})
      }).catch(function(e) {})
    }

    function saveThread() {
      api.post('/thread/' + threadId, {
        title: titleChange.value
      }).then(function(response) {
        $q.notify({
          message: 'Titel wurde geändert',
          color: 'green',
          icon: 'fa-solid fa-check'
        })
        title.value = titleChange.value
        dialog.value = false
      }).catch(function(e) {})
    }

    function deleteThread() {
      api.delete('/thread/' + threadId).then(function(response) {
        $q.notify({
          message: 'Thema wurde gelöscht',
          color: 'green',
          icon: 'fa-solid fa-check'
        })
        router.go(-1)
      }).catch(function(e) {})
    }

    return {
      postList,
      title,
      titleChange,
      toolbarButtons,
      editor,
      dialog,
      editable,
      trashDialog,
      savePost,
      saveThread,
      deleteThread
    }
  }
})
</script>
