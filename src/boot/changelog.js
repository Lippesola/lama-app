import { boot } from 'quasar/wrappers';

const version = 'v1.0.7'
const changelog = {
	'v1.0.7':
		[
			'Automatisches Versenden von Mails, wenn MA freigeschaltet wurde',
			'Automatisches Hinzufügen zu Mailing-List bei Freischaltung'
		],
	'v1.0.6':
		[
			'Zeige VB-Leiter in Mitarbeiterliste',
			'Versionsnummer in Footer eingefügt',
			'Changelog hinzugefügt'
		],
	'v1.0.5':
		[
			'MAs in Freischaltliste richtig sortiert',
			'Rechtschreibfehler entfernt',
			'Ostereier gesucht'
		],
	'v1.0.4':
		[
			'MAs in MA-Liste sortierbar gemacht'
		],
	'v1.0.3':
		[
			'MA in MA-Liste nebeneinander angezeigt',
			'Fehlermeldung in leeren Auswahlfeldern behoben',
			'Kommentar für Ernährungs-Info angepasst',
			'MA-Export für LTler hinzugefügt'
		],
	'v1.0.2':
		[
			'Felder bei "Dein SOLA" richtig validiert'
		],
	'v1.0.1':
		[
			'Verlinkung zum Profil in erweiterter Nutzerliste',
			'Versionsnummer aus Menü entfernt',
			'Freitextfeld für "Sonstiges" hinzugefügt',
			'Indikatoren für Auf- und Abbau verbessert'
		],
	'v1.0.0':
		[
			'Init'
		],
}

export default boot( async ({ app }) => {
	app.config.globalProperties.$version = version
	app.config.globalProperties.$changelog = changelog
})