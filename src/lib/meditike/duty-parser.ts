/**
 * Parser xlsx des pharmacies de garde du Ministère de la Santé du Togo.
 *
 * Format attendu (extrait du fichier officiel):
 * - Colonne A: Nom pharmacie
 * - Colonne B: Emplacement
 * - Colonne C: Téléphone 1
 * - Colonne D: Téléphone 2
 * - Lignes séparateur de semaine: "DD/MM/YYYY au DD/MM/YYYY"
 * - Lignes "PHARMACIES / EMPLACEMENTS / TELEPHONES" = en-tête de section
 *
 * Le parser détecte automatiquement toutes les semaines et renvoie un objet structuré.
 */
import * as XLSX from "xlsx";
import fs from "fs";

export interface ParsedDutyEntry {
  name: string;
  address: string | null;
  phone1: string | null;
  phone2: string | null;
}

export interface ParsedWeek {
  weekStart: Date; // lundi 00:00 UTC
  weekEnd: Date; // lundi suivant 00:00 UTC
  weekLabel: string; // texte brut "DD/MM/YYYY au DD/MM/YYYY"
  pharmacies: ParsedDutyEntry[];
}

export interface ParsedDutyFile {
  fileName: string;
  importedAt: Date;
  weeks: ParsedWeek[];
  totalPharmacies: number;
}

/**
 * Convertit "06/07/2026" en Date (lundi 00:00 UTC).
 * Le format togolais est JJ/MM/AAAA.
 */
function parseFrenchDate(s: string): Date | null {
  const m = s.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [_, dd, mm, yyyy] = m;
  // UTC midnight
  return new Date(Date.UTC(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd), 0, 0, 0));
}

/**
 * Détecte une ligne "semaine" : "06/07/2026 au 13/07/2026"
 */
function detectWeekLine(text: string): { start: Date; end: Date; label: string } | null {
  if (!text || typeof text !== "string") return null;
  const t = text.trim();
  const m = t.match(/(\d{2}\/\d{2}\/\d{4})\s+au\s+(\d{2}\/\d{2}\/\d{4})/i);
  if (!m) return null;
  const start = parseFrenchDate(m[1]);
  const end = parseFrenchDate(m[2]);
  if (!start || !end) return null;
  return { start, end, label: t };
}

function cleanPhone(s: any): string | null {
  if (!s) return null;
  const str = String(s).trim();
  if (!str || str === "" || str === "-") return null;
  // Normalize spaces
  return str.replace(/\s+/g, " ").trim();
}

function cleanText(s: any): string | null {
  if (!s) return null;
  const str = String(s).trim();
  return str || null;
}

/**
 * Parse un fichier xlsx et renvoie toutes les semaines détectées.
 */
export function parseDutyXlsx(filePath: string, originalFileName?: string): ParsedDutyFile {
  const buffer = fs.readFileSync(filePath);
  const wb = XLSX.read(buffer, { type: "buffer" });

  // Prend la première feuille contenant des données
  let sheet: XLSX.WorkSheet | null = null;
  let sheetName = "";
  for (const name of wb.SheetNames) {
    const s = wb.Sheets[name];
    if (s && s["!ref"]) {
      const range = XLSX.utils.decode_range(s["!ref"]);
      if (range.e.r + 1 > 10) {
        sheet = s;
        sheetName = name;
        break;
      }
    }
  }
  if (!sheet) {
    throw new Error("Aucune feuille valide trouvée dans le fichier xlsx.");
  }

  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const weeks: ParsedWeek[] = [];
  let currentWeek: ParsedWeek | null = null;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || [];
    const colB = cleanText(row[1]);

    // Détection ligne semaine
    const weekInfo = detectWeekLine(colB || "");
    if (weekInfo) {
      if (currentWeek && currentWeek.pharmacies.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = {
        weekStart: weekInfo.start,
        weekEnd: weekInfo.end,
        weekLabel: weekInfo.label,
        pharmacies: [],
      };
      continue;
    }

    // Si on est dans une semaine et qu'on a une ligne avec nom pharmacie + téléphone
    if (currentWeek) {
      const name = cleanText(row[0]);
      const address = cleanText(row[1]);
      const phone1 = cleanPhone(row[2]);
      const phone2 = cleanPhone(row[3]);

      // Ignorer en-têtes de section et lignes institutionnelles
      if (!name) continue;
      if (name.toUpperCase() === "PHARMACIES") continue;
      if (name.startsWith("SECRETARIAT") || name.startsWith("DIRECTION") || name.startsWith("No ")) continue;
      if (name.startsWith("---")) continue;
      // Doit avoir au moins un téléphone OU une adresse
      if (!phone1 && !phone2 && !address) continue;
      // Filtrer les lignes qui sont des intitulés administratifs
      if (name.includes("MINISTERE") || name.includes("REPUBLIQUE")) continue;

      currentWeek.pharmacies.push({
        name,
        address,
        phone1,
        phone2,
      });
    }
  }

  // Dernière semaine
  if (currentWeek && currentWeek.pharmacies.length > 0) {
    weeks.push(currentWeek);
  }

  return {
    fileName: originalFileName || filePath.split("/").pop() || "unknown.xlsx",
    importedAt: new Date(),
    weeks,
    totalPharmacies: weeks.reduce((sum, w) => sum + w.pharmacies.length, 0),
  };
}

/**
 * Parse un fichier JSON suivant le format MediTike.
 *
 * Format JSON attendu:
 * {
 *   "version": "1.0",
 *   "source": "Ministère de la Santé Togo",
 *   "weeks": [
 *     {
 *       "weekStart": "2026-07-06",  // ISO date (lundi)
 *       "weekEnd": "2026-07-13",
 *       "pharmacies": [
 *         {
 *           "name": "SANTE",
 *           "address": "Près de NOPATO",
 *           "phone1": "70 44 91 37",
 *           "phone2": null
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export function parseDutyJson(filePath: string, originalFileName?: string): ParsedDutyFile {
  const content = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(content);

  if (!data.weeks || !Array.isArray(data.weeks)) {
    throw new Error("Format JSON invalide: 'weeks' manquant ou n'est pas un tableau.");
  }

  const weeks: ParsedWeek[] = data.weeks.map((w: any, idx: number) => {
    if (!w.weekStart || !w.pharmacies) {
      throw new Error(`Semaine ${idx}: champs 'weekStart' et 'pharmacies' requis.`);
    }
    const start = typeof w.weekStart === "string" ? new Date(w.weekStart) : w.weekStart;
    const end = w.weekEnd ? (typeof w.weekEnd === "string" ? new Date(w.weekEnd) : w.weekEnd) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      weekStart: start,
      weekEnd: end,
      weekLabel: w.label || `${start.toISOString().slice(0, 10)} au ${end.toISOString().slice(0, 10)}`,
      pharmacies: w.pharmacies.map((p: any) => ({
        name: String(p.name || "").trim(),
        address: p.address ? String(p.address).trim() : null,
        phone1: p.phone1 ? String(p.phone1).trim() : null,
        phone2: p.phone2 ? String(p.phone2).trim() : null,
      })),
    };
  });

  return {
    fileName: originalFileName || filePath.split("/").pop() || "unknown.json",
    importedAt: new Date(),
    weeks,
    totalPharmacies: weeks.reduce((sum, w) => sum + w.pharmacies.length, 0),
  };
}

/**
 * Auto-detecte le type de fichier et parse en conséquence.
 */
export function parseDutyFile(filePath: string, originalFileName?: string): ParsedDutyFile {
  const lower = (originalFileName || filePath).toLowerCase();
  if (lower.endsWith(".json")) {
    return parseDutyJson(filePath, originalFileName);
  }
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    return parseDutyXlsx(filePath, originalFileName);
  }
  throw new Error("Format non supporté. Utilisez .xlsx ou .json");
}
