import VueKeycloak from '@dsb-norge/vue-keycloak-js'
import axios from 'axios';
import { boot } from 'quasar/wrappers';

export default boot(async ({ app, router, store }) => {
	router.beforeEach((to, from, next) => {    
	  if (to.matched.some(record => record.meta.requiresAuth)) {      
		console.log(app.config.globalProperties.$keycloak)
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
    axios.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${app.config.globalProperties.$keycloak.token}`
 
      return config
    }, null, { synchronous: true })
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
	      registerTokenInterceptor()
	      resolve()
	    }
	  })
  })
})