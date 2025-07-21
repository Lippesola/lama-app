import { boot } from "quasar/wrappers";

const version = "v1.9.4";
const changelog = {
  "v1.9.4": [
    "Kennzeichen-Feld in MA-Liste hinzugefügt",
  ],
  "v1.9.3": [
    "Erlaubt die Gruppe der MA in der erweiterten Nutzerliste anzuzeigen",
    "Fehlerbehebung, dass die Gruppeneinteilung nicht korrekt angezeigt wurde"
  ],
  "v1.9.2": [
    "Behebung, dass die Sortierung in der MA-Liste mit Umlauten nicht funktioniert hat",
  ],
  "v1.9.1": [
    "Bei der Gruppeneinteilung können Personen nun gefiltert werden",
    "Gruppen können nicht mehr mit Nummer 0 angelegt werden",
  ],
  "v1.9.0": [
    "Möglichkeit hinzugefügt, Infrastrukturteams zu erstellen und zu bearbeiten",
    "Mitarbeitereinteilung hinzugefügt"
  ],
  "v1.8.5": [
    "Abhängigkeiten wurden aktualisiert",
  ],
  "v1.8.4": [
    "Option, dass Supporter freigeschaltet werden können, hinzugefügt",
  ],
  "v1.8.3": [
    "Option als Schulungsleiter mitzuhelfen wurde entfernt",
    "Beschreibung in Beruf wurde angepasst",
    "Weitere kleine Verbesserungen"
  ],
  "v1.8.2": [
    "Fehlerbehebung, dass in manchen Listen die Mitarbeiter nicht angezeigt wurden"
  ],
  "v1.8.1": [
    "Beziehungsstatus wird nicht mehr abgefragt",
    "Helferanmeldung kann nun deaktiviert werden",
    "Kleine Fehlerbehebungen"
  ],
  "v1.8.0": [
    "Motivationsbogen kann anhand der Erfahrung dynamisch angepasst werden",
    "Der VB MA kann ich für die Freischaltung von MA zuordnen",
    "KFZ-Kennzeichen können im Profil hinterlegt werden",
    "Sonstige Wünsche sind jetzt verpflichtend, wenn man 'Sonstiges' auswählt",
    "SOLA-Akademie ist jetzt als Option für die Mitarbeit auswählbar",
    "Kleine Fehlerbehebungen"
  ],
  "v1.7.6": [
    "Daten im Mitarbeiterprofil werden nun per Klick kopiert",
  ],
  "v1.7.5": [
    "Textvorlage wurde aus Themenforum entfernt",
  ],
  "v1.7.4": [
    "Fehlerbehebung, dass in der Gruppeneinteilung falsche IDs genutzt wurden",
  ],
  "v1.7.3": [
    "Die Dokumente-Übersicht berücksichtigt nur noch Mitarbeiter des aktuellen Jahres",
    "Rechtschreibfehler auf TN-Liste behoben",
  ],
  "v1.7.2": ["In der Teilnehmerliste können jetzt auch Gruppen angezeigt werden"],
  "v1.7.1": [
    "Nachkommastellen von TN/MA-Verhältnis auf 2 Stellen begrenzt",
    "Die Skills von Gitarrenspielern werden in der Gruppenliste richtig angezeigt",
    "Geschlechter von MA werden in der Gruppenliste richtig angezeigt",
    "In der Gruppenübersicht ist die Gemeinde von MA ist in der Länge begrenzt",
    "MA-Geburtstag in Gruppenübersicht hinzugefügt",
    "Verhältnis von TN/MA in Gruppenübersicht ausgeblendet, wenn keine TN vorhanden",
    "Wünsche von TN können ignoriert werden"
  ],
  "v1.7.0": ["Gruppeneinteilung für TN hinzugefügt"],
  "v1.6.4": ["Zeitangabe bei Führungszeugnis mit Selbsverpflichtung behoben"],
  "v1.6.3": ["Hotfix: Status von TN angepasst"],
  "v1.6.2": ["TN können nun auf die Warteliste gesetzt werden"],
  "v1.6.1": ["Admins können nun Fotos für andere MA hochladen"],
  "v1.6.0": [
    "TN-Liste für LT hinzugefügt",
    "TN können nun über LAMA freigeschaltet werden",
    "Eltern von freigeschalteten Teilnehmern bekommen eine Bestätigungsmail",
  ],
  "v1.5.4": ["2. VW zur Helferanmeldung hinzugefügt"],
  "v1.5.3": ["LTler können MA aus dem vergangenen Jahr einsehen"],
  "v1.5.2": ["Weitere Möglichkeiten, um MVB anzupassen"],
  "v1.5.1": ["Kleine Verbesserungen"],
  "v1.5.0": [
    "Motivationsbogen kann jetzt in LAMA direkt ausgefüllt werden",
    "Möglichkeit, um Features aktivieren und deaktivieren zu können",
    'Wenn man als Wunsch "Sonstiges" angibt, erscheint jetzt ein extra Feld, um den Wunsch zu spezifizieren',
  ],
  "v1.4.1": [
    "Mobile Ansicht fürs Themenforum optimiert",
    "Thementemplate fürs Forum angepasst",
  ],
  "v1.4.0": ["Themenforum hinzugefügt"],
  "v1.3.1": [
    "Menüpunkte sind trotz Versionsnummer klickbar",
    "Berechtigungskonzept für Papierkram hinzugefügt",
  ],
  "v1.3.0": ["Die Mail-Verteiler können direkt in LAMA genutzt werden"],
  "v1.2.5": [
    "Ernährungswünsche können im Nachhinein nicht mehr von MA geändert werden",
    "Birthday surprise",
  ],
  "v1.2.4": [
    "LTler können jetzt auch Briefe für kostenlose Führungszeugnisse für MAs generieren",
  ],
  "v1.2.3": ["Helferanmeldungen sind für LTler sichtbar"],
  "v1.2.2": ["Sortierung von Geburtstagen in erweiterter Liste behoben"],
  "v1.2.1": ["Optionen für Helferanmeldung erweitert"],
  "v1.2.0": [
    "PDF für kostenlose Führungszeugnisse hinzugefügt",
    "Übersicht für Unterlagen hinzugefügt",
    "LTler können MA-Daten bearbeiten",
    "Spalten in MA-Liste werden gespeichert",
  ],
  "v1.1.0": [
    "Helferanmeldung hinzugefügt",
    "Veranstaltungen und Einstellungen auch für nicht eingeloggte Nutzer sichtbar",
    "Menü zu anderen Anwendungen eingebunden",
  ],
  "v1.0.7": [
    "Automatisches Versenden von Mails, wenn MA freigeschaltet wurde",
    "Automatisches Hinzufügen zu Mailing-List bei Freischaltung",
  ],
  "v1.0.6": [
    "Zeige VB-Leiter in Mitarbeiterliste",
    "Versionsnummer in Footer eingefügt",
    "Changelog hinzugefügt",
  ],
  "v1.0.5": [
    "MAs in Freischaltliste richtig sortiert",
    "Rechtschreibfehler entfernt",
    "Ostereier gesucht",
  ],
  "v1.0.4": ["MAs in MA-Liste sortierbar gemacht"],
  "v1.0.3": [
    "MA in MA-Liste nebeneinander angezeigt",
    "Fehlermeldung in leeren Auswahlfeldern behoben",
    "Kommentar für Ernährungs-Info angepasst",
    "MA-Export für LTler hinzugefügt",
  ],
  "v1.0.2": ['Felder bei "Dein SOLA" richtig validiert'],
  "v1.0.1": [
    "Verlinkung zum Profil in erweiterter Nutzerliste",
    "Versionsnummer aus Menü entfernt",
    'Freitextfeld für "Sonstiges" hinzugefügt',
    "Indikatoren für Auf- und Abbau verbessert",
  ],
  "v1.0.0": ["Init"],
};

export default boot(async ({ app }) => {
  app.config.globalProperties.$version = version;
  app.config.globalProperties.$changelog = changelog;
});
