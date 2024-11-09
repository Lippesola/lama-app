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
      icon: "fa-solid fa-id-card",
      access: "",
    },
    lastName: {
      id: "lastName",
      title: "Nachname",
      icon: "fa-solid fa-id-card",
      access: "",
    },
    nickname: {
      id: "nickname",
      title: "Spitzname",
      icon: "fa-solid fa-signature",
      access: "",
    },
    gender: {
      id: "gender",
      title: "Geschlecht",
      icon: "fa-solid fa-person-half-dress",
      options: {
        m: "Männlich",
        w: "Weiblich",
      },
      access: "",
    },
    relationship: {
      id: "relationship",
      title: "Beziehungsstatus",
      icon: "fa-solid fa-heart",
      options: [
        "Single",
        "In einer Beziehung",
        "Bitte fragt mich in einem persönlichen Gespräch",
      ],
      access: "",
    },
    mail: {
      id: "mail",
      title: "E-Mail",
      icon: "fa-solid fa-envelope",
      access: "",
    },
    birthday: {
      id: "birthday",
      title: "Geburtstag",
      icon: "fa-solid fa-cake-candles",
      access: "",
    },
    street: {
      id: "street",
      title: "Straße",
      icon: "fa-solid fa-location-dot",
      access: "",
    },
    zipCode: {
      id: "zipCode",
      title: "PLZ",
      icon: "fa-solid fa-location-dot",
      access: "",
    },
    city: {
      id: "city",
      title: "Ort",
      icon: "fa-solid fa-location-dot",
      access: "",
    },
    phone: {
      id: "phone",
      title: "Telefonnummer",
      icon: "fa-solid fa-phone",
      access: "",
    },
    mobile: {
      id: "mobile",
      title: "Handynummer",
      icon: "fa-solid fa-mobile-screen-button",
      access: "",
    },
    church: {
      id: "church",
      title: "Gemeinde",
      icon: "fa-solid fa-church",
      access: "",
    },
    churchContact: {
      id: "churchContact",
      title: "Gemeindekontakt",
      icon: "fa-solid fa-church",
      options: {
        true: "Ja",
        false: "Nein",
      },
      access: "",
    },
    job: {
      id: "job",
      title: "Beruf",
      icon: "fa-solid fa-briefcase",
      access: "",
    },
    vegetarian: {
      id: "vegetarian",
      title: "Vegetarier",
      icon: "fa-solid fa-utensils",
      options: {
        true: "Ja",
        false: "Nein",
      },
      access: "",
    },
    lactose: {
      id: "lactose",
      title: "Laktoseintoleranz",
      icon: "fa-solid fa-utensils",
      options: {
        true: "Ja",
        false: "Nein",
      },
      access: "",
    },
  };

  constants["engagement"] = {
    participation: {
      prepare1: {
        id: "prepare1",
        title: "1. Vorbereitungswochenende (VW)",
        icon: "fa-solid fa-calendar",
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
        icon: "fa-solid fa-calendar",
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
        icon: "fa-solid fa-calendar",
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
        icon: "fa-solid fa-chalkboard-user",
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
        icon: "fa-solid fa-person-digging",
        hint: `Grundsätzlich gilt: Wer beim Teen-Sola dabei ist, ist auch beim Aufbau dabei. ${date2String(
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
        title: "Teen-Sola",
        icon: "fa-solid fa-campground",
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
        title: "Kids-Sola",
        icon: "fa-solid fa-campground",
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
        icon: "fa-solid fa-person-digging",
        hint: `Grundsätzlich gilt: Wer beim Kids-Sola dabei ist, ist auch beim Abbau dabei. ${date2String(
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
        icon: "fa-solid fa-car",
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
        icon: "fa-solid fa-star",
        hint: `Kannst du dir vorstellen eine Gruppe zu leiten?`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      trainer: {
        id: "trainer",
        title: "Schulungsleiter",
        icon: "fa-solid fa-chalkboard-user",
        hint: `Du könntest Schulungen z.B. bei Vorbereitungswochenenden leiten`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      dayLeader: {
        id: "dayLeader",
        title: "Tagesleiter",
        icon: "fa-solid fa-star",
        hint: `Deine Aufgabe ist es, auf dem Platz durch das Programm eines Tages zu leiten.`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      dayTeamLeader: {
        id: "dayTeamLeader",
        title: "TagesTeamLeiter",
        icon: "fa-solid fa-star",
        hint: `Die Tage werden von mehreren Teams geplant. Kannst du eines davon leiten?`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      guitar: {
        id: "guitar",
        title: "Gitarre",
        icon: "fa-solid fa-guitar",
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
        icon: "fa-solid fa-microphone",
        hint: `Kannst du den Gesang in deiner Gruppe anleiten?`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      band: {
        id: "band",
        title: "Band",
        icon: "fa-solid fa-music",
        hint: `Möchtest du in der Band mitwirken? Wenn ja: gib bitte bei "Sonstige Anmerkungen" an, wie du dich einbringen möchtest.`,
        options: [
          { value: 0, label: "Nein" },
          { value: 1, label: "Ja" },
        ],
      },
      drama: {
        id: "drama",
        title: "Anspiel",
        icon: "fa-solid fa-masks-theater",
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
        icon: "fa-solid fa-tent",
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
        icon: "fa-solid fa-utensils",
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
        icon: "fa-solid fa-print",
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
        icon: "fa-solid fa-camera",
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
        icon: "fa-solid fa-suitcase-medical",
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
        icon: "fa-solid fa-screwdriver-wrench",
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
        icon: "fa-solid fa-praying-hands",
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
        icon: "fa-solid fa-praying-hands",
        hint: `Die SOLA-Akademie findet während des Teen-SOLAs statt und dient dazu, ältere Teens auf die Mitarbeit bei den Kids in diesem Jahr vorzubereiten.`,
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
        icon: "fa-solid fa-circle-question",
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
      icon: "fa-solid fa-handcuffs",
    },
    selfCommitment: {
      id: "selfCommitment",
      title: "Verhaltenskodex",
      icon: "fa-solid fa-file-signature",
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
