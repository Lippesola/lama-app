import { defineBoot } from '#q-app'

// Set at build time in quasar.config.js (build.defineEnv)
const buildDate = import.meta.env.BUILD_DATE;
const gitSha = import.meta.env.GIT_SHA;

// Newest entry first. Add new entries at the top with the release date (YYYY-MM-DD).
const changelog = [
  {
    date: "2026-11-10",
    changes: [
      "Registrierungsprozess wirft jetzt keinen Fehler mehr",
      "Einige Abhängigkeiten wurden aktualisiert",
    ],
  },
  {
    date: "2026-08-02",
    changes: [
      "Interner Kommentar im Profil wird nicht mehr übermäßig groß dargestellt",
      "Interner Kommentar kann jetzt auch direkt bei der Freischaltung eingesehen und bearbeitet werden",
    ],
  },
  {
    date: "2026-07-24",
    changes: [
      "Die Icons in LAMA wurden modernisiert und einheitlicher gestaltet",
      "In den Tabellen werden Headerleisten im Vollbild immer angezeigt",
      "Ausstehende Freischaltungen für Mitarbeiter oder Helfer werden jetzt im Menü angezeigt",
    ],
  },
  {
    date: "2026-07-19",
    changes: [
      "Teilnehmerdaten können jetzt direkt in LAMA bearbeitet werden",
      "Die Verwaltungsansicht für Papierkram ist übersichtlicher gestaltet",
      "Der U18-Status wird jetzt korrekt angezeigt",
    ],
  },
  {
    date: "2026-05-31",
    changes: [
      "Die Mitarbeitereinteilung kann jetzt einfacher exportiert werden.",
    ],
  },
  {
    date: "2026-04-30",
    changes: [
      "Die Helferanmeldung wurde überarbeitet",
      "LTler können nun auch Helferanmeldungen bearbeiten",
      "Bei der Gruppeneinteilung werden MA ausgeblendet, wenn sie in der entsprechenden Woche nicht teilnehmen",
    ],
  },
  {
    date: "2026-04-23",
    changes: [
      "Die Adressleiste im Browser bleibt beim Anmelden jetzt aufgeräumter",
    ],
  },
  {
    date: "2026-03-22",
    changes: [
      "Verbesserte Ladegeschwindigkeit wenn LAMA bereits geöffnet wurde",
    ],
  },
  {
    date: "2026-03-21",
    changes: [
      "Behebt das Problem, dass man sich nicht mehr einloggen kann",
      "Suche zu Mitarbeiterliste hinzugefügt",
      "Suche zu erweiterter Mitarbeiterliste hinzugefügt",
      "Mitarbeiteranzahl in erweiterter Mitarbeiterliste hinzugefügt",
      "Kleine Verbesserungen",
    ],
  },
  {
    date: "2026-03-07",
    changes: [
      "Zeige von Element importierte Profilbilder korrekt an",
    ],
  },
  {
    date: "2025-11-15",
    changes: [
      "Kleine Fehlerbehebungen",
      "Das LT kann interne Kommentare zu MA hinterlassen (bspw. zur Verfügbarkeit)",
      "Bei der Freischaltung von MA steht jetzt immer das korrekte Registrierungsdatum",
    ],
  },
  {
    date: "2025-07-21",
    changes: [
      "Weitere Dokumente für MA hinzugefügt",
      "Kennzeichen-Feld in MA-Liste hinzugefügt",
      "Erlaubt die Gruppe der MA in der erweiterten Nutzerliste anzuzeigen",
      "Fehlerbehebung, dass die Gruppeneinteilung nicht korrekt angezeigt wurde",
    ],
  },
  {
    date: "2025-06-19",
    changes: [
      "Behebung, dass die Sortierung in der MA-Liste mit Umlauten nicht funktioniert hat",
    ],
  },
  {
    date: "2025-06-04",
    changes: [
      "Bei der Gruppeneinteilung können Personen nun gefiltert werden",
      "Gruppen können nicht mehr mit Nummer 0 angelegt werden",
    ],
  },
  {
    date: "2025-06-02",
    changes: [
      "Möglichkeit hinzugefügt, Infrastrukturteams zu erstellen und zu bearbeiten",
      "Mitarbeitereinteilung hinzugefügt",
    ],
  },
  {
    date: "2025-04-09",
    changes: [
      "Abhängigkeiten wurden aktualisiert",
    ],
  },
  {
    date: "2025-02-16",
    changes: [
      "Option, dass Supporter freigeschaltet werden können, hinzugefügt",
    ],
  },
  {
    date: "2025-02-07",
    changes: [
      "Option als Schulungsleiter mitzuhelfen wurde entfernt",
      "Beschreibung in Beruf wurde angepasst",
      "Weitere kleine Verbesserungen",
    ],
  },
  {
    date: "2024-11-18",
    changes: [
      "Fehlerbehebung, dass in manchen Listen die Mitarbeiter nicht angezeigt wurden",
    ],
  },
  {
    date: "2024-11-16",
    changes: [
      "Beziehungsstatus wird nicht mehr abgefragt",
      "Helferanmeldung kann nun deaktiviert werden",
      "Kleine Fehlerbehebungen",
    ],
  },
  {
    date: "2024-11-09",
    changes: [
      "Motivationsbogen kann anhand der Erfahrung dynamisch angepasst werden",
      "Der VB MA kann ich für die Freischaltung von MA zuordnen",
      "KFZ-Kennzeichen können im Profil hinterlegt werden",
      "Sonstige Wünsche sind jetzt verpflichtend, wenn man 'Sonstiges' auswählt",
      "SOLA-Akademie ist jetzt als Option für die Mitarbeit auswählbar",
      "Kleine Fehlerbehebungen",
    ],
  },
  {
    date: "2024-09-15",
    changes: [
      "Daten im Mitarbeiterprofil werden nun per Klick kopiert",
    ],
  },
  {
    date: "2024-09-03",
    changes: [
      "Textvorlage wurde aus Themenforum entfernt",
    ],
  },
  {
    date: "2024-08-05",
    changes: [
      "Fehlerbehebung, dass in der Gruppeneinteilung falsche IDs genutzt wurden",
    ],
  },
  {
    date: "2024-07-31",
    changes: [
      "Die Dokumente-Übersicht berücksichtigt nur noch Mitarbeiter des aktuellen Jahres",
      "Rechtschreibfehler auf TN-Liste behoben",
    ],
  },
  {
    date: "2024-07-29",
    changes: [
      "In der Teilnehmerliste können jetzt auch Gruppen angezeigt werden",
    ],
  },
  {
    date: "2024-07-25",
    changes: [
      "Nachkommastellen von TN/MA-Verhältnis auf 2 Stellen begrenzt",
      "Die Skills von Gitarrenspielern werden in der Gruppenliste richtig angezeigt",
      "Geschlechter von MA werden in der Gruppenliste richtig angezeigt",
      "In der Gruppenübersicht ist die Gemeinde von MA ist in der Länge begrenzt",
      "MA-Geburtstag in Gruppenübersicht hinzugefügt",
      "Verhältnis von TN/MA in Gruppenübersicht ausgeblendet, wenn keine TN vorhanden",
      "Wünsche von TN können ignoriert werden",
    ],
  },
  {
    date: "2024-07-24",
    changes: [
      "Gruppeneinteilung für TN hinzugefügt",
    ],
  },
  {
    date: "2024-05-05",
    changes: [
      "Zeitangabe bei Führungszeugnis mit Selbsverpflichtung behoben",
    ],
  },
  {
    date: "2024-04-24",
    changes: [
      "Hotfix: Status von TN angepasst",
      "TN können nun auf die Warteliste gesetzt werden",
    ],
  },
  {
    date: "2024-04-06",
    changes: [
      "Admins können nun Fotos für andere MA hochladen",
    ],
  },
  {
    date: "2024-02-21",
    changes: [
      "TN-Liste für LT hinzugefügt",
      "TN können nun über LAMA freigeschaltet werden",
      "Eltern von freigeschalteten Teilnehmern bekommen eine Bestätigungsmail",
    ],
  },
  {
    date: "2024-02-03",
    changes: [
      "2. VW zur Helferanmeldung hinzugefügt",
    ],
  },
  {
    date: "2023-12-13",
    changes: [
      "LTler können MA aus dem vergangenen Jahr einsehen",
    ],
  },
  {
    date: "2023-12-12",
    changes: [
      "Weitere Möglichkeiten, um MVB anzupassen",
    ],
  },
  {
    date: "2023-12-11",
    changes: [
      "Kleine Verbesserungen",
      "Motivationsbogen kann jetzt in LAMA direkt ausgefüllt werden",
      "Möglichkeit, um Features aktivieren und deaktivieren zu können",
      "Wenn man als Wunsch \"Sonstiges\" angibt, erscheint jetzt ein extra Feld, um den Wunsch zu spezifizieren",
    ],
  },
  {
    date: "2023-08-12",
    changes: [
      "Mobile Ansicht fürs Themenforum optimiert",
      "Thementemplate fürs Forum angepasst",
    ],
  },
  {
    date: "2023-08-10",
    changes: [
      "Themenforum hinzugefügt",
    ],
  },
  {
    date: "2023-07-19",
    changes: [
      "Menüpunkte sind trotz Versionsnummer klickbar",
      "Berechtigungskonzept für Papierkram hinzugefügt",
    ],
  },
  {
    date: "2023-07-11",
    changes: [
      "Die Mail-Verteiler können direkt in LAMA genutzt werden",
    ],
  },
  {
    date: "2023-07-08",
    changes: [
      "Ernährungswünsche können im Nachhinein nicht mehr von MA geändert werden",
      "Birthday surprise",
    ],
  },
  {
    date: "2023-07-04",
    changes: [
      "LTler können jetzt auch Briefe für kostenlose Führungszeugnisse für MAs generieren",
      "Helferanmeldungen sind für LTler sichtbar",
    ],
  },
  {
    date: "2023-06-08",
    changes: [
      "Sortierung von Geburtstagen in erweiterter Liste behoben",
      "Optionen für Helferanmeldung erweitert",
    ],
  },
  {
    date: "2023-05-20",
    changes: [
      "PDF für kostenlose Führungszeugnisse hinzugefügt",
      "Übersicht für Unterlagen hinzugefügt",
      "LTler können MA-Daten bearbeiten",
      "Spalten in MA-Liste werden gespeichert",
    ],
  },
  {
    date: "2023-04-16",
    changes: [
      "Helferanmeldung hinzugefügt",
      "Veranstaltungen und Einstellungen auch für nicht eingeloggte Nutzer sichtbar",
      "Menü zu anderen Anwendungen eingebunden",
    ],
  },
  {
    date: "2023-03-20",
    changes: [
      "Automatisches Versenden von Mails, wenn MA freigeschaltet wurde",
      "Automatisches Hinzufügen zu Mailing-List bei Freischaltung",
    ],
  },
  {
    date: "2023-02-04",
    changes: [
      "Zeige VB-Leiter in Mitarbeiterliste",
      "Versionsnummer in Footer eingefügt",
      "Changelog hinzugefügt",
    ],
  },
  {
    date: "2023-02-02",
    changes: [
      "MAs in Freischaltliste richtig sortiert",
      "Rechtschreibfehler entfernt",
      "Ostereier gesucht",
    ],
  },
  {
    date: "2023-02-01",
    changes: [
      "MAs in MA-Liste sortierbar gemacht",
    ],
  },
  {
    date: "2023-01-29",
    changes: [
      "MA in MA-Liste nebeneinander angezeigt",
      "Fehlermeldung in leeren Auswahlfeldern behoben",
      "Kommentar für Ernährungs-Info angepasst",
      "MA-Export für LTler hinzugefügt",
    ],
  },
  {
    date: "2023-01-25",
    changes: [
      "Felder bei \"Dein SOLA\" richtig validiert",
    ],
  },
  {
    date: "2023-01-24",
    changes: [
      "Verlinkung zum Profil in erweiterter Nutzerliste",
      "Versionsnummer aus Menü entfernt",
      "Freitextfeld für \"Sonstiges\" hinzugefügt",
      "Indikatoren für Auf- und Abbau verbessert",
    ],
  },
  {
    date: "2023-01-23",
    changes: [
      "Init",
    ],
  },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  });
}

export default defineBoot(async ({ app }) => {
  app.config.globalProperties.$buildInfo = `${new Date(buildDate).toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' })} · ${gitSha}`;
  app.config.globalProperties.$changelog = changelog.map((entry) => ({
    ...entry,
    label: formatDate(entry.date),
  }));
});
