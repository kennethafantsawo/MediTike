/**
 * MediTike — Générateur de comptes pharmaciens depuis le xlsx du Ministère
 *
 * Ce script :
 * 1. Lit le fichier xlsx officiel du Ministère de la Santé du Togo
 * 2. Extrait la liste UNIQUE des pharmacies (sans doublons)
 * 3. Pour chaque pharmacie :
 *    - Crée un compte pharmacien (téléphone = login, mot de passe généré)
 *    - Hash le mot de passe avec bcrypt
 * 4. Génère :
 *    - Un fichier xlsx (nom, téléphone, mot de passe — pour l'admin)
 *    - Un script SQL pour Supabase (insère pharmacies + users + liaisons)
 *
 * Le pharmacien pourra se connecter et compléter ses informations (adresse, WhatsApp, etc.)
 *
 * Usage: bun scripts/generate-pharmacy-accounts.ts
 */
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const XLSX_INPUT = "/home/z/my-project/upload/TDG Des Pharmacies  Du 06 Juiellet 2026 Au 04 Janvier 2027.xlsx";

interface PharmacyEntry {
  name: string;
  address: string | null;
  phone1: string | null;
  phone2: string | null;
}

interface PharmacyAccount {
  pharmacyId: string;
  userId: string;
  name: string;
  fullName: string;
  phone: string;
  phone1: string;
  phone2: string | null;
  address: string | null;
  password: string;
  passwordHash: string;
}

