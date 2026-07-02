/**
 * Seed MediTike:
 * 1. Crée l'admin par défaut (avec mot de passe fort)
 * 2. Importe le fichier xlsx du Ministère de la Santé du Togo
 * 3. Crée 2 pharmacies de démo + 2 pharmaciens
 * 4. Crée 1 client de démo
 *
 * Usage: bun run scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { parseDutyFile } from "../src/lib/meditike/duty-parser";
import { normalizeTogoPhone, getMondayUTC } from "../src/lib/meditike/helpers";
import path from "path";
import fs from "fs";

const db = new PrismaClient();
const XLSX_PATH = "/home/z/my-project/upload/TDG Des Pharmacies  Du 06 Juiellet 2026 Au 04 Janvier 2027.xlsx";

async function main() {
  console.log("🌱 Seed MediTike...\n");

  // 1. Admin par défaut
  const adminPhone = "+22890000001";
  const adminPassword = "AdminMediTike2024!";
  let admin = await db.user.findUnique({ where: { phone: adminPhone } });
  if (!admin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    admin = await db.user.create({
      data: {
        phone: adminPhone,
        passwordHash,
        fullName: "Administrateur MediTike",
        role: "admin",
      },
    });
    console.log(`✅ Admin créé: ${adminPhone} / ${adminPassword}`);
  } else {
    console.log(`ℹ️  Admin existe déjà: ${adminPhone}`);
  }

  // 2. Importer le fichier xlsx du Ministère
  console.log("\n📊 Import du fichier xlsx du Ministère...");
  if (fs.existsSync(XLSX_PATH)) {
    try {
      const parsed = parseDutyFile(XLSX_PATH, "TDG Des Pharmacies  Du 06 Juiellet 2026 Au 04 Janvier 2027.xlsx");
      console.log(`   → ${parsed.weeks.length} semaines détectées, ${parsed.totalPharmacies} pharmacies au total`);

      let weeksImported = 0;
      let pharmaciesImported = 0;
      for (const week of parsed.weeks) {
        // Supprimer la semaine existante si déjà importée
        await db.pharmacyDuty.deleteMany({ where: { weekStart: week.weekStart } });

        for (const pharma of week.pharmacies) {
          await db.pharmacyDuty.create({
            data: {
              name: pharma.name,
              address: pharma.address,
              phone1: pharma.phone1,
              phone2: pharma.phone2,
              weekStart: week.weekStart,
              weekEnd: week.weekEnd,
              sourceFile: parsed.fileName,
            },
          });
          pharmaciesImported++;
        }
        weeksImported++;
      }
      console.log(`✅ ${weeksImported} semaines importées, ${pharmaciesImported} entrées pharmacies`);

      // Vérifier la semaine courante
      const currentMonday = getMondayUTC();
      const currentWeekCount = await db.pharmacyDuty.count({ where: { weekStart: currentMonday } });
      console.log(`   → Pharmacies de garde pour la semaine courante (${currentMonday.toISOString().slice(0, 10)}): ${currentWeekCount}`);
    } catch (e: any) {
      console.error(`❌ Erreur d'import xlsx: ${e.message}`);
    }
  } else {
    console.log(`⚠️  Fichier xlsx introuvable: ${XLSX_PATH}`);
  }

  // 3. Pharmacies de démo + pharmaciens
  console.log("\n💊 Création des pharmacies de démo...");
  const demoPharmacies = [
    {
      name: "Pharmacie de Tokoin",
      phone1: "+22822254545",
      phone2: "+22891987654",
      whatsapp: "+22891987654",
      address: "Tokoin, près du CHU Sylvanus Olympio",
      city: "Lomé",
      district: "Tokoin",
      pharmacistPhone: "+22822254545",
      pharmacistPassword: "Pharma2024!",
      pharmacistFullName: "Pharmacien Tokoin",
    },
    {
      name: "Pharmacie Centrale de Lomé",
      phone1: "+22822120000",
      phone2: "+22890221100",
      whatsapp: "+22890221100",
      address: "Boulevard du Mono, Centre-ville",
      city: "Lomé",
      district: "Centre-ville",
      pharmacistPhone: "+22822120000",
      pharmacistPassword: "Pharma2024!",
      pharmacistFullName: "Pharmacien Centrale",
    },
  ];

  for (const p of demoPharmacies) {
    const existing = await db.pharmacy.findFirst({ where: { name: p.name } });
    if (existing) {
      console.log(`   ℹ️  ${p.name} existe déjà`);
      continue;
    }

    const pharmacy = await db.pharmacy.create({
      data: {
        name: p.name,
        phone1: p.phone1,
        phone2: p.phone2,
        whatsapp: p.whatsapp,
        address: p.address,
        city: p.city,
        district: p.district,
        createdById: admin.id,
        createdByName: admin.fullName || undefined,
      },
    });

    const cleanPhone = normalizeTogoPhone(p.pharmacistPhone);
    const existingUser = await db.user.findUnique({ where: { phone: cleanPhone } });
    if (!existingUser) {
      const passwordHash = await bcrypt.hash(p.pharmacistPassword, 12);
      await db.user.create({
        data: {
          phone: cleanPhone,
          passwordHash,
          fullName: p.pharmacistFullName,
          role: "pharmacist",
          pharmacyId: pharmacy.id,
        },
      });
    }
    console.log(`✅ ${p.name} + pharmacien créé`);
  }

  // 4. Client de démo
  const clientPhone = "+22890123456";
  const clientPassword = "Client2024!";
  const existingClient = await db.user.findUnique({ where: { phone: clientPhone } });
  if (!existingClient) {
    const passwordHash = await bcrypt.hash(clientPassword, 12);
    await db.user.create({
      data: {
        phone: clientPhone,
        passwordHash,
        fullName: "Koffi Mensah",
        role: "client",
      },
    });
    console.log(`✅ Client démo créé: ${clientPhone} / ${clientPassword}`);
  } else {
    console.log(`ℹ️  Client démo existe déjà`);
  }

  // 5. Créer une demande de démo
  const client = await db.user.findUnique({ where: { phone: clientPhone } });
  const pharmacy = await db.pharmacy.findFirst({ where: { name: "Pharmacie de Tokoin" } });
  if (client && pharmacy) {
    const existingReq = await db.productRequest.findFirst({
      where: { clientId: client.id, productName: "Amoxicilline 500mg" },
    });
    if (!existingReq) {
      const request = await db.productRequest.create({
        data: {
          clientId: client.id,
          productName: "Amoxicilline 500mg",
          note: "Boîte de 12 gélules si possible.",
          status: "open",
          clientName: client.fullName,
          clientPhone: client.phone,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // Une réponse de démo
      const pharmacist = await db.user.findFirst({
        where: { pharmacyId: pharmacy.id, role: "pharmacist" },
      });
      if (pharmacist) {
        await db.productResponse.create({
          data: {
            requestId: request.id,
            pharmacistId: pharmacist.id,
            pharmacyId: pharmacy.id,
            available: true,
            price: 2500,
            note: "En stock, disponible immédiatement.",
          },
        });
        await db.productRequest.update({
          where: { id: request.id },
          data: { status: "responded" },
        });
        console.log(`✅ Demande + réponse de démo créées`);
      }
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Seed terminé !\n");
  console.log("🔑 Comptes de test:");
  console.log(`   Admin:      ${adminPhone} / ${adminPassword}`);
  console.log(`   Client:     ${clientPhone} / ${clientPassword}`);
  console.log(`   Pharmacien: +228 22 25 45 45 / Pharma2024!`);
  console.log(`   Pharmacien: +228 22 12 00 00 / Pharma2024!`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
