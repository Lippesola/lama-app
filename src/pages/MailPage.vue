<template>
  <div class="q-pa-md text-h4">Mail-Verteiler</div>
  <div class="q-pa-md q-gutter-md" style="max-width: 1024px">
    <q-select
      class="q-pb-lg"
      style="max-width: 300px;"
      v-model="mailingList"
      :options="mailingListOptions"
      option-value="value"
      option-label="label"
      label="Verteiler"
      outlined
      multiple
      :error="error.addresses"
    />
    <q-input
      v-model="subject"
      label="Betreff"
      outlined
      :error="error.subject"
    />
    <q-editor
      v-model="editor"
      min-height="15rem"
      :toolbar="toolbarButtons"
    />
    <q-btn label="Submit" @click="sendMail" color="primary"/>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MailPage',
  
  setup () {
    const $q = useQuasar()
    const editor = ref('Hier kommt deine Nachricht rein')
    const mailingListOptions = ref([])
    const mailingList = ref([])
    const subject = ref('')
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
      ]
    ])
    const error = ref([])
    api.get('/mailinglist').then(response => {
      response.data.forEach(mailingList => {
        mailingListOptions.value.push({
          label: mailingList.name,
          value: mailingList.address,
        })
      })
      if (mailingListOptions.value.length === 1) mailingList.value = mailingListOptions.value[0]
    })
    const sendMail = () => {
      let addresses = [];
      mailingList.value.forEach(address => {
        addresses.push(address.value)
      })
      api.post('/mail/sendMail', {
        content: editor.value,
        subject: subject.value,
        addresses: addresses
      }).then(function() {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'fa-solid fa-check',

          message: 'E-Mail wurde versendet'
        })
      }).catch(function(e) {
        let errMsg = 'Fehler'
        if (e && e.response && e.response.data) {
          e.response.data.forEach((err) => {
            error.value[err] = true
          })
          errMsg = 'Bitte überprüfe deine Angaben'
        }
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'fa-solid fa-circle-xmark ',
          message: errMsg
        })
      })

    }
    return {
      editor,
      mailingListOptions,
      mailingList,
      subject,
      toolbarButtons,
      error,
      sendMail
    }
  }
})
</script>