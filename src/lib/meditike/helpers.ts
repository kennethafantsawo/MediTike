/**
 * Helpers MediTike — formatage téléphone multi-pays, devises, dates, validation.
 */

/** Pays supportés avec indicatif international. */
export interface Country {
  code: string;      // indicatif sans le +, ex: "228"
  name: string;      // nom affiché
  flag: string;      // emoji drapeau
  phoneLength: number; // nombre de chiffres du numéro local (sans indicatif)
}

export const SUPPORTED_COUNTRIES: Country[] = [
  { code: "228", name: "Togo", flag: "🇹🇬", phoneLength: 8 },
  { code: "229", name: "Bénin", flag: "🇧🇯", phoneLength: 8 },
  { code: "225", name: "Côte d'Ivoire", flag: "🇨🇮", phoneLength: 10 },
  { code: "233", name: "Ghana", flag: "🇬🇭", phoneLength: 9 },
  { code: "226", name: "Burkina Faso", flag: "🇧🇫", phoneLength: 8 },
  { code: "221", name: "Sénégal", flag: "🇸🇳", phoneLength: 9 },
  { code: "223", name: "Mali", flag: "🇲🇱", phoneLength: 8 },
  { code: "227", name: "Niger", flag: "🇳🇪", phoneLength: 8 },
  { code: "224", name: "Guinée", flag: "🇬🇳", phoneLength: 9 },
  { code: "237", name: "Cameroun", flag: "🇨🇲", phoneLength: 9 },
  { code: "33", name: "France", flag: "🇫🇷", phoneLength: 9 },
  { code: "1", name: "USA/Canada", flag: "🇺🇸", phoneLength: 10 },
];

/** Trouve un pays par son code indicatif. */
export function findCountryByCode(code: string): Country | undefined {
  return SUPPORTED_COUNTRIES.find((c) => c.code === code);
}

/**
 * Normalise un numéro de téléphone avec indicatif pays.
 * @param input numéro saisi (chiffres uniquement, ou avec espaces)
 * @param countryCode code indicatif sans le + (ex: "228" pour Togo)
 * @returns format international: +228XXXXXXXX
 */
export function normalizePhone(input: string, countryCode: string = "228"): string {
  if (!input) return "";
  // Extraire uniquement les chiffres
  const digits = input.replace(/[^0-9]/g, "");
  if (!digits) return "";

  // Si l'utilisateur a déjà tapé l'indicatif, on le retire
  const country = findCountryByCode(countryCode);
  const expectedLength = country?.phoneLength || 8;

  // Si le nombre de chiffres correspond exactement à la longueur locale
  if (digits.length === expectedLength) {
    return `+${countryCode}${digits}`;
  }

  // Si l'utilisateur a tapé l'indicatif + les chiffres locaux
  if (digits.length === countryCode.length + expectedLength && digits.startsWith(countryCode)) {
    return `+${digits}`;
  }

  // Si ça commence déjà par +, on garde tel quel
  if (input.startsWith("+")) {
    return input.replace(/[^0-9+]/g, "");
  }

  // Fallback: on préfixe avec l'indicatif
  return `+${countryCode}${digits}`;
}

/**
 * Formate un numéro de téléphone pour affichage avec espaces.
 * Ex: "90123456" → "90 12 34 56"
 * Ex: "+22890123456" → "+228 90 12 34 56"
 * @param input numéro saisi ou stocké
 * @param countryCode indicatif pour le formatage (défaut: 228 Togo)
 */
export function formatPhone(input: string, countryCode: string = "228"): string {
  if (!input) return "";
  const clean = input.replace(/[^0-9]/g, "");

  // Si on a un numéro avec indicatif
  if (clean.startsWith(countryCode) && clean.length > countryCode.length) {
    const local = clean.slice(countryCode.length);
    return `+${countryCode} ${groupDigits(local)}`;
  }

  // Si c'est juste le numéro local
  if (clean.length <= (findCountryByCode(countryCode)?.phoneLength || 8)) {
    return groupDigits(clean);
  }

  return input;
}

/** Regroupe les chiffres par 2 pour la lisibilité. */
function groupDigits(digits: string): string {
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 2) {
    groups.push(digits.slice(i, i + 2));
  }
  return groups.join(" ");
}

/**
 * Formate un numéro en temps réel pendant la saisie.
 * Ajoute automatiquement des espaces tous les 2 chiffres.
 * @param input ce que l'utilisateur tape
 * @returns texte formaté avec espaces
 */
export function formatPhoneInput(input: string): string {
  // Garder uniquement les chiffres
  const digits = input.replace(/[^0-9]/g, "");
  if (!digits) return "";
  // Grouper par 2
  return groupDigits(digits);
}

// ─── Compatibilité avec l'ancien code (alias) ──────────────────
/** @deprecated Utilisez normalizePhone(input, countryCode) à la place */
export function normalizeTogoPhone(input: string): string {
  return normalizePhone(input, "228");
}

/** @deprecated Utilisez formatPhone(input, countryCode) à la place */
export function formatTogoPhone(input: string): string {
  return formatPhone(input, "228");
}

/** Formate un prix en FCFA. */
export function formatPrice(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} F CFA`;
}

/** Construit un lien WhatsApp wa.me avec message optionnel. */
export function buildWhatsAppLink(phone: string, message?: string): string {
  if (!phone) return "#";
  const clean = phone.replace(/[^0-9]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${clean}${text}`;
}

/**
 * Retourne le lundi de la semaine de garde active.
 *
 * Règle MediTike : la liste de garde change chaque lundi à 7h00 UTC.
 * - Si on est lundi AVANT 7h UTC → on est encore sur la semaine précédente
 * - Sinon → on est sur la semaine du lundi courant
 *
 * @param date date de référence (défaut: maintenant)
 * @returns le lundi à 00:00 UTC de la semaine active
 */
export function getMondayUTC(date: Date = new Date()): Date {
  // Travailler en UTC
  const dayOfWeek = date.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
  const hour = date.getUTCHours();

  // Calculer le lundi de la semaine actuelle
  let mondayDate: Date;
  if (dayOfWeek === 1) {
    // Lundi : si avant 7h UTC, on prend le lundi précédent
    if (hour < 7) {
      const d = new Date(date);
      d.setUTCDate(d.getUTCDate() - 7);
      mondayDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    } else {
      mondayDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
  } else {
    // Autre jour : remonter au lundi le plus proche
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 0 (dimanche) → -6, sinon 1-day
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + diff);
    mondayDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  return mondayDate;
}

/** Formate une date en français. */
export function formatDateFr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Formate une date courte en français. */
export function formatDateShortFr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Temps relatif en français. */
export function relativeTimeFr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "à l'instant";
  const min = Math.floor(sec / 60);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `il y a ${days} j`;
  return formatDateShortFr(d);
}

/** Formatte une plage de semaines: "06/07/2026 au 13/07/2026". */
export function formatWeekRange(start: Date, end: Date): string {
  const fmt = (d: Date) => {
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = d.getUTCFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };
  return `${fmt(start)} au ${fmt(end)}`;
}

/** Valide la force d'un mot de passe. Retourne null si OK, sinon un message d'erreur. */
export function validatePassword(password: string): string | null {
  if (!password || password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (!/[A-Za-z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre.";
  }
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre.";
  }
  if (!/[!@#$%&*]/.test(password)) {
    return "Le mot de passe doit contenir au moins un caractère spécial (! @ # $ % & *).";
  }
  return null;
}

/** Valide un numéro de téléphone togolais (8 chiffres). */
export function validateTogoPhone(input: string): boolean {
  const normalized = normalizeTogoPhone(input);
  return /^\+228\d{8}$/.test(normalized);
}

/**
 * Valide un numéro de téléphone avec indicatif pays.
 * @param input numéro saisi
 * @param countryCode indicatif (ex: "228" pour Togo)
 * @returns true si le numéro est valide pour ce pays
 */
export function validatePhone(input: string, countryCode: string = "228"): boolean {
  const country = findCountryByCode(countryCode);
  if (!country) return false;
  const normalized = normalizePhone(input, countryCode);
  const expectedLength = countryCode.length + country.phoneLength;
  return new RegExp(`^\\+${countryCode}\\d{${country.phoneLength}}$`).test(normalized);
}

/** Génère un identifiant aléatoire sécurisé (URL admin secrète). */
export function generateSecretToken(length: number = 24): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

/** Calcule la date de suppression d'une photo.
 * - Si la demande a reçu une réponse : 72h après la première réponse
 * - Si pas de réponse : 7 jours après la création de la demande
 */
export function calculatePhotoDeletionDate(
  requestCreatedAt: Date,
  firstResponseAt: Date | null
): Date {
  if (firstResponseAt) {
    return new Date(firstResponseAt.getTime() + 72 * 60 * 60 * 1000); // +72h
  }
  return new Date(requestCreatedAt.getTime() + 7 * 24 * 60 * 60 * 1000); // +7j
}

/** Taille maximale des photos en bytes (1 Mo — anti Denial of Wallet). */
export const MAX_PHOTO_SIZE = 1 * 1024 * 1024;

/** Types MIME autorisés pour les photos. */
export const ALLOWED_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

/** Types MIME explicitement REJETÉS (dangereux). */
export const BLOCKED_PHOTO_MIME_TYPES = [
  "image/svg+xml",
  "text/html",
  "text/plain",
  "application/javascript",
  "application/x-httpd-php",
  "application/octet-stream",
];

/** Extensions autorisées. */
export const ALLOWED_PHOTO_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

/** Extensions explicitement REJETÉES. */
export const BLOCKED_PHOTO_EXTENSIONS = [".svg", ".html", ".htm", ".js", ".php", ".exe", ".bat"];

/** Vérifie si un type MIME est autorisé. */
export function isAllowedPhotoType(mimeType: string): boolean {
  const mt = mimeType.toLowerCase();
  // Rejet explicite des types dangereux
  if (BLOCKED_PHOTO_MIME_TYPES.includes(mt)) return false;
  return ALLOWED_PHOTO_MIME_TYPES.includes(mt);
}

/** Vérifie si une extension est autorisée (et pas dans la liste bloquée). */
export function isAllowedPhotoExtension(filename: string): boolean {
  const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0] || "";
  if (BLOCKED_PHOTO_EXTENSIONS.includes(ext)) return false;
  return ALLOWED_PHOTO_EXTENSIONS.includes(ext);
}
