<template>

  <SupporterDialog
      v-model="supporterDialog"
      :supporter="item"
      :tasks="tasks"
      :driver="driver"
      :vehicle="vehicle"
    />

  <q-item clickable @click="supporterDialog = true" v-ripple>
    <q-item-section>
      <q-item-label style="user-select: none;">{{ name }}</q-item-label>
      
      <q-item-label caption v-if="tasks.length">
        <q-icon class="q-pr-sm fa-solid fa-screwdriver-wrench" />
        {{ tasks.join(', ') }}
      </q-item-label>
      <q-item-label caption v-if="driver.length">
        <q-icon class="q-pr-sm fa-solid fa-id-card" />
        {{ driver.join(', ') }}
      </q-item-label>
      <q-item-label caption v-if="vehicle.length">
        <q-icon class="q-pr-sm fa-solid fa-car-side" />
        {{ vehicle.join(', ') }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>




<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'
import { useQuasar } from 'quasar'
import SupporterDialog from './SupporterDialog.vue'

export default defineComponent({
  name: 'UserItem',
  components: {
    SupporterDialog
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()
    const c = proxy.$constants
    const name = ref('')
    const tasks = ref([])
    const driver = ref([])
    const vehicle = ref([])
    const supporterDialog = ref(false)
    name.value = props.item.firstName + ' ' + props.item.lastName
    c.supporterTasks.forEach(task => {
      if (props.item[task.backendName]) {
        tasks.value.push(task.label)
      }
    })
    c.driverOptions.forEach(task => {
      if (props.item[task.backendName]) {
        driver.value.push(task.label)
      }
    })
    c.vehicleOptions.forEach(task => {
      if (props.item[task.backendName]) {
        vehicle.value.push(task.label)
      }
    })

    return {
      name,
      tasks,
      driver,
      vehicle,
      supporterDialog
    }
  }
})
</script>
