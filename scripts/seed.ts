/**
 * MediTike seed script
 * Populates the database with real Togo pharmacies + common medications
 * Run with: bun run /home/z/my-project/scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// Common medications sold in Togo pharmacies
const MEDICATIONS = [
  { name: "Paracétamol 500mg", genericName: "Paracétamol", category: "Antalgique", form: "Comprimé", dosage: "500mg" },
  { name: "Paracétamol 1000mg", genericName: "Paracétamol", category: "Antalgique", form: "Comprimé", dosage: "1000mg" },
  { name: "Ibuprofène 400mg", genericName: "Ibuprofène", category: "Anti-inflammatoire", form: "Comprimé", dosage: "400mg" },
  { name: "Amoxicilline 500mg", genericName: "Amoxicilline", category: "Antibiotique", form: "Gélule", dosage: "500mg" },
  { name: "Amoxicilline 1g", genericName: "Amoxicilline", category: "Antibiotique", form: "Comprimé", dosage: "1g" },
  { name: "Co-trimoxazole 480mg", genericName: "Sulfaméthoxazole + Triméthoprime", category: "Antibiotique", form: "Comprimé", dosage: "480mg" },
  { name: "Cotrimoxazole sirop", genericName: "Sulfaméthoxazole + Triméthoprime", category: "Antibiotique", form: "Sirop", dosage: "240mg/5ml" },
  { name: "Métronidazole 500mg", genericName: "Métronidazole", category: "Antibiotique", form: "Comprimé", dosage: "500mg" },
  { name: "Chloroquine 100mg", genericName: "Chloroquine", category: "Antipaludique", form: "Comprimé", dosage: "100mg" },
  { name: "Artésunate 50mg", genericName: "Artésunate", category: "Antipaludique", form: "Comprimé", dosage: "50mg" },
  { name: "Artéméther + Luméfantrine", genericName: "Artéméther + Luméfantrine", category: "Antipaludique", form: "Comprimé", dosage: "20/120mg" },
  { name: "Quinine 300mg", genericName: "Quinine", category: "Antipaludique", form: "Comprimé", dosage: "300mg" },
  { name: "Aspirine 500mg", genericName: "Acide acétylsalicylique", category: "Antalgique", form: "Comprimé", dosage: "500mg" },
  { name: "Diclofénac 50mg", genericName: "Diclofénac", category: "Anti-inflammatoire", form: "Comprimé", dosage: "50mg" },
  { name: "Omeprazole 20mg", genericName: "Omeprazole", category: "Anti-ulcéreux", form: "Gélule", dosage: "20mg" },
  { name: "Métopropranolol", genericName: "Propranolol", category: "Bêta-bloquant", form: "Comprimé", dosage: "40mg" },
  { name: "Captopril 25mg", genericName: "Captopril", category: "ACE inhibiteur", form: "Comprimé", dosage: "25mg" },
  { name: "Amlodipine 5mg", genericName: "Amlodipine", category: "Anti-hypertenseur", form: "Comprimé", dosage: "5mg" },
  { name: "Glibenclamide 5mg", genericName: "Glibenclamide", category: "Antidiabétique", form: "Comprimé", dosage: "5mg" },
  { name: "Metformine 500mg", genericName: "Metformine", category: "Antidiabétique", form: "Comprimé", dosage: "500mg" },
  { name: "Insuline NPH", genericName: "Insuline isophane", category: "Antidiabétique", form: "Injectable", dosage: "100 UI/ml" },
  { name: "Cétirizine 10mg", genericName: "Cétirizine", category: "Antihistaminique", form: "Comprimé", dosage: "10mg" },
  { name: "Chlorphénamine 4mg", genericName: "Chlorphénamine", category: "Antihistaminique", form: "Comprimé", dosage: "4mg" },
  { name: "Loratadine 10mg", genericName: "Loratadine", category: "Antihistaminique", form: "Comprimé", dosage: "10mg" },
  { name: "Prednisolone 5mg", genericName: "Prednisolone", category: "Corticoïde", form: "Comprimé", dosage: "5mg" },
  { name: "Hydrocortisone crème", genericName: "Hydrocortisone", category: "Corticoïde", form: "Crème", dosage: "1%" },
  { name: "Métronidazole sirop", genericName: "Métronidazole", category: "Antibiotique", form: "Sirop", dosage: "200mg/5ml" },
  { name: "Sirop antitussif", genericName: "Codéine + autres", category: "Antitussif", form: "Sirop", dosage: "-" },
  { name: "Vitamine C 1g", genericName: "Acide ascorbique", category: "Vitamine", form: "Comprimé effervescent", dosage: "1g" },
  { name: "Vitamine B Complex", genericName: "Vitamines B", category: "Vitamine", form: "Comprimé", dosage: "-" },
  { name: "Fer + Acide folique", genericName: "Sulfate de fer + Acide folique", category: "Supplément", form: "Comprimé", dosage: "-" },
  { name: "Sérum de réhydratation orale", genericName: "SRO", category: "Réhydratation", form: "Sachet", dosage: "-" },
  { name: "Pommade antibiotique", genericName: "Bacitracine + Néomycine", category: "Antibiotique", form: "Pommade", dosage: "-" },
  { name: "Doliprane sirop", genericName: "Paracétamol", category: "Antalgique", form: "Sirop", dosage: "2.4%" },
  { name: "Eau oxygénée 10 volumes", genericName: "Peroxyde d'hydrogène", category: "Antiseptique", form: "Solution", dosage: "10 vol" },
  { name: "Bétadine solution", genericName: "Povidone iodée", category: "Antiseptique", form: "Solution", dosage: "10%" },
  { name: "Alcool à 70°", genericName: "Éthanol", category: "Antiseptique", form: "Solution", dosage: "70%" },
  { name: "Compresses stériles", genericName: "Compresses", category: "Pansement", form: "Boîte", dosage: "-" },
  { name: "Seringues jetables", genericName: "Seringue", category: "Matériel", form: "Unité", dosage: "5ml" },
  { name: "Préservatifs masculins", genericName: "Préservatif", category: "Contracarceptive", form: "Boîte", dosage: "-" },
];

// Real Togo pharmacies (Lomé area)
const PHARMACIES = [
  {
    name: "Pharmacie Forever",
    phone: "+22822261177",
    whatsapp: "+22890123456",
    address: "01 BP 4884, Avenue des Kondona, face Garage Central Administratif",
    city: "Lomé",
    district: "Lomé Centre",
    latitude: 6.1725,
    longitude: 1.2314,
    isOpen24h: false,
    openingHours: "08:00-22:00",
  },
  {
    name: "Pharmacie Santa Madonna",
    phone: "+22870010303",
    whatsapp: "+22870010303",
    address: "Kégué, près du rond-point",
    city: "Lomé",
    district: "Kégué",
    latitude: 6.1648,
    longitude: 1.2285,
    isOpen24h: false,
    openingHours: "08:00-20:00",
  },
  {
    name: "Pharmacie Betania",
    phone: "+22896801011",
    whatsapp: "+22896801011",
    address: "Totsi-Gblenkomé, Rue sito non loin de la salle des Témoins de Jéhova",
    city: "Lomé",
    district: "Totsi",
    latitude: 6.1856,
    longitude: 1.2534,
    isOpen24h: true,
    openingHours: "24h/24",
  },
  {
    name: "Pharmacie Centrale de Lomé",
    phone: "+22822120000",
    whatsapp: "+22890221100",
    address: "Boulevard du Mono, Centre-ville",
    city: "Lomé",
    district: "Centre-ville",
    latitude: 6.1287,
    longitude: 1.2216,
    isOpen24h: true,
    openingHours: "24h/24",
  },
  {
    name: "Pharmacie de la Paix",
    phone: "+22822253030",
    whatsapp: "+22890543210",
    address: "Rue de la Paix, Adidogomé",
    city: "Lomé",
    district: "Adidogomé",
    latitude: 6.1956,
    longitude: 1.2432,
    isOpen24h: false,
    openingHours: "07:30-21:00",
  },
  {
    name: "Pharmacie du Grand Marché",
    phone: "+22822214141",
    whatsapp: "+22890876543",
    address: "Près du Grand Marché de Lomé",
    city: "Lomé",
    district: "Grand Marché",
    latitude: 6.1318,
    longitude: 1.2264,
    isOpen24h: false,
    openingHours: "08:00-20:00",
  },
  {
    name: "Pharmacie de Bè",
    phone: "+22822267890",
    whatsapp: "+22891234567",
    address: "Quartier de Bè, Avenue de la Liberté",
    city: "Lomé",
    district: "Bè",
    latitude: 6.1462,
    longitude: 1.2891,
    isOpen24h: false,
    openingHours: "08:00-21:00",
  },
  {
    name: "Pharmacie de Tokoin",
    phone: "+22822254545",
    whatsapp: "+22891987654",
    address: "Tokoin, près du CHU Sylvanus Olympio",
    city: "Lomé",
    district: "Tokoin",
    latitude: 6.1736,
    longitude: 1.2056,
    isOpen24h: true,
    openingHours: "24h/24",
  },
  {
    name: "Pharmacie d'Agbalépédogan",
    phone: "+22822287878",
    whatsapp: "+22892221133",
    address: "Agbalépédogan, route de Kpalimé",
    city: "Lomé",
    district: "Agbalépédogan",
    latitude: 6.1623,
    longitude: 1.1856,
    isOpen24h: false,
    openingHours: "08:00-22:00",
  },
  {
    name: "Pharmacie d'Agoè",
    phone: "+22822296565",
    whatsapp: "+22892554433",
    address: "Agoè, près du marché d'Agoè",
    city: "Lomé",
    district: "Agoè",
    latitude: 6.2089,
    longitude: 1.2578,
    isOpen24h: false,
    openingHours: "08:00-22:00",
  },
  {
    name: "Pharmacie de Kpalimé",
    phone: "+22824100011",
    whatsapp: "+22890443322",
    address: "Centre-ville, Kpalimé",
    city: "Kpalimé",
    district: "Centre",
    latitude: 6.1286,
    longitude: 0.6308,
    isOpen24h: false,
    openingHours: "08:00-20:00",
  },
  {
    name: "Pharmacie de Sokodé",
    phone: "+22825500022",
    whatsapp: "+22890776655",
    address: "Centre-ville, Sokodé",
    city: "Sokodé",
    district: "Centre",
    latitude: 8.9833,
    longitude: 1.6667,
    isOpen24h: false,
    openingHours: "08:00-21:00",
  },
  {
    name: "Pharmacie de Kara",
    phone: "+22826600033",
    whatsapp: "+22890998877",
    address: "Centre-ville, Kara",
    city: "Kara",
    district: "Centre",
    latitude: 9.5511,
    longitude: 1.1864,
    isOpen24h: false,
    openingHours: "08:00-21:00",
  },
  {
    name: "Pharmacie d'Atakpamé",
    phone: "+22827700044",
    whatsapp: "+22890112233",
    address: "Centre-ville, Atakpamé",
    city: "Atakpamé",
    district: "Centre",
    latitude: 7.5333,
    longitude: 1.1333,
    isOpen24h: false,
    openingHours: "08:00-20:00",
  },
  {
    name: "Pharmacie de Dapaong",
    phone: "+22828800055",
    whatsapp: "+22890223344",
    address: "Centre-ville, Dapaong",
    city: "Dapaong",
    district: "Centre",
    latitude: 10.8625,
    longitude: 0.2069,
    isOpen24h: false,
    openingHours: "08:00-20:00",
  },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  console.log("🌱 Seeding MediTike database...");

  // Clean
  await db.appStats.deleteMany();
  await db.dutySchedule.deleteMany();
  await db.searchResponse.deleteMany();
  await db.searchRequest.deleteMany();
  await db.pharmacyStock.deleteMany();
  await db.medication.deleteMany();
  await db.user.deleteMany();
  await db.pharmacy.deleteMany();
  console.log("✅ Cleared existing data");

  // 1. Create pharmacies
  const pharmacyRecords = [];
  for (const p of PHARMACIES) {
    const rec = await db.pharmacy.create({ data: p });
    pharmacyRecords.push(rec);
  }
  console.log(`✅ Created ${pharmacyRecords.length} pharmacies`);

  // 2. Create medications
  const medRecords = [];
  for (const m of MEDICATIONS) {
    const rec = await db.medication.create({
      data: { ...m, normalizedName: normalize(m.name) },
    });
    medRecords.push(rec);
  }
  console.log(`✅ Created ${medRecords.length} medications`);

  // 3. Create stocks: each pharmacy has 60-90% of medications in stock
  let stockCount = 0;
  for (const pharma of pharmacyRecords) {
    const stockRate = 0.55 + Math.random() * 0.35; // 55% - 90%
    for (const med of medRecords) {
      const inStock = Math.random() < stockRate;
      // Price varies between 100 and 8500 FCFA depending on type
      const basePrice = (med.category === "Antibiotique" || med.category === "Antipaludique") ? 2500 : 800;
      const price = Math.round((basePrice + Math.random() * 2000) / 50) * 50;
      await db.pharmacyStock.create({
        data: {
          pharmacyId: pharma.id,
          medicationId: med.id,
          inStock,
          price: inStock ? price : null,
          lastVerified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
      });
      stockCount++;
    }
  }
  console.log(`✅ Created ${stockCount} stock entries`);

  // 4. Create duty schedules for next 14 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let dutyCount = 0;
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Each day, pick 3 random pharmacies for day shift + 2 for night shift
    const dayPick = [...pharmacyRecords].sort(() => Math.random() - 0.5).slice(0, 3);
    const dayPickIds = new Set(dayPick.map(p => p.id));
    const nightPick = pharmacyRecords
      .filter(p => p.isOpen24h && !dayPickIds.has(p.id))
      .slice(0, 2);
    for (const ph of dayPick) {
      await db.dutySchedule.create({
        data: {
          pharmacyId: ph.id,
          date,
          startTime: "08:00",
          endTime: "20:00",
          isDay: true,
        },
      });
      dutyCount++;
    }
    for (const ph of nightPick) {
      await db.dutySchedule.create({
        data: {
          pharmacyId: ph.id,
          date,
          startTime: "20:00",
          endTime: "08:00",
          isDay: false,
        },
      });
      dutyCount++;
    }
  }
  console.log(`✅ Created ${dutyCount} duty schedules`);

  // 5. Create demo users
  const clientPassword = await bcrypt.hash("demo1234", 10);
  const pharmaPassword = await bcrypt.hash("demo1234", 10);

  const demoClient = await db.user.create({
    data: {
      phone: "+22890123456",
      passwordHash: clientPassword,
      fullName: "Koffi Mensah",
      role: "client",
    },
  });

  const demoPharmacist = await db.user.create({
    data: {
      phone: "+22822261177",
      passwordHash: pharmaPassword,
      fullName: "Pharmacien Forever",
      role: "pharmacist",
      pharmacyId: pharmacyRecords[0].id,
    },
  });
  console.log(`✅ Created demo users (client + pharmacist)`);

  // 6. Create demo search request + response
  const demoReq = await db.searchRequest.create({
    data: {
      clientId: demoClient.id,
      query: "Amoxicilline 500mg",
      normalizedQuery: normalize("Amoxicilline 500mg"),
      status: "resolved",
      clientName: "Koffi Mensah",
      clientPhone: "+22890123456",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await db.searchResponse.create({
    data: {
      requestId: demoReq.id,
      pharmacistId: demoPharmacist.id,
      pharmacyId: pharmacyRecords[0].id,
      available: true,
      price: 2500,
      note: "En stock, disponible immédiatement. Boîte de 12 gélules.",
    },
  });
  console.log(`✅ Created demo search request + response`);

  // 7. App stats
  await db.appStats.create({ data: { key: "pharmacies", value: pharmacyRecords.length } });
  await db.appStats.create({ data: { key: "medications", value: medRecords.length } });
  await db.appStats.create({ data: { key: "cities", value: 7 } });
  await db.appStats.create({ data: { key: "searches", value: 1842 } });

  console.log("🎉 Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑 Demo accounts:");
  console.log("  Client:    +228 90 12 34 56 / demo1234");
  console.log("  Pharmacien: +228 22 26 11 77 / demo1234");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
