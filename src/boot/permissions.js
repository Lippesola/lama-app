import { boot } from 'quasar/wrappers'
import { api } from './axios'

var permissions = {}

export default boot( async ({ app }) => {
	if (!app.config.globalProperties.$keycloak.authenticated) return
	await api.get('/userPermission?uuid=' + app.config.globalProperties.$keycloak.tokenParsed.sub)
	.then(response => {
		Object.entries(response.data).forEach(entry => {
			const [index, data] = entry;
			permissions[data.permission] = data.allowed
			});
			app.config.globalProperties.$permissions = permissions
	})
})

export { permissions }