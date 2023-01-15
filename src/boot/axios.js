import { boot } from 'quasar/wrappers'
import axios from 'axios'

var api = axios.create({
  baseURL: globalConfig.api.url
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  api.defaults.headers.common['Authorization'] = `Bearer ${app.config.globalProperties.$keycloak.token}`
  app.config.globalProperties.$api = api
})

export { axios, api }