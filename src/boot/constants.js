import { boot } from "quasar/wrappers";
import { api } from "./axios";
import moment from "moment";
var constants = {};

function date2String(event) {
  const s = event.start ? new moment(event.start).format("DD.MM.YYYY") : "";
  const e = event.end ? new moment(event.end).format("DD.MM.YYYY") : "";
  return s ? s + (e ? " - " + e : "") : "";
}

export default boot(async ({ app }) => {
  constants["events"] = {};

  await api.get("/event").then((response) => {
    Object.entries(response.data).forEach((entry) => {
      const [index, data] = entry;
      constants.events[data.id] = {
        start: data.start,
        end: data.end,
        location: data.location,
      };
    });
  });

  constants["userYearStatus"] = {
    notRegistered: 0,
    finishedProfile: 1,
    finishedMotivation: 2,
    pending: 3,
    activated: 4,
    rejected: 5,
    notFound: 404,
  };

  constants["profile"] = {
    firstName: {
      id: "firstName",
      title: "Vorname",
      icon: "id-card",
      access: "",
    },
    lastName: {
      id: "lastName",
      title: "Nachname",
      icon: "id-card",
      access: "",
    },
    nickname: {
      id: "nickname",
      title: "Spitzname",
      icon: "signature",
      access: "",
    },
    gender: {
      id: "gender",
      title: "Geschlecht",
      icon: "person-half-dress",
      options: {
        m: "Männlich",
        w: "Weiblich",
      },
      access: "",
    },
    mail: {
      id: "mail",
      title: "E-Mail",
      icon: "envelope",
      access: "",
    },
    birthday: {
      id: "birthday",
      title: "Geburtstag",
      icon: "cake-candles",
      access: "",
    },
    street: {
      id: "street",
      title: "Straße",
      icon: "location-dot",
      access: "",
    },
    zipCode: {
      id: "zipCode",
      title: "PLZ",
      icon: "location-dot",
      access: "",
    },
    city: {
      id: "city",
      title: "Ort",
      icon: "location-dot",
      access: "",
    },
    phone: {
      id: "phone",
      title: "Telefonnummer",
      icon: "phone",
      access: "",
    },
    mobile: {
      id: "mobile",
      title: "Handynummer",
      icon: "mobile-screen-button",
      access: "",
    },
    church: {
      id: "church",
      title: "Gemeinde",
      icon: "church",
      access: "",
    },
    churchContact: {
      id: "churchContact",
      title: "Gemeindekontakt",
      icon: "church",
      options: {
        true: "Ja",
        false: "Nein",
      },
      access: "",
    },
    job: {
      id: "job",
      title: "Beruf",
      icon: "briefcase",
      access: "",
    },
    vegetarian: {
      id: "vegetarian",
      title: "Vegetarier",
      icon: "utensils",
      options: {
        true: "Ja",
        false: "Nein",
      },
      access: "",
    },
    lactose: {
      id: "lactose",
      title: "Laktoseintoleranz",
      icon: "utensils",
      options: {
        true: "Ja",
        false: "Nein",
      },
      access: "",
    },
    plate: {
      id: "plate",
      title: "Kennzeichen",
      icon: "car",
      access: "",
    },
  };

  constants["engagement"] = {
    participation: {
      prepare1: {
        id: "prepare1",
        title: "1. Vorbereitungswochenende (VW)",
        icon: "calendar",
        hint: `${date2String(constants.events.prepare1)}`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Wahrscheinlich Nein" },
          { value: 2, label: "Wahrscheinlich Ja" },
          { value: 3, label: "Ja" },
        ],
      },
      prepare2: {
        id: "prepare2",
        title: "2. Vorbereitungswochenende (VW)",
        icon: "calendar",
        hint: `${date2String(constants.events.prepare2)}`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Wahrscheinlich Nein" },
          { value: 2, label: "Wahrscheinlich Ja" },
          { value: 3, label: "Ja" },
        ],
      },
      prepare3: {
        id: "prepare3",
        title: "3. Vorbereitungswochenende (VW)",
        icon: "calendar",
        hint: `${date2String(constants.events.prepare3)}`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Wahrscheinlich Nein" },
          { value: 2, label: "Wahrscheinlich Ja" },
          { value: 3, label: "Ja" },
        ],
      },
      training: {
        id: "training",
        title: "Schulungstage",
        icon: "chalkboard-user",
        hint: `Vor allem für neue Mitarbeiter empfohlen. ${date2String(
          constants.events.training,
        )}`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Wahrscheinlich Nein" },
          { value: 2, label: "Wahrscheinlich Ja" },
          { value: 3, label: "Ja" },
        ],
      },
      build: {
        id: "build",
        title: "Aufbau",
        icon: "person-digging",
        hint: `Grundsätzlich gilt: Wer beim Teens-SOLA dabei ist, ist auch beim Aufbau dabei. ${date2String(
          constants.events.build,
        )}`,
        options: [
          { value: 0, label: "Automatisch (Wie bei Teens)" },
          { value: 1, label: "Ja" },
          { value: 2, label: "Nein" },
        ],
      },
      teens: {
        id: "teens",
        title: "Teens-SOLA",
        icon: "campground",
        hint: `${date2String(constants.events.teens)}`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Wahrscheinlich Nein" },
          { value: 2, label: "Wahrscheinlich Ja" },
          { value: 3, label: "Ja" },
        ],
      },
      kids: {
        id: "kids",
        title: "Kids-SOLA",
        icon: "campground",
        hint: `${date2String(constants.events.kids)}`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Wahrscheinlich Nein" },
          { value: 2, label: "Wahrscheinlich Ja" },
          { value: 3, label: "Ja" },
        ],
      },
      cleanup: {
        id: "cleanup",
        title: "Abbau",
        icon: "person-digging",
        hint: `Grundsätzlich gilt: Wer beim Kids-SOLA dabei ist, ist auch beim Abbau dabei. ${date2String(
          constants.events.cleanup,
        )}`,
        options: [
          { value: 0, label: "Automatisch (Wie bei Kids)" },
          { value: 1, label: "Ja" },
          { value: 2, label: "Nein" },
        ],
      },
    },

    roles: {
      driver: {
        id: "driver",
        title: "Fahrgemeinschaft",
        icon: "car",
        hint: `Fährst du zu den Terminen mit dem Auto und kannst ggf. Leute mitnehmen?`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, 1 Person" },
          { value: 2, label: "Ja, 2 Personen" },
          { value: 3, label: "Ja, 3 Personen" },
          { value: 4, label: "Ja, 4 Personen" },
        ],
      },
      groupLeader: {
        id: "groupLeader",
        title: "Gruppenleiter (GL)",
        icon: "star",
        hint: `Kannst du dir vorstellen eine Gruppe / ein Team zu leiten?`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      dayLeader: {
        id: "dayLeader",
        title: "Tagesleiter",
        icon: "star",
        hint: `Deine Aufgabe ist es, auf dem Platz durch das Programm eines Tages zu leiten.`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      dayTeamLeader: {
        id: "dayTeamLeader",
        title: "Planungsleiter",
        icon: "star",
        hint: `Die Tage werden von mehreren Teams geplant. Kannst du eines davon leiten?`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      guitar: {
        id: "guitar",
        title: "Gitarre",
        icon: "guitar",
        hint: `Traust du dir zu, alleine am Lagerfeuer Gitarre zu spielen?`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Nein, ich bin Anfänger" },
          { value: 2, label: "Ja, ich bin fortgeschritten" },
          { value: 3, label: "Ja, ich bin Profi" },
        ],
      },
      singing: {
        id: "singing",
        title: "Gesang",
        icon: "microphone",
        hint: `Kannst du den Gesang in deiner Gruppe anleiten?`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      band: {
        id: "band",
        title: "Band",
        icon: "music",
        hint: `Möchtest du in der Band mitwirken? Wenn ja: gib bitte bei "Sonstige Anmerkungen" an, wie du dich einbringen möchtest.`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      drama: {
        id: "drama",
        title: "Anspiel",
        icon: "masks-theater",
        hint: `Siehst du dich im Anspielteam?`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als Nebencharakter" },
          { value: 2, label: "Ja, als Hauptrolle" },
        ],
      },
    },

    wishes: {
      wishTent: {
        id: "wishTent",
        title: "Zelt-MA",
        icon: "tent",
        hint: `Hier bist du direkt mit den Teilnehmern in einer Gruppe`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als weitere Alternative" },
          { value: 2, label: "Ja, als Alternative" },
          { value: 3, label: "Ja" },
        ],
      },
      wishKitchen: {
        id: "wishKitchen",
        title: "Küche",
        icon: "utensils",
        hint: `Bei einer Woche Action darf die gute Verpflegung natürlich nicht fehlen`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als weitere Alternative" },
          { value: 2, label: "Ja, als Alternative" },
          { value: 3, label: "Ja" },
        ],
      },
      wishOffice: {
        id: "wishOffice",
        title: "Lagerbüro",
        icon: "print",
        hint: `Es fallen immer ein paar Aufgaben an, die im Hintergrund erleidgt werden müssen. Vor allem im Bereich IT und Verwaltung`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als weitere Alternative" },
          { value: 2, label: "Ja, als Alternative" },
          { value: 3, label: "Ja" },
        ],
      },
      wishMedia: {
        id: "wishMedia",
        title: "Medienteam",
        icon: "camera",
        hint: `Vor allem, wenn du Lust auf Fotografieren und Filmen hast, bist du hier richtig`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als weitere Alternative" },
          { value: 2, label: "Ja, als Alternative" },
          { value: 3, label: "Ja" },
        ],
      },
      wishMedic: {
        id: "wishMedic",
        title: "Sani",
        icon: "suitcase-medical",
        hint: `Hier kümmerst du dich um verletzte und kranke Teilnehmer und Mitarbeiter`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als weitere Alternative" },
          { value: 2, label: "Ja, als Alternative" },
          { value: 3, label: "Ja" },
        ],
      },
      wishInfrastructure: {
        id: "wishInfrastructure",
        title: "Springer",
        icon: "screwdriver-wrench",
        hint: `Handwerk, Strom, Gas, Wasser - Die Springer kümmern sich unter anderem um eine funktionierende Infrastruktur`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als weitere Alternative" },
          { value: 2, label: "Ja, als Alternative" },
          { value: 3, label: "Ja" },
        ],
      },
      wishPrayer: {
        id: "wishPrayer",
        title: "Gebetsteam",
        icon: "praying-hands",
        hint: `Neben Gebeten für das SOLA, hat das Gebetsteam ein offenes Ohr für alle, organisiert die freiwillige Gebetszeit und schaut, was sonst noch gebraucht wird`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als weitere Alternative" },
          { value: 2, label: "Ja, als Alternative" },
          { value: 3, label: "Ja" },
        ],
      },
      wishAcademy: {
        id: "wishAcademy",
        title: "SOLA-Akademie",
        icon: "praying-hands",
        hint: `Die SOLA-Akademie findet während des Teens-SOLAs statt und dient dazu, ältere Teens auf die Mitarbeit bei den Kids in diesem Jahr vorzubereiten.`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als weitere Alternative" },
          { value: 2, label: "Ja, als Alternative" },
          { value: 3, label: "Ja" },
        ],
      },
      wishOther: {
        id: "wishOther",
        title: "Sonstiges",
        icon: "circle-question",
        hint: `Wenn dir nichts zusagt oder du spezielle Wünsche hast, schreib sie gerne unten in das Feld für sonstige Anmerkungen`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja, als weitere Alternative" },
          { value: 2, label: "Ja, als Alternative" },
          { value: 3, label: "Ja" },
        ],
      },
    },
  };
  constants["documents"] = {
    criminalRecord: {
      id: "criminalRecord",
      title: "Führungszeugnis",
      icon: "handcuffs",
      interval: 5,
    },
    selfCommitment: {
      id: "selfCommitment",
      title: "Verhaltenskodex",
      icon: "file-signature",
      interval: 5,
    },
    privacyCommitment: {
      id: "privacyCommitment",
      title: "Datenschutz",
      icon: "file-shield",
      interval: 1,
    },
    parentalConsent: {
      id: "parentalConsent",
      title: "U18-Zettel",
      icon: "file-signature",
      interval: 1,
    },
  };

  constants["genderOptions"] = [
    {
      value: "m",
      label: "Männlich",
    },
    {
      value: "w",
      label: "Weiblich",
    },
  ];

  constants["nutritionOptions"] = [
    {
      value: "vegetarian",
      label: "Vegetarisch",
    },
    {
      value: "lactose",
      label: "Laktosefrei",
    },
  ];

  constants["driverOptions"] = [
    {
      value: "car",
      backendName: "supportTypeDriverCar",
      label: "PKW",
    },
    {
      value: "trailer",
      backendName: "supportTypeDriverTrailer",
      label: "Anhänger bis 3,5 t",
    },
    {
      value: "truck",
      backendName: "supportTypeDriverTruck",
      label: "LKW bis 7,5 t",
    },
  ];

  constants["vehicleOptions"] = [
    {
      value: "trailer",
      backendName: "supportTypeVehicleTrailer",
      label: "Anhänger",
    },
    {
      value: "car",
      backendName: "supportTypeVehicleCar",
      label: "Zugfahrzeug",
    },
    {
      value: "van",
      backendName: "supportTypeVehicleVan",
      label: "Transporter",
    },
  ];

  constants["supporterTasks"] = [
    {
      name: "tasks",
      backendName: "supportTypeTasks",
      label: "Praktische Aufgaben",
      description:
        "Z.B. Aufbau, Abbau, Instandhaltung des Materials, Strom- oder Wasserinstallation, ...",
    },
    {
      name: "deco",
      backendName: "supportTypeDeco",
      label: "Deko",
      description: "Planung, Herstellung, vor Ort dekorieren, ...",
    },
    {
      name: "material",
      backendName: "supportTypeMaterial",
      label: "Material",
      description: "Material Materialien für das SOLA besorgen",
    },
    {
      name: "training",
      backendName: "supportTypeTraining",
      label: "Schulungen",
      description:
        "Schulungen für die Mitarbeiter bei Vorbereitungswochenenden",
    },
    {
      name: "workshops",
      backendName: "supportTypeWorkshops",
      label: "Workshops",
      description: "Workshops für die Kids auf dem Platz",
    },
    {
      name: "seminars",
      backendName: "supportTypeSeminars",
      label: "Seminare",
      description: "Seminare für die Teens auf dem Platz",
    },
    {
      name: "infrastructure",
      backendName: "supportTypeInfrastructure",
      label: "Springer",
      description:
        "Das Springerteam auf dem Platz oder bei den Vorbereitungen unterstützen",
    },
    {
      name: "kitchen",
      backendName: "supportTypeKitchen",
      label: "Küche",
      description:
        "Das Küchenteam auf dem Platz oder bei den Vorbereitungen unterstützen",
    },
    {
      name: "media",
      backendName: "supportTypeMedia",
      label: "Medienteam",
      description:
        "Das Medienteam auf dem Platz oder bei den Vorbereitungen unterstützen",
    },
    {
      name: "prayer",
      backendName: "supportTypePrayer",
      label: "Gebetsteam",
      description:
        "Das Gebetsteam auf dem Platz oder bei den Vorbereitungen unterstützen",
    },
    {
      name: "games",
      backendName: "supportTypeGames",
      label: "Geländespiele",
      description:
        "Bei den Geländespielen auf dem Platz helfen, z.B. eine Station betreuen oder einen Schergen spielen.",
    },
    {
      name: "nightwatch",
      backendName: "supportTypeNightwatch",
      label: "Nachtwache",
      description: "Die Nachtwache auf dem Platz übernehmen",
    },
    {
      name: "other",
      backendName: "supportTypeOther",
      label: "Sonstiges",
      description:
        "Sonstiges, was du gerne machen würdest (bitte im Textfeld angeben)",
    },
  ];

  app.config.globalProperties.$constants = constants;
});

export { constants };
