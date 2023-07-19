import { boot } from 'quasar/wrappers';

const version = 'v1.3.1'
const changelog = {
	'v1.3.1':
		[
			'Menüpunkte sind trotz Versionsnummer klickbar',
			'Berechtigungskonzept für Papierkram hinzugefügt',
		],
	'v1.3.0':
		[
			'Die Mail-Verteiler können direkt in LAMA genutzt werden',
		],
	'v1.2.5':
		[
			'Ernährungswünsche können im Nachhinein nicht mehr von MA geändert werden',
			'Birthday surprise',
		],
	'v1.2.4':
		[
			'LTler können jetzt auch Briefe für kostenlose Führungszeugnisse für MAs generieren',
		],
	'v1.2.3':
		[
			'Helferanmeldungen sind für LTler sichtbar',
		],
	'v1.2.2':
		[
			'Sortierung von Geburtstagen in erweiterter Liste behoben'
		],
	'v1.2.1': 
		[
			'Optionen für Helferanmeldung erweitert'	
		],
	'v1.2.0': 
		[
			'PDF für kostenlose Führungszeugnisse hinzugefügt',
			'Übersicht für Unterlagen hinzugefügt',
			'LTler können MA-Daten bearbeiten',
			'Spalten in MA-Liste werden gespeichert'
		],
	'v1.1.0':
		[
			'Helferanmeldung hinzugefügt',
			'Veranstaltungen und Einstellungen auch für nicht eingeloggte Nutzer sichtbar',
			'Menü zu anderen Anwendungen eingebunden'
		],
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