import VueKeycloak from '@dsb-norge/vue-keycloak-js'
import axios from 'axios';
import { boot } from 'quasar/wrappers';

export default boot(async ({ app, router, store }) => {
  function registerTokenInterceptor () {
    axios.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${app.config.globalProperties.$keycloak.token}`
 
      return config
    }, null, { synchronous: true })
  }

  return new Promise(resolve => {
	  app.use(VueKeycloak, {
	    init: {
	      onLoad: 'login-required', // or 'check-sso'
	      flow: 'standard',
	      pkceMethod: 'S256',
	      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
	      checkLoginIframe: false // otherwise it would reload the window every so seconds
	    },
	    config: {
	      url: 'https://account.lippesola.de/auth/',
	      realm: 'Lippesola.de',
	      clientId: 'mab',
	    },
	    onReady() {
	      registerTokenInterceptor()
	      resolve()
	    }
	  })
  })
})