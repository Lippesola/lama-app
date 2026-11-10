import { defineBoot } from '#q-app'
import { api } from './axios'

export default defineBoot( async ({ app }) => {
	if (!app.config.globalProperties.$keycloak.authenticated) return
	await api.get('/userYear/' + app.config.globalProperties.$keycloak.tokenParsed.sub + '/' + app.config.globalProperties.$settings.currentYear)
	.then(response => {
		app.config.globalProperties.$status = response.data.status
	}).catch(function(e){
		app.config.globalProperties.$status = e.response.status
	})
})