import VueKeycloak from '@dsb-norge/vue-keycloak-js'
import { api } from './axios';
import { boot } from 'quasar/wrappers';

export default boot(async ({ app, router, store }) => {
	app.config.globalProperties.$keycloakLogout = globalConfig.keycloak.url + 'realms/' + globalConfig.keycloak.realm + '/protocol/openid-connect/logout/logout-confirm'
	router.beforeEach((to, from, next) => {    
	  if (to.matched.some(record => record.meta.requiresAuth)) {
		if (app.config.globalProperties.$keycloak.authenticated) {
		  next()
		} else {        
		  const loginUrl = app.config.globalProperties.$keycloak.createLoginUrl()
		  window.location.replace(loginUrl)
		}
	  } else {      
		next()
	  }
	})
  
  function registerTokenInterceptor () {
    api.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${app.config.globalProperties.$keycloak.token}`
 
      return config
    }, null, { synchronous: true })
  }

  function refreshToken() {
	  app.config.globalProperties.$keycloak.keycloak.updateToken(-1).then(() => {
		registerTokenInterceptor()
	  })
  }

  return new Promise(resolve => {
	  app.use(VueKeycloak, {
	    init: {
	      onLoad: 'check-sso'
	    },
	    config: {
	      url: globalConfig.keycloak.url,
	      realm: globalConfig.keycloak.realm,
	      clientId: globalConfig.keycloak.clientId,
	    },
	    onReady() {
		  app.config.globalProperties.$keycloakLogout = globalConfig.keycloak.url + 'realms/' + globalConfig.keycloak.realm + '/protocol/openid-connect/logout'
	      registerTokenInterceptor()
		  setInterval(refreshToken, 10000)
	      resolve()
	    }
	  })
  })
})