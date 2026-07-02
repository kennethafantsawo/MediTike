/**
 * Togo +228 Phone Number and Multi-currency Helpers
 * Adapted from the original pharma-connect project for Next.js.
 */

export const EXCHANGE_RATES: Record<string, number> = {
  XOF: 1,
  EUR: 1 / 655.957,
  USD: 1 / 600,
};

export const REVERSE_RATES: Record<string, number> = {
  XOF: 1,
  EUR: 655.957,
  USD: 600,
};

export type SupportedCurrency = "XOF" | "EUR" | "USD";

/** Formats a Togo phone number cleanly as "+228 XX XX XX XX". */
export function formatTogoPhone(phoneStr: string): string {
  if (!phoneStr) return "";
  const clean = phoneStr.replace(/[^0-9]/g, "");
  if (clean.length === 8) {
    return `+228 ${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)}`;
  }
  if (clean.length === 11 && clean.startsWith("228")) {
    const main = clean.slice(3);
    return `+228 ${main.slice(0, 2)} ${main.slice(2, 4)} ${main.slice(4, 6)} ${main.slice(6, 8)}`;
  }
  return phoneStr;
}

/** Normalizes a Togo input to a clean international string like "+22890123456". */
export function normalizeTogoPhone(phoneStr: string): string {
  let clean = phoneStr.replace(/[^0-9+]/g, "");
  if (!clean) return "";
  const digitsOnly = clean.replace("+", "");
  if (digitsOnly.length === 8) return "+228" + digitsOnly;
  if (digitsOnly.length === 11 && digitsOnly.startsWith("228")) return "+" + digitsOnly;
  if (!clean.startsWith("+")) return "+228" + clean;
  return clean;
}

/** Returns the WhatsApp wa.me link number portion (digits only). */
export function getWhatsAppNumber(phoneStr: string): string {
  const clean = phoneStr.replace(/[^0-9]/g, "");
  if (clean.length === 8) return "228" + clean;
  return clean;
}

/** Builds a WhatsApp deep link for a pharmacy. */
export function buildWhatsAppLink(phone: string, productName?: string): string {
  const num = getWhatsAppNumber(phone);
  if (!num) return "#";
  const text = productName
    ? `?text=${encodeURIComponent(`Bonjour, je vous contacte via MediTike concernant : ${productName}`)}`
    : "";
  return `https://wa.me/${num}${text}`;
}

/** Converts a price between currencies. */
export function convertPrice(amount: number, from: SupportedCurrency, to: SupportedCurrency): number {
  if (from === to) return amount;
  const priceInXOF = amount * REVERSE_RATES[from];
  return priceInXOF * EXCHANGE_RATES[to];
}

/** Formats a price nicely according to its currency. */
export function formatPrice(amount: number, currency: SupportedCurrency = "XOF"): string {
  if (currency === "XOF") return `${Math.round(amount).toLocaleString("fr-FR")} F CFA`;
  if (currency === "EUR") return `${amount.toFixed(2)} €`;
  if (currency === "USD") return `$${amount.toFixed(2)}`;
  return `${amount.toFixed(2)} ${currency}`;
}

/** Normalizes a search string (lowercase, no accents). */
export function normalizeSearch(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Returns a Togo city/area name cleanly. */
export function formatTogoCity(city: string, district?: string): string {
  return district ? `${district}, ${city}` : city;
}

/** Formats a date in French style. */
export function formatDateFr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

/** Formats a time in French style. */
export function formatTimeFr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/** Returns a relative "il y a X min" string. */
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
  return formatDateFr(d);
}
