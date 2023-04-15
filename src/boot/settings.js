import { boot } from 'quasar/wrappers'
import { api } from './axios'

var settings = {}

export default boot( async ({ app }) => {
	//if (!app.config.globalProperties.$keycloak.authenticated) return
	await api.get('/setting')
	.then(response => {
		Object.entries(response.data).forEach(entry => {
			const [index, data] = entry;
			settings[data.key] = data.value
			});
			app.config.globalProperties.$settings = settings
	})
})

export { settings }