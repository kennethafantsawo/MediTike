"use client";
/**
 * Helpers côté client : géolocalisation, statut d'ouverture, redirection maps native.
 */

/** Demande la position GPS de l'utilisateur. */
export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Géolocalisation non supportée sur cet appareil"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message || "Impossible d'obtenir votre position")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

/** Calcule la distance entre 2 points (Haversine) en km. */
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // arrondi à 0.1 km
}

/** Formate une distance pour affichage. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km} km`;
}

/**
 * Détermine le statut d'ouverture d'une pharmacie.
 *
 * Règles MediTike:
 * - Toutes les pharmacies sont ouvertes de 7h à 20h
 * - Après 20h ou avant 7h : OUVERT seulement si la pharmacie est de garde
 *   pour la semaine courante
 *
 * @param isOnDutyThisWeek true si la pharmacie est dans la liste de garde de la semaine active
 * @param date heure actuelle (défaut: now)
 * @returns { isOpen: boolean, isOnDuty: boolean, label: string, color: "green" | "orange" | "red" }
 */
export function getPharmacyStatus(
  isOnDutyThisWeek: boolean,
  date: Date = new Date()
): { isOpen: boolean; isOnDuty: boolean; label: string; color: "green" | "orange" | "red" } {
  const hour = date.getHours();
  // Heures d'ouverture normales: 7h à 20h
  const isNormalHours = hour >= 7 && hour < 20;

  if (isNormalHours) {
    return {
      isOpen: true,
      isOnDuty: isOnDutyThisWeek,
      label: isOnDutyThisWeek ? "Ouvert · De garde" : "Ouvert",
      color: "green",
    };
  }

  // Hors heures normales (avant 7h ou après 20h)
  if (isOnDutyThisWeek) {
    return {
      isOpen: true,
      isOnDuty: true,
      label: "Ouvert · De garde (nuit)",
      color: "orange",
    };
  }

  return {
    isOpen: false,
    isOnDuty: false,
    label: "Fermé",
    color: "red",
  };
}

/**
 * Détecte le type d'appareil pour rediriger vers la bonne app maps native.
 */
export function getDeviceType(): "android" | "ios" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("android")) return "android";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return "ios";
  return "other";
}

/**
 * Génère l'URL maps native selon l'appareil.
 * - Android : Google Maps app (geo:)
 * - iOS : Apple Maps (maps://)
 * - Autre : Google Maps web
 */
export function getMapsUrl(query: string, lat?: number, lng?: number): string {
  const device = getDeviceType();
  const encodedQuery = encodeURIComponent(query);

  if (device === "android") {
    // Google Maps app sur Android
    if (lat && lng) {
      return `geo:${lat},${lng}?q=${encodedQuery}`;
    }
    return `geo:0,0?q=${encodedQuery}`;
  }

  if (device === "ios") {
    // Apple Maps sur iOS
    if (lat && lng) {
      return `maps://?ll=${lat},${lng}&q=${encodedQuery}`;
    }
    return `maps://?q=${encodedQuery}`;
  }

  // Fallback: Google Maps web
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}

/** Stockage local des favoris (pharmacies préférées). */
const FAVORITES_KEY = "meditike_favorites";

/** Récupère la liste des IDs de pharmacies favorites. */
export function getFavorites(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Ajoute/retire une pharmacie des favoris. */
export function toggleFavorite(pharmacyName: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(pharmacyName);
  if (index >= 0) {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false; // retiré
  } else {
    favorites.push(pharmacyName);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true; // ajouté
  }
}

/** Vérifie si une pharmacie est favorite. */
export function isFavorite(pharmacyName: string): boolean {
  return getFavorites().includes(pharmacyName);
}