/** Génère un mot de passe fort : 12 caractères, maj+min+chiffre+spécial */
function generateStrongPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = upper + lower + digits + special;

  // Garantir au moins 1 de chaque type
  let pwd =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    digits[Math.floor(Math.random() * digits.length)] +
    special[Math.floor(Math.random() * special.length)];

  // Compléter à 12 caractères
  for (let i = 4; i < 12; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  // Mélanger
  return pwd
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

/** Normalise un téléphone togolais */
function normalizePhone(phone: string | null): string {
  if (!phone) return "";
  const clean = phone.replace(/[^0-9]/g, "");
  if (clean.length === 8) return `+228${clean}`;
  if (clean.length === 11 && clean.startsWith("228")) return `+${clean}`;
  return `+228${clean}`;
}

function main() {
  console.log("🏥 MediTike — Générateur de comptes pharmaciens\n");

  // 1. Lire le xlsx
  if (!fs.existsSync(XLSX_INPUT)) {
    console.error(`❌ Fichier introuvable: ${XLSX_INPUT}`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(XLSX_INPUT);
  const wb = XLSX.read(buffer, { type: "buffer" });

  // Prend la première feuille avec données
  let sheet: XLSX.WorkSheet | null = null;
  for (const name of wb.SheetNames) {
    const s = wb.Sheets[name];
    if (s && s["!ref"]) {
      const range = XLSX.utils.decode_range(s["!ref"]);
      if (range.e.r + 1 > 10) {
        sheet = s;
        break;
      }
    }
  }
  if (!sheet) {
    console.error("❌ Aucune feuille valide trouvée");
    process.exit(1);
  }

  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  console.log(`📄 Fichier lu: ${rows.length} lignes`);

  // 2. Extraire les pharmacies uniques
  const pharmacyMap = new Map<string, PharmacyEntry>();

  for (const row of rows) {
    const name = row[0] ? String(row[0]).trim() : null;
    const address = row[1] ? String(row[1]).trim() : null;
    const phone1 = row[2] ? String(row[2]).trim() : null;
    const phone2 = row[3] ? String(row[3]).trim() : null;

    if (!name) continue;
    if (name.toUpperCase() === "PHARMACIES") continue;
    if (name.startsWith("SECRETARIAT") || name.startsWith("DIRECTION") || name.startsWith("No ")) continue;
    if (name.startsWith("---")) continue;
    if (name.includes("MINISTERE") || name.includes("REPUBLIQUE")) continue;
    // Doit avoir au moins un téléphone ou une adresse
    if (!phone1 && !phone2 && !address) continue;

    // Normaliser le nom (majuscules, sans "PHARMACIE" préfixé)
    const normalizedName = name.toUpperCase().replace(/^PHARMACIE\s+/i, "").trim();

    if (!pharmacyMap.has(normalizedName)) {
      pharmacyMap.set(normalizedName, {
        name: normalizedName,
        address,
        phone1,
        phone2,
      });
    }
  }

  console.log(`🏪 ${pharmacyMap.size} pharmacies uniques trouvées\n`);

  // 3. Générer les comptes
  const accounts: PharmacyAccount[] = [];
  let counter = 0;

  for (const [name, entry] of pharmacyMap) {
    counter++;
    const pharmacyId = `pharma-${String(counter).padStart(3, "0")}`;
    const userId = `pharma-user-${String(counter).padStart(3, "0")}`;
    const phone = normalizePhone(entry.phone1);

    // Si pas de téléphone valide, générer un placeholder
    const finalPhone = phone || `+2289000${String(counter).padStart(4, "0")}`;

    const password = generateStrongPassword();
    const passwordHash = bcrypt.hashSync(password, 12);

    accounts.push({
      pharmacyId,
      userId,
      name: entry.name,
      fullName: `Pharmacie ${entry.name}`,
      phone: finalPhone,
      phone1: entry.phone1 || finalPhone,
      phone2: entry.phone2 || null,
      address: entry.address,
      password,
      passwordHash,
    });
  }

  // 4. Générer le fichier xlsx
  const xlsxData = [
    ["ID", "Nom Pharmacie", "Téléphone (login)", "Mot de passe", "Téléphone 1", "Téléphone 2", "Adresse"],
    ...accounts.map((a) => [
      a.pharmacyId,
      a.fullName,
      a.phone,
      a.password,
      a.phone1,
      a.phone2 || "",
      a.address || "",
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(xlsxData);
  const wbOut = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbOut, ws, "Comptes Pharmacies");

  const xlsxPath = "/home/z/my-project/download/MediTike-Comptes-Pharmacies.xlsx";
  XLSX.writeFile(wbOut, xlsxPath);
  console.log(`✅ Fichier xlsx généré: ${xlsxPath}`);

  // 5. Générer le script SQL pour Supabase
  let sql = `-- ============================================================\n`;
  sql += `-- MediTike — Comptes pharmaciens (générés automatiquement)\n`;
  sql += `-- À exécuter dans Supabase Dashboard → SQL Editor\n`;
  sql += `-- ============================================================\n`;
  sql += `-- Ce script crée :\n`;
  sql += `-- 1. Les pharmacies (table Pharmacy)\n`;
  sql += `-- 2. Les comptes pharmaciens (table User) avec mots de passe hashés\n`;
  sql += `-- Le pharmacien pourra se connecter et compléter ses informations.\n`;
  sql += `-- ============================================================\n\n`;

  sql += `BEGIN;\n\n`;

  // Section 1 : Pharmacies
  sql += `-- ─── PHARMACIES ────────────────────────────────────────────────\n`;
  for (const a of accounts) {
    const escapeSql = (s: string | null) => s ? `'${s.replace(/'/g, "''")}'` : "NULL";
    sql += `INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")\n`;
    sql += `VALUES (\n`;
    sql += `  '${a.pharmacyId}',\n`;
    sql += `  '${a.fullName.replace(/'/g, "''")}',\n`;
    sql += `  '${a.phone}',\n`;
    sql += `  ${escapeSql(a.phone2)},\n`;
    sql += `  '${a.phone}',\n`;
    sql += `  ${escapeSql(a.address)},\n`;
    sql += `  'Lomé',\n`;
    sql += `  NULL,\n`;
    sql += `  TRUE,\n`;
    sql += `  now(),\n`;
    sql += `  now()\n`;
    sql += `)\nON CONFLICT (id) DO NOTHING;\n`;
  }

  sql += `\n-- ─── COMPTES PHARMACIENS ──────────────────────────────────────\n`;
  sql += `INSERT INTO "User" (id, phone, "passwordHash", "fullName", role, "pharmacyId", "isActive", "createdAt", "updatedAt")\n`;
  sql += `VALUES\n`;

  const values: string[] = [];
  for (const a of accounts) {
    values.push(
      `  (\n` +
      `    '${a.userId}',\n` +
      `    '${a.phone}',\n` +
      `    '${a.passwordHash}',\n` +
      `    '${a.fullName.replace(/'/g, "''")}',\n` +
      `    'pharmacist',\n` +
      `    '${a.pharmacyId}',\n` +
      `    TRUE,\n` +
      `    now(),\n` +
      `    now()\n` +
      `  )`
    );
  }
  sql += values.join(",\n");
  sql += `\nON CONFLICT (phone) DO NOTHING;\n`;

  sql += `\nCOMMIT;\n\n`;

  // Vérification
  sql += `-- ─── VÉRIFICATION ──────────────────────────────────────────────\n`;
  sql += `SELECT 'Pharmacies créées' AS info, COUNT(*) AS total FROM "Pharmacy" WHERE id LIKE 'pharma-%';\n`;
  sql += `SELECT 'Comptes pharmaciens' AS info, COUNT(*) AS total FROM "User" WHERE role = 'pharmacist' AND id LIKE 'pharma-user-%';\n`;

  const sqlPath = "/home/z/my-project/download/MediTike-Comptes-Pharmacies.sql";
  fs.writeFileSync(sqlPath, sql);
  console.log(`✅ Script SQL généré: ${sqlPath}`);

  // Résumé
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Résumé :`);
  console.log(`   ${accounts.length} pharmacies uniques`);
  console.log(`   ${accounts.length} comptes pharmaciens créés`);
  console.log(`   Mots de passe : 12 caractères (maj+min+chiffre+spécial)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n📁 Fichiers générés :`);
  console.log(`   📊 ${xlsxPath}`);
  console.log(`   📄 ${sqlPath}`);
  console.log(`\n🔑 Exemple de compte :`);
  console.log(`   Pharmacie: ${accounts[0]?.fullName}`);
  console.log(`   Téléphone: ${accounts[0]?.phone}`);
  console.log(`   Mot de passe: ${accounts[0]?.password}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main();
