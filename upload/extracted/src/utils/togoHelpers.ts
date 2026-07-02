/**
 * Togo +228 Phone Number and Multi-currency Helpers
 * Pegged Exchange Rates:
 * - 1 EUR = 655.957 FCFA (West African CFA Franc - pegged rate)
 * - 1 USD = 600 FCFA (approximate market rate)
 */

export const EXCHANGE_RATES: Record<string, number> = {
  XOF: 1,         // Base currency stored in Supabase (FCFA)
  EUR: 1 / 655.957, // 1 FCFA = 1/655.957 EUR
  USD: 1 / 600,     // 1 FCFA = 1/600 USD
};

export const REVERSE_RATES: Record<string, number> = {
  XOF: 1,
  EUR: 655.957,
  USD: 600,
};

export type SupportedCurrency = 'XOF' | 'EUR' | 'USD';

/**
 * Formats a Togo phone number cleanly as "+228 XX XX XX XX".
 */
export function formatTogoPhone(phoneStr: string): string {
  if (!phoneStr) return '';
  const clean = phoneStr.replace(/[^0-9]/g, '');
  
  if (clean.length === 8) {
    return `+228 ${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)}`;
  }
  if (clean.length === 11 && clean.startsWith('228')) {
    const main = clean.slice(3);
    return `+228 ${main.slice(0, 2)} ${main.slice(2, 4)} ${main.slice(4, 6)} ${main.slice(6, 8)}`;
  }
  if (phoneStr.startsWith('+228')) {
    const rawDigits = phoneStr.replace(/[^0-9]/g, '');
    if (rawDigits.length === 11) {
      const main = rawDigits.slice(3);
      return `+228 ${main.slice(0, 2)} ${main.slice(2, 4)} ${main.slice(4, 6)} ${main.slice(6, 8)}`;
    }
  }
  return phoneStr;
}

/**
 * Normalizes a Togo input to a clean international string like "+22890123456" for database/identifiant creation
 */
export function normalizeTogoPhone(phoneStr: string): string {
  let clean = phoneStr.replace(/[^0-9+]/g, '');
  if (!clean) return '';
  
  // Strip starting "+" to evaluate
  const digitsOnly = clean.replace('+', '');
  
  // Togo 8-digit local format: append +228
  if (digitsOnly.length === 8) {
    return '+228' + digitsOnly;
  }
  // Typed digits starting with 228
  if (digitsOnly.length === 11 && digitsOnly.startsWith('228')) {
    return '+' + digitsOnly;
  }
  // Generic fallback if not fitting local Togo pattern nicely
  if (!clean.startsWith('+')) {
    return '+228' + clean;
  }
  
  return clean;
}

/**
 * Normalizes a Togo phone number specifically to generate a clean, unformatted numeric link string for WhatsApp wa.me link.
 */
export function getWhatsAppNumber(phoneStr: string): string {
  const clean = phoneStr.replace(/[^0-9]/g, '');
  if (clean.length === 8) {
    return '228' + clean;
  }
  return clean;
}

/**
 * Converts a price from one currency to another.
 * @param amount Price amount
 * @param from Source currency
 * @param to Target currency
 */
export function convertPrice(amount: number, from: SupportedCurrency, to: SupportedCurrency): number {
  if (from === to) return amount;
  // Convert from source to base (XOF), then to target
  const priceInXOF = amount * REVERSE_RATES[from];
  return priceInXOF * EXCHANGE_RATES[to];
}

/**
 * Formats a price nicely according to its currency representation.
 */
export function formatPrice(amount: number, currency: SupportedCurrency): string {
  if (currency === 'XOF') {
    // CFA Franc is typically integer
    return `${Math.round(amount).toLocaleString('fr-FR')} F CFA`;
  }
  if (currency === 'EUR') {
    return `${amount.toFixed(2)} €`;
  }
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(2)} ${currency}`;
}

/**
 * Checks if a message or error object indicates a network fetch failure.
 */
export function isNetworkError(err: any): boolean {
  if (!err) return false;
  const msg = typeof err === 'string' ? err : (err.message || '');
  return msg.toLowerCase().includes('failed to fetch') || 
         msg.toLowerCase().includes('networkerror') ||
         msg.toLowerCase().includes('load failed') ||
         msg.toLowerCase().includes('network error');
}

/**
 * Returns a friendly explanation for a connection fetch error.
 */
export function getFetchErrorExplanation(err: any): string {
  if (isNetworkError(err)) {
    return "Erreur de connexion (Failed to fetch). Cela est généralement causé par un bloqueur de publicités/scripts (comme Brave Shield ou uBlock Origin qui bloque Supabase), un pare-feu réseau, ou une perte temporaire de connexion internet. Veuillez s'il vous plaît désactiver vos bloqueurs de publicité sur ce site ou actualiser la page.";
  }
  
  const msg = typeof err === 'string' ? err : (err.message || '');
  const lowerMsg = msg.toLowerCase();

  if (lowerMsg.includes('rate limit exceeded') || lowerMsg.includes('rate_limit')) {
    return "Limite de sécurité dépassée (Rate limit). Pour éviter les abus, Supabase limite la fréquence des demandes d'inscription et de connexion. S'il vous plaît, patientez 1 à 2 minutes avant de réessayer.";
  }
  if (lowerMsg.includes('invalid login credentials') || lowerMsg.includes('invalid_credentials')) {
    return "Numéro de téléphone ou mot de passe incorrect. S'il s'agit d'une officine, vérifiez que vous avez bien sélectionné la bonne pharmacie dans la liste de connexion.";
  }
  if (lowerMsg.includes('user already exists') || lowerMsg.includes('user_already_exists')) {
    return "Un compte est déjà enregistré avec ce numéro de téléphone.";
  }
  if (lowerMsg.includes('weak_password') || lowerMsg.includes('should be at least')) {
    return "Le mot de passe est trop faible. Veuillez choisir un mot de passe d'au moins 6 caractères.";
  }

  return msg || 'Une erreur inattendue est survenue.';
}

