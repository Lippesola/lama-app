import { defineBoot } from '#q-app'
import axios from 'axios'

var api = axios.create({
  baseURL: globalConfig.api.url
})

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  if (app.config.globalProperties.$keycloak.authenticated) {
    api.defaults.headers.common['Authorization'] = `Bearer ${app.config.globalProperties.$keycloak.token}`
  }
  app.config.globalProperties.$api = api
})

export { axios, api }