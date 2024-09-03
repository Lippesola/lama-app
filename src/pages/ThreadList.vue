<template>
  <q-dialog v-model="dialog" position="bottom">
    <q-card class="q-pa-md" style="width: 100%;">
      <div>
        <div class="row">
          <div class="text-h5 row">
            Neues Thema vorschlagen
          </div>
          <q-space />
          <q-btn
            icon="fa-solid fa-times"
            flat
            dense
            class="q-ma-none"
            @click="dialog = false"
          />
        </div>
        <q-input
          class="q-py-md "
          v-model="title"
          label="Titel"
          outlined
          :autofocus="true"
        />
        <q-editor
            v-model="editor"
            min-height="15rem"
            :toolbar="toolbarButtons"
          />
          <q-space class="q-py-sm" />
          <q-btn label="Absenden" @click="saveThread" color="primary"/>
      </div>
    </q-card>
  </q-dialog>
  <div class="q-pa-md" style="max-width: 1024px;">
    <div class="row q-pa-md">
      <div class="text-h4">
        Themenforum {{ $settings.currentYear }}
      </div>
      <q-space />
      <div>
        <q-btn
          color="primary"
          label="Neues Thema"
          @click="dialog = true"
        />
      </div>
    </div>
    <ThreadItem
      v-for="item in threadList"
      :key="item"
      v-bind="{id: item.id, title: item.title, createdAt: item.createdAt}"
    />
  </div>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'
import ThreadItem from 'src/components/ThreadItem.vue'

export default defineComponent({
  name: 'ThreadList',
  components: {
    ThreadItem
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const api = proxy.$api
    const settings = proxy.$settings
    const c = proxy.$constants
    const threadList = ref([])
    const dialog = ref(false)
    const ruleDialog = ref(false)
    const title = ref('')
    const textTemplate = ''
    const editor = ref(textTemplate)
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

    api.get('/thread').then(function(response) {
      Object.entries(response.data).forEach((entry => {
          const [index, item] = entry
          threadList.value.push(item)
        }))
    }).catch(function(e) {})

    function saveThread() {
      api.post('/thread', {
        title: title.value
      }).then(function(response) {
        api.post('/post', {
          text: editor.value,
          threadId: response.data.id
        }).then(function() {
          editor.value = textTemplate
          title.value = ''
          dialog.value = false
          api.get('/thread').then(function(response) {
            threadList.value = []
            Object.entries(response.data).forEach((entry => {
              const [index, item] = entry
              threadList.value.push(item)
            }))
          }).catch(function(e) {})
        }).catch(function(e) {})
      }).catch(function(e) {})
    }

    return {
      threadList,
      dialog,
      ruleDialog,
      title,
      editor,
      toolbarButtons,
      saveThread
    }
  }
})
</script>
