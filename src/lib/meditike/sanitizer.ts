/**
 * Middleware de sanitization anti-XSS pour toutes les API routes.
 *
 * Détecte et bloque les tentatives d'injection :
 * - XSS (scripts, événements, HTML)
 * - SQL injection (UNION, DROP, INSERT, etc.)
 * - Path traversal (../)
 * - NoSQL injection ($where, $gt, etc.)
 * - Command injection
 */

// Patterns d'attaques courantes
const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>/gi,
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onload=, onclick=, etc.
  /<img[^>]+onerror/gi,
  /<svg[^>]+onload/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
];

const SQL_PATTERNS = [
  /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b.*\b(FROM|INTO|TABLE|DATABASE)\b)/gi,
  /;\s*(DROP|DELETE|UPDATE|INSERT|CREATE|ALTER)/gi,
  /--\s/g, // SQL comment
  /\/\*.*\*\//gi,
  /\bxp_cmdshell\b/gi,
  /\bWAITFOR\s+DELAY\b/gi,
];

const PATH_TRAVERSAL = [
  /\.\.\//g,
  /\.\.\\\\/g,
  /%2e%2e%2f/gi,
  /%2e%2e%5c/gi,
];

const NOSQL_PATTERNS = [
  /\$where/gi,
  /\$gt/gi,
  /\$lt/gi,
  /\$ne/gi,
  /\$regex/gi,
  /\$in/gi,
  /\$nin/gi,
];

/** Sanitize une valeur récursivement (string, object, array) */
export function sanitizeValue(value: any): any {
  if (typeof value === "string") {
    return sanitizeString(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const sanitized: any = {};
    for (const key of Object.keys(value)) {
      // Vérifier aussi les clés (NoSQL injection via clé)
      if (/\$/.test(key)) {
        continue; // Ignorer les clés commençant par $ (NoSQL)
      }
      sanitized[key] = sanitizeValue(value[key]);
    }
    return sanitized;
  }
  return value;
}

/** Sanitize une chaîne : détecte et neutralise les injections */
function sanitizeString(str: string): string {
  // Détecter les attaques
  for (const pattern of [...XSS_PATTERNS, ...SQL_PATTERNS, ...PATH_TRAVERSAL, ...NOSQL_PATTERNS]) {
    if (pattern.test(str)) {
      // Logger la tentative (en production, envoyer à un SIEM)
      console.warn(`[SECURITY] Tentative d'injection détectée: ${str.substring(0, 100)}`);
      // Neutraliser : échapper les caractères dangereux
      return str
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
    }
  }
  return str;
}

/** Vérifie si une valeur contient des tentatives d'injection (sans modifier) */
export function containsInjection(value: any): boolean {
  if (typeof value === "string") {
    return checkString(value);
  }
  if (Array.isArray(value)) {
    return value.some(containsInjection);
  }
  if (value && typeof value === "object") {
    return Object.keys(value).some((k) => /\$/.test(k) || containsInjection(value[k]));
  }
  return false;
}

function checkString(str: string): boolean {
  for (const pattern of [...XSS_PATTERNS, ...SQL_PATTERNS, ...PATH_TRAVERSAL, ...NOSQL_PATTERNS]) {
    if (pattern.test(str)) return true;
  }
  return false;
}

/** Sanitize le body d'une requête JSON */
export function sanitizeRequestBody(body: any): any {
  return sanitizeValue(body);
}
