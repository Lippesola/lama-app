import { boot } from 'quasar/wrappers'
import { api } from './axios'

export default boot( async ({ app }) => {
	if (!app.config.globalProperties.$keycloak.authenticated) return
	await api.get('/userYear/' + app.config.globalProperties.$keycloak.tokenParsed.sub + '/' + app.config.globalProperties.$settings.currentYear)
	.then(response => {
		app.config.globalProperties.$status = response.data.status
	}).catch(function(e){
		app.config.globalProperties.$status = e.response.status
	})
})