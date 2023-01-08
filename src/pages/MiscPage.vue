<template>

  <div class="q-pa-md text-h4">REST</div>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input outlined type="text" v-model="endpoint" label="Endpoint" stack-label />
      <q-input outlined type="textarea" v-model="body" label="Body" hint='valid json string required -> {"key": "value"}' stack-label />
      <q-select outlined v-model="method" :options="methods" label="Method" icon="fa-solid fa-caret-down" />
      <q-btn label="Submit" type="submit" color="primary"/>
    </q-form>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
export default {
  name: 'ProfilePage',
  
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const uuid = proxy.$keycloak.tokenParsed.sub

    const endpoint = ref('')
    const body = ref('')
    const method = ref('get')

    return {
      endpoint,
      body,
      method,
      methods: [
        'get', 'post', 'delete'
      ],
      onSubmit() {

        switch(method.value) {
          case 'get': 
            api.get(endpoint.value)
            .then(function() {
              $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'fa-solid fa-check',
                message: 'Success'
              })
            })
            .catch(function() {
              $q.notify({
                color: 'red-4',
                textColor: 'white',
                icon: 'fa-solid fa-circle-xmark ',
                message: 'Error'
              })
            });break;
          case 'post':
            api.post(endpoint.value, JSON.parse(body.value))
            .then(function() {
              $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'fa-solid fa-check',
                message: 'Success'
              })
            })
            .catch(function() {
              $q.notify({
                color: 'red-4',
                textColor: 'white',
                icon: 'fa-solid fa-circle-xmark ',
                message: 'Error'
              })
            });break;
          case 'delete':
            api.get(endpoint.value)
            .then(function() {
              $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'fa-solid fa-check',
                message: 'Success'
              })
            })
            .catch(function() {
              $q.notify({
                color: 'red-4',
                textColor: 'white',
                icon: 'fa-solid fa-circle-xmark ',
                message: 'Error'
              })
            });break;
          default: 
            $q.notify({
              color: 'red-4',
              textColor: 'white',
              icon: 'fa-solid fa-circle-xmark ',
              message: 'Method not found'
            }); break;
        }
      }
    }
  }
  
}
</script>
