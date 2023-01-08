import { boot } from 'quasar/wrappers'
import { api } from './axios'

var events = {}

export default boot( async ({ app }) => {
	await api.get('/event')
	.then(response => {
		Object.entries(response.data).forEach(entry => {
			const [index, data] = entry;
			events[data.id] = {
				start: data.start,
				end: data.end,
				location: data.location
			}
		  });
		  app.config.globalProperties.$events = events
	})
})

export { events }