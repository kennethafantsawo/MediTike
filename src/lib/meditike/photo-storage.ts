/**
 * Abstraction de stockage des photos.
 *
 * - En production (Supabase configuré) : utilise Supabase Storage
 * - En dev (sans Supabase) : utilise le système de fichiers local
 *
 * L'abstraction permet de switcher sans modifier la logique métier.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import { UPLOADS_DIR } from "./config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_PHOTOS_BUCKET || "meditike-photos";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  if (!_supabase) {
    _supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });
  }
  return _supabase;
}

export function isUsingSupabase(): boolean {
  return !!getSupabase();
}

export interface StoredPhoto {
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Sauvegarde une photo (buffer) dans le stockage configuré.
 * - En prod : Supabase Storage (bucket privé)
 * - En dev : /uploads/ local
 */
export async function storePhoto(
  filename: string,
  buffer: Buffer,
  mimeType: string
): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(filename, buffer, {
        contentType: mimeType,
        upsert: false, // ne pas écraser (filename est un hash unique)
      });
    if (error) {
      throw new Error(`Supabase Storage error: ${error.message}`);
    }
  } else {
    // Dev : local filesystem
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.writeFile(filePath, buffer);
  }
}

/**
 * Récupère une photo (buffer + content-type) depuis le stockage.
 */
export async function getPhoto(
  filename: string
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .download(filename);
    if (error || !data) return null;
    const buffer = Buffer.from(await data.arrayBuffer());
    // Supabase renvoie le content-type via les métadonnées, sinon on devine par extension
    const ext = path.extname(filename).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".heic": "image/heic",
      ".heif": "image/heif",
    };
    return { buffer, mimeType: mimeMap[ext] || "image/jpeg" };
  } else {
    // Dev : local filesystem
    const filePath = path.join(UPLOADS_DIR, filename);
    try {
      const buffer = await fs.readFile(filePath);
      const ext = path.extname(filename).toLowerCase();
      const mimeMap: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".heic": "image/heic",
        ".heif": "image/heif",
      };
      return { buffer, mimeType: mimeMap[ext] || "image/jpeg" };
    } catch {
      return null;
    }
  }
}

/**
 * Supprime physiquement une photo du stockage.
 * Appelé par le cron de nettoyage.
 */
export async function deletePhoto(filename: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.storage.from(SUPABASE_BUCKET).remove([filename]);
  } else {
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.unlink(filePath).catch(() => {});
  }
}
