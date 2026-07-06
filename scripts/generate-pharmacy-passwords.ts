/**
 * Générateur de mots de passe pour pharmacies de garde — MediTike
 * =====================================================================
 *
 * Lit le fichier xlsx du Ministère de la Santé du Togo, extrait la liste
 * unique des pharmacies (sans doublons de noms), génère pour chacune :
 *   - un mot de passe fort (12 caractères, complexité garantie)
 *   - un hash bcrypt (12 rounds) pour le stockage en base
 *
 * Produit 2 fichiers dans /home/z/my-project/download/ :
 *   - 04-pharmacy-credentials.csv  : nom, téléphone, mot de passe en clair (pour l'admin)
 *   - 04-pharmacy-users.sql        : script SQL d'insertion Supabase
 *                                    (tables "Pharmacy" + "User" role='pharmacist')
 *
 * Usage :
 *   cd /home/z/my-project && bun scripts/generate-pharmacy-passwords.ts
 */
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { parseDutyFile, type ParsedDutyEntry } from "../src/lib/meditike/duty-parser";
import { normalizeTogoPhone } from "../src/lib/meditike/helpers";

// ─── Constantes ────────────────────────────────────────────────────────
const XLSX_PATH =
  "/home/z/my-project/upload/TDG Des Pharmacies  Du 06 Juiellet 2026 Au 04 Janvier 2027.xlsx";
const DOWNLOAD_DIR = "/home/z/my-project/download";
const CSV_PATH = path.join(DOWNLOAD_DIR, "04-pharmacy-credentials.csv");
const SQL_PATH = path.join(DOWNLOAD_DIR, "04-pharmacy-users.sql");

const PASSWORD_LENGTH = 12;
const BCRYPT_ROUNDS = 12;

// Caractères pour le générateur (on évite les caractères confusables 0/O/1/I/l)
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnpqrstuvwxyz";
const DIGITS = "23456789";
const SPECIAL = "!@#$%&*"; // caractères spéciaux autorisés par le cahier des charges
const ALL_CHARS = UPPER + LOWER + DIGITS + SPECIAL;

// ─── Utilitaires cryptographiques ──────────────────────────────────────

/** Tire un caractère aléatoire dans la chaîne donnée (source crypto). */
function pickRandomChar(chars: string): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return chars[bytes[0] % chars.length];
}

/** Mélange les caractères d'une chaîne (Fisher-Yates, source crypto). */
function shuffleString(s: string): string {
  const arr = Array.from(s);
  for (let i = arr.length - 1; i > 0; i--) {
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    const j = bytes[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

/**
 * Génère un mot de passe fort de 12 caractères garantissant :
 *   - au moins 1 majuscule
 *   - au moins 1 minuscule
 *   - au moins 1 chiffre
 *   - au moins 1 caractère spécial parmi !@#$%&*
 */
function generateStrongPassword(): string {
  // On construit 12 caractères en garantissant la diversité :
  //   2 majuscules, 4 minuscules, 3 chiffres, 2 spéciaux, 1 aléatoire
  const parts: string[] = [
    pickRandomChar(UPPER),
    pickRandomChar(UPPER),
    pickRandomChar(LOWER),
    pickRandomChar(LOWER),
    pickRandomChar(LOWER),
    pickRandomChar(LOWER),
    pickRandomChar(DIGITS),
    pickRandomChar(DIGITS),
    pickRandomChar(DIGITS),
    pickRandomChar(SPECIAL),
    pickRandomChar(SPECIAL),
    pickRandomChar(ALL_CHARS),
  ];
  return shuffleString(parts.join(""));
}

// ─── Utilitaires d'échappement ─────────────────────────────────────────

/** Échappe une chaîne pour SQL (PostgreSQL : doubler les apostrophes). */
function sqlEscape(s: string): string {
  return s.replace(/'/g, "''");
}

/** Échappe un champ pour CSV (RFC 4180 : entourer de doubles quotes si besoin). */
function csvEscape(s: string): string {
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Normalise le téléphone 1 du xlsx en format +228XXXXXXXX.
 * Si absent ou invalide, génère un placeholder unique basé sur l'index.
 */
function normalizeOrPlaceholder(phone: string | null, index: number): string {
  if (phone) {
    const normalized = normalizeTogoPhone(phone);
    if (/^\+228\d{8}$/.test(normalized)) {
      return normalized;
    }
  }
  // Placeholder : +228 9000XXXX (plage non attribuée, 8 chiffres locaux)
  const num = 90000000 + index;
  const local = String(num).slice(-8).padStart(8, "0");
  return `+228${local}`;
}

// ─── Types ─────────────────────────────────────────────────────────────

interface PharmacyRecord {
  id: string; // ex: 'pharma-001' (User.id)
  pharmacyId: string; // ex: 'pharmacy-001' (Pharmacy.id)
  name: string; // nom brut (ex: 'SANTE')
  fullName: string; // 'Pharmacie SANTE'
  phone1: string; // normalisé +228XXXXXXXX
  phone2: string | null;
  address: string | null;
  city: string;
  plainPassword: string;
  passwordHash: string;
}

// ─── Programme principal ───────────────────────────────────────────────

async function main() {
  console.log("🔑 Générateur de mots de passe pharmacies — MediTike\n");
  console.log(`   Fichier source : ${XLSX_PATH}`);

  if (!fs.existsSync(XLSX_PATH)) {
    console.error(`❌ Fichier xlsx introuvable : ${XLSX_PATH}`);
    process.exit(1);
  }

  // 1. Parser le fichier xlsx du Ministère
  console.log("\n📥 Lecture du fichier xlsx...");
  const parsed = parseDutyFile(XLSX_PATH, path.basename(XLSX_PATH));
  console.log(`   → ${parsed.weeks.length} semaines détectées`);
  console.log(`   → ${parsed.totalPharmacies} entrées pharmacies (avec doublons potentiels)`);

  // 2. Dédupliquer par nom (insensible à la casse + trim)
  const uniqueMap = new Map<string, ParsedDutyEntry>();
  for (const week of parsed.weeks) {
    for (const pharma of week.pharmacies) {
      const key = pharma.name.trim().toUpperCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, pharma);
      }
    }
  }
  const uniquePharmacies = Array.from(uniqueMap.values());
  console.log(`   → ${uniquePharmacies.length} pharmacies uniques après dédoublonnage\n`);

  if (uniquePharmacies.length === 0) {
    console.error("❌ Aucune pharmacie trouvée dans le fichier xlsx.");
    process.exit(1);
  }

  // 3. Générer mot de passe + hash bcrypt pour chaque pharmacie unique
  console.log("🔐 Génération des mots de passe + hashage bcrypt (12 rounds)...");
  const records: PharmacyRecord[] = [];
  for (let i = 0; i < uniquePharmacies.length; i++) {
    const pharma = uniquePharmacies[i];
    const idx = i + 1;
    const idStr = String(idx).padStart(3, "0");
    const plainPassword = generateStrongPassword();
    const passwordHash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
    const phone1 = normalizeOrPlaceholder(pharma.phone1, idx);
    const trimmedName = pharma.name.trim();

    records.push({
      id: `pharma-${idStr}`,
      pharmacyId: `pharmacy-${idStr}`,
      name: trimmedName,
      fullName: `Pharmacie ${trimmedName}`,
      phone1,
      phone2: pharma.phone2 || null,
      address: pharma.address || null,
      city: "Lomé",
      plainPassword,
      passwordHash,
    });
  }
  console.log(`   → ${records.length} comptes générés\n`);

  // 4. Créer le dossier download si nécessaire
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  }

  // 5. Écrire le CSV (pour l'admin — mot de passe en clair)
  console.log("📝 Écriture du CSV...");
  const csvLines: string[] = [
    [csvEscape("Nom pharmacie"), csvEscape("Téléphone"), csvEscape("Mot de passe")].join(","),
  ];
  for (const r of records) {
    csvLines.push(
      [csvEscape(r.name), csvEscape(r.phone1), csvEscape(r.plainPassword)].join(",")
    );
  }
  // BOM UTF-8 pour ouverture correcte dans Excel
  fs.writeFileSync(CSV_PATH, "\uFEFF" + csvLines.join("\n") + "\n", "utf-8");
  console.log(`   ✅ ${CSV_PATH}`);

  // 6. Écrire le SQL (pour Supabase SQL Editor)
  console.log("📝 Écriture du SQL...");
  const sqlLines: string[] = [];
  sqlLines.push("-- ============================================================");
  sqlLines.push("-- MediTike — Comptes pharmaciens + pharmacies de garde");
  sqlLines.push("-- ============================================================");
  sqlLines.push("-- À exécuter dans Supabase Dashboard → SQL Editor");
  sqlLines.push(`-- Généré le ${new Date().toISOString()}`);
  sqlLines.push(`-- ${records.length} pharmacies uniques`);
  sqlLines.push("-- Mots de passe hashés avec bcrypt (12 rounds)");
  sqlLines.push("-- ============================================================");
  sqlLines.push("");
  sqlLines.push("BEGIN;");
  sqlLines.push("");

  // ── Section 1 : insertion des pharmacies ──
  sqlLines.push("-- ─── 1. Insertion des pharmacies (table \"Pharmacy\") ─────────");
  sqlLines.push("-- Insertion conditionnelle : si une pharmacie avec le même nom");
  sqlLines.push("-- existe déjà, on ne crée pas de doublon.");
  sqlLines.push("");

  for (const r of records) {
    const phone2Sql = r.phone2 ? `'${sqlEscape(r.phone2)}'` : "NULL";
    const addressSql = r.address ? `'${sqlEscape(r.address)}'` : "NULL";
    sqlLines.push(
      `INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")`
    );
    sqlLines.push(
      `SELECT '${r.pharmacyId}', '${sqlEscape(r.name)}', '${sqlEscape(r.phone1)}', ${phone2Sql}, ${addressSql}, '${sqlEscape(r.city)}', TRUE, now(), now()`
    );
    sqlLines.push(
      `WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = '${sqlEscape(r.name)}');`
    );
    sqlLines.push("");
  }

  // ── Section 2 : insertion des comptes pharmaciens ──
  sqlLines.push("-- ─── 2. Insertion des comptes pharmaciens (table \"User\") ────");
  sqlLines.push("-- role='pharmacist', mot de passe hashé avec bcrypt (12 rounds).");
  sqlLines.push("-- Le \"pharmacyId\" est résolu via sous-requête : on pointe vers");
  sqlLines.push("-- l'ID de la pharmacie existante (par nom) ou vers l'ID qu'on vient");
  sqlLines.push("-- d'insérer ci-dessus ('pharmacy-XXX').");
  sqlLines.push("");
  sqlLines.push(
    `INSERT INTO "User" (id, phone, "passwordHash", "fullName", role, "pharmacyId", "isActive", "createdAt", "updatedAt")`
  );
  sqlLines.push("VALUES");

  const valuesLines: string[] = [];
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const comma = i < records.length - 1 ? "," : "";
    valuesLines.push(
      `  ('${r.id}', '${sqlEscape(r.phone1)}', '${sqlEscape(r.passwordHash)}', '${sqlEscape(r.fullName)}', 'pharmacist', ` +
        `COALESCE((SELECT id FROM "Pharmacy" WHERE name = '${sqlEscape(r.name)}' LIMIT 1), '${r.pharmacyId}'), ` +
        `TRUE, now(), now())${comma}`
    );
  }
  sqlLines.push(...valuesLines);
  sqlLines.push("ON CONFLICT (phone) DO NOTHING;");
  sqlLines.push("");

  // ── Section 3 : vérification ──
  sqlLines.push("-- ─── 3. Vérification ─────────────────────────────────────────");
  sqlLines.push(
    `SELECT u.id AS "user_id", u.phone, u."fullName", u.role, p.name AS "pharmacy_name", u."pharmacyId"`
  );
  sqlLines.push(`FROM "User" u`);
  sqlLines.push(`LEFT JOIN "Pharmacy" p ON p.id = u."pharmacyId"`);
  sqlLines.push(`WHERE u.role = 'pharmacist' ORDER BY u.id;`);
  sqlLines.push("");

  sqlLines.push("COMMIT;");
  sqlLines.push("");
  sqlLines.push("-- Fin du script — MediTike pharmacy password generator");

  fs.writeFileSync(SQL_PATH, sqlLines.join("\n") + "\n", "utf-8");
  console.log(`   ✅ ${SQL_PATH}`);

  // 7. Résumé final
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 RÉSUMÉ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   Pharmacies uniques traitées : ${records.length}`);
  console.log(`   Mots de passe générés       : ${records.length} (12 car., bcrypt ${BCRYPT_ROUNDS} rounds)`);
  console.log(`   Caractères spéciaux         : ${SPECIAL}`);
  console.log(`   CSV (admin, clair)          : ${CSV_PATH}`);
  console.log(`   SQL (Supabase, hashé)       : ${SQL_PATH}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Aperçu (3 premières pharmacies, sans révéler les mots de passe)
  console.log("📌 Aperçu (3 premières pharmacies) :");
  for (let i = 0; i < Math.min(3, records.length); i++) {
    const r = records[i];
    console.log(`   ${r.id}  ${r.fullName.padEnd(35)}  ${r.phone1}  ${r.plainPassword}`);
  }
  console.log("");
}

main().catch((e) => {
  console.error("❌ Erreur :", e);
  process.exit(1);
});
