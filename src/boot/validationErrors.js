const validatorMessages = {
  notEmpty: 'Pflichtfeld',
  notNull: 'Pflichtfeld',
  is_null: 'Pflichtfeld',
  isEmail: 'Keine gültige E-Mail-Adresse',
  isNumeric: 'Nur Zahlen erlaubt',
  isInt: 'Nur ganze Zahlen erlaubt',
  isIn: 'Ungültiger Wert',
  len: 'Falsche Länge',
  isDate: 'Ungültiges Datum',
  is: 'Ungültiges Format',
  not: 'Ungültiger Wert',
  isUUID: 'Ungültige UUID',
  min: 'Wert zu klein',
  max: 'Wert zu groß',
};

export function applyBackendErrors(errorRef, data) {
  if (!data) return;
  if (!Array.isArray(data)) {
    if (typeof data === 'object') {
      Object.entries(data).forEach(([field, msg]) => {
        errorRef.value[field] = typeof msg === 'string' ? msg : 'Bitte prüfen';
      });
    }
    return;
  }
  data.forEach((entry) => {
    if (typeof entry === 'string') {
      errorRef.value[entry] = errorRef.value[entry] || 'Bereits vergeben';
    } else if (entry && typeof entry === 'object' && entry.path) {
      const msg = validatorMessages[entry.validator] || 'Bitte prüfen';
      errorRef.value[entry.path] = msg;
    }
  });
}
