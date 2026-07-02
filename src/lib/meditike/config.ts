/**
 * Configuration MediTike — secrets et constantes sensibles.
 */
import path from "path";

// URL admin secrète — DOIT être passée en variable d'env en production.
// En dev: génère un token stable stocké dans .env si absent.
function getAdminPath(): string {
  const env = process.env.MEDITIKE_ADMIN_PATH;
  if (env && env.length >= 12) return env;
  // Default dev path — DO NOT use in production
  return "admin-secret-dev-2024";
}

export const ADMIN_PATH = getAdminPath();
export const UPLOADS_DIR = path.join(process.cwd(), "uploads");
export const MAX_UPLOAD_SIZE = 2 * 1024 * 1024; // 2 Mo

// Admin par défaut (créé au premier démarrage si absent)
export const DEFAULT_ADMIN = {
  phone: process.env.MEDITIKE_ADMIN_PHONE || "+22890000001",
  password: process.env.MEDITIKE_ADMIN_PASSWORD || "AdminMediTike2024!",
  fullName: "Administrateur MediTike",
};
