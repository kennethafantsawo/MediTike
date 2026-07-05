-- ============================================================
-- MediTike — Seed initial (à exécuter EN DEUXIÈME dans Supabase SQL Editor)
-- ============================================================
-- Ce script crée le compte admin + 2 pharmacies démo + comptes pharmaciens + 1 client démo.
-- ⚠️ Exécutez-le APRÈS 01-schema.sql
-- ============================================================

-- ─── 1. COMPTE ADMIN PAR DÉFAUT ───────────────────────────────
-- Mot de passe: AdminMediTike2024!
-- Hash bcrypt (12 rounds) — généré pour "AdminMediTike2024!"
INSERT INTO "User" (id, phone, "passwordHash", "fullName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  'admin-default-001',
  '+22890000001',
  '$2b$12$Db6t0G2pZnz.1vGEXT6I3O82wq8j7Ozt..Z1f.5yt6uQuqZA9iPh2',
  'Administrateur MediTike',
  'admin',
  TRUE,
  now(),
  now()
)
ON CONFLICT (phone) DO NOTHING;

-- ─── 2. PHARMACIES DÉMO ───────────────────────────────────────
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdById", "createdByName", "createdAt", "updatedAt")
VALUES
(
  'pharma-demo-tokoin',
  'Pharmacie de Tokoin',
  '+22822254545',
  '+22891987654',
  '+22891987654',
  'Tokoin, près du CHU Sylvanus Olympio',
  'Lomé',
  'Tokoin',
  TRUE,
  'admin-default-001',
  'Administrateur MediTike',
  now(),
  now()
),
(
  'pharma-demo-centrale',
  'Pharmacie Centrale de Lomé',
  '+22822120000',
  '+22890221100',
  '+22890221100',
  'Boulevard du Mono, Centre-ville',
  'Lomé',
  'Centre-ville',
  TRUE,
  'admin-default-001',
  'Administrateur MediTike',
  now(),
  now()
)
ON CONFLICT DO NOTHING;

-- ─── 3. COMPTES PHARMACIENS DÉMO ─────────────────────────────
-- Mot de passe pour les 2: Pharma2024!
INSERT INTO "User" (id, phone, "passwordHash", "fullName", role, "pharmacyId", "isActive", "createdAt", "updatedAt")
VALUES
(
  'pharma-user-tokoin',
  '+22822254545',
  '$2b$12$yRcj3oxCKpuUvO7/1q5oDuVi2nFIg1w5P07xxbjQPVHQADDOPs3eC',
  'Pharmacien Tokoin',
  'pharmacist',
  'pharma-demo-tokoin',
  TRUE,
  now(),
  now()
),
(
  'pharma-user-centrale',
  '+22822120000',
  '$2b$12$yRcj3oxCKpuUvO7/1q5oDuVi2nFIg1w5P07xxbjQPVHQADDOPs3eC',
  'Pharmacien Centrale',
  'pharmacist',
  'pharma-demo-centrale',
  TRUE,
  now(),
  now()
)
ON CONFLICT (phone) DO NOTHING;

-- ─── 4. CLIENT DÉMO ───────────────────────────────────────────
-- Mot de passe: Client2024!
INSERT INTO "User" (id, phone, "passwordHash", "fullName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  'client-demo-001',
  '+22890123456',
  '$2b$12$J8U2LqZAHyndlckfL0ExK.b7gWLGn.19QAML37LOlJEoMOcLz99nG',
  'Koffi Mensah',
  'client',
  TRUE,
  now(),
  now()
)
ON CONFLICT (phone) DO NOTHING;

-- ─── 5. DEMANDE DÉMO + RÉPONSE ────────────────────────────────
INSERT INTO "ProductRequest" (id, "clientId", "productName", note, status, "clientName", "clientPhone", "notifiedPharmacies", "createdAt", "updatedAt", "expiresAt")
VALUES (
  'request-demo-001',
  'client-demo-001',
  'Amoxicilline 500mg',
  'Boîte de 12 gélules si possible.',
  'responded',
  'Koffi Mensah',
  '+22890123456',
  2,
  now(),
  now(),
  now() + INTERVAL '7 days'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "ProductResponse" (id, "requestId", "pharmacistId", "pharmacyId", available, price, note, read, "createdAt")
VALUES (
  'response-demo-001',
  'request-demo-001',
  'pharma-user-tokoin',
  'pharma-demo-tokoin',
  TRUE,
  2500,
  'En stock, disponible immédiatement.',
  TRUE,
  now()
)
ON CONFLICT (id) DO NOTHING;

-- ─── 6. VÉRIFICATION ──────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM "User" WHERE role='admin') AS admins,
  (SELECT COUNT(*) FROM "User" WHERE role='pharmacist') AS pharmaciens,
  (SELECT COUNT(*) FROM "User" WHERE role='client') AS clients,
  (SELECT COUNT(*) FROM "Pharmacy") AS pharmacies,
  (SELECT COUNT(*) FROM "ProductRequest") AS demandes;
