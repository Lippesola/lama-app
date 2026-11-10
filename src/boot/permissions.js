import { defineBoot } from '#q-app'
import { api } from './axios'

var permissions = {}

export default defineBoot( async ({ app }) => {
	if (!app.config.globalProperties.$keycloak.authenticated) return
	await api.get('/userPermission?uuid=' + app.config.globalProperties.$keycloak.tokenParsed.sub)
	.then(response => {
		Object.entries(response.data).forEach(entry => {
			const [index, data] = entry;
			permissions[data.permission] = data.allowed
			});
			app.config.globalProperties.$permissions = permissions
	})
	.catch(() => {
		// Ignore errors on purpose, a failed permission request must not break the app boot
	})
})

export { permissions }