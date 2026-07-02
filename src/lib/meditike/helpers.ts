/**
 * Helpers MediTike — formatage téléphone Togo, devises, dates, validation.
 */

/** Normalise un numéro de téléphone togolais en format international +228XXXXXXXX. */
export function normalizeTogoPhone(input: string): string {
  if (!input) return "";
  let clean = input.replace(/[^0-9+]/g, "");
  if (!clean) return "";
  const digitsOnly = clean.replace("+", "");
  if (digitsOnly.length === 8) return "+228" + digitsOnly;
  if (digitsOnly.length === 11 && digitsOnly.startsWith("228")) return "+" + digitsOnly;
  if (!clean.startsWith("+")) return "+228" + clean;
  return clean;
}

/** Formate pour affichage: +228 XX XX XX XX */
export function formatTogoPhone(input: string): string {
  if (!input) return "";
  const clean = input.replace(/[^0-9]/g, "");
  if (clean.length === 8) {
    return `+228 ${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)}`;
  }
  if (clean.length === 11 && clean.startsWith("228")) {
    const m = clean.slice(3);
    return `+228 ${m.slice(0, 2)} ${m.slice(2, 4)} ${m.slice(4, 6)} ${m.slice(6, 8)}`;
  }
  return input;
}

/** Formate un prix en FCFA. */
export function formatPrice(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} F CFA`;
}

/** Date ISO -> lundi de cette semaine (UTC). */
export function getMondayUTC(date: Date = new Date()): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0 = Sunday
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
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
  return null;
}

/** Valide un numéro de téléphone togolais (8 chiffres). */
export function validateTogoPhone(input: string): boolean {
  const normalized = normalizeTogoPhone(input);
  return /^\+228\d{8}$/.test(normalized);
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

/** Taille maximale des photos en bytes (2 Mo). */
export const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

/** Types MIME autorisés pour les photos. */
export const ALLOWED_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

/** Extensions autorisées. */
export const ALLOWED_PHOTO_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

/** Vérifie si un type MIME est autorisé. */
export function isAllowedPhotoType(mimeType: string): boolean {
  return ALLOWED_PHOTO_MIME_TYPES.includes(mimeType.toLowerCase());
}
