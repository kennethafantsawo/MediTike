-- ============================================================
-- MediTike — Schéma PostgreSQL (à exécuter EN PREMIER dans Supabase SQL Editor)
-- ============================================================
-- Ce script crée toutes les tables MediTike dans Supabase.
-- Exécutez-le dans : Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ─── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  "pharmacyId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "lastSeenAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"(role);
CREATE INDEX IF NOT EXISTS "User_isActive_idx" ON "User"("isActive");

-- ─── PHARMACY ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Pharmacy" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone1 TEXT NOT NULL,
  phone2 TEXT,
  whatsapp TEXT,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Lomé',
  district TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdById" TEXT,
  "createdByName" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Pharmacy_isActive_idx" ON "Pharmacy"("isActive");
CREATE INDEX IF NOT EXISTS "Pharmacy_city_idx" ON "Pharmacy"(city);

-- Lien User → Pharmacy
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_pharmacyId_fkey";
ALTER TABLE "User" ADD CONSTRAINT "User_pharmacyId_fkey"
  FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- ─── PHARMACY DUTY (garde hebdomadaire) ──────────────────────
CREATE TABLE IF NOT EXISTS "PharmacyDuty" (
  id TEXT PRIMARY KEY,
  "pharmacyId" TEXT,
  name TEXT NOT NULL,
  address TEXT,
  phone1 TEXT,
  phone2 TEXT,
  "weekStart" TIMESTAMPTZ NOT NULL,
  "weekEnd" TIMESTAMPTZ NOT NULL,
  "sourceFile" TEXT,
  "importedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "PharmacyDuty_name_weekStart_key" ON "PharmacyDuty"(name, "weekStart");
CREATE INDEX IF NOT EXISTS "PharmacyDuty_weekStart_idx" ON "PharmacyDuty"("weekStart");
ALTER TABLE "PharmacyDuty" DROP CONSTRAINT IF EXISTS "PharmacyDuty_pharmacyId_fkey";
ALTER TABLE "PharmacyDuty" ADD CONSTRAINT "PharmacyDuty_pharmacyId_fkey"
  FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- ─── PRODUCT REQUEST (demandes client) ───────────────────────
CREATE TABLE IF NOT EXISTS "ProductRequest" (
  id TEXT PRIMARY KEY,
  "clientId" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  "clientName" TEXT,
  "clientPhone" TEXT,
  "notifiedPharmacies" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "expiresAt" TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS "ProductRequest_status_idx" ON "ProductRequest"(status);
CREATE INDEX IF NOT EXISTS "ProductRequest_createdAt_idx" ON "ProductRequest"("createdAt");
CREATE INDEX IF NOT EXISTS "ProductRequest_clientId_idx" ON "ProductRequest"("clientId");
ALTER TABLE "ProductRequest" DROP CONSTRAINT IF EXISTS "ProductRequest_clientId_fkey";
ALTER TABLE "ProductRequest" ADD CONSTRAINT "ProductRequest_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- ─── PRODUCT RESPONSE (réponses pharmacien) ──────────────────
CREATE TABLE IF NOT EXISTS "ProductResponse" (
  id TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL,
  "pharmacistId" TEXT NOT NULL,
  "pharmacyId" TEXT NOT NULL,
  available BOOLEAN NOT NULL,
  price DOUBLE PRECISION,
  note TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "ProductResponse_requestId_idx" ON "ProductResponse"("requestId");
CREATE INDEX IF NOT EXISTS "ProductResponse_pharmacistId_idx" ON "ProductResponse"("pharmacistId");
CREATE INDEX IF NOT EXISTS "ProductResponse_pharmacyId_idx" ON "ProductResponse"("pharmacyId");
ALTER TABLE "ProductResponse" DROP CONSTRAINT IF EXISTS "ProductResponse_requestId_fkey";
ALTER TABLE "ProductResponse" ADD CONSTRAINT "ProductResponse_requestId_fkey"
  FOREIGN KEY ("requestId") REFERENCES "ProductRequest"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "ProductResponse" DROP CONSTRAINT IF EXISTS "ProductResponse_pharmacistId_fkey";
ALTER TABLE "ProductResponse" ADD CONSTRAINT "ProductResponse_pharmacistId_fkey"
  FOREIGN KEY ("pharmacistId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE "ProductResponse" DROP CONSTRAINT IF EXISTS "ProductResponse_pharmacyId_fkey";
ALTER TABLE "ProductResponse" ADD CONSTRAINT "ProductResponse_pharmacyId_fkey"
  FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- ─── PHOTO ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Photo" (
  id TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL,
  filename TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  size INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  "uploadedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleteAt" TIMESTAMPTZ NOT NULL,
  "deletedAt" TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS "Photo_deleteAt_idx" ON "Photo"("deleteAt");
CREATE INDEX IF NOT EXISTS "Photo_requestId_idx" ON "Photo"("requestId");
ALTER TABLE "Photo" DROP CONSTRAINT IF EXISTS "Photo_requestId_fkey";
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_requestId_fkey"
  FOREIGN KEY ("requestId") REFERENCES "ProductRequest"(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- ─── AUDIT LOG ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id TEXT PRIMARY KEY,
  "adminId" TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip INET DEFAULT 'unknown'::INET,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "AuditLog_adminId_idx" ON "AuditLog"("adminId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
ALTER TABLE "AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_adminId_fkey";
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey"
  FOREIGN KEY ("adminId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- ─── APP STAT (cache stats) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS "AppStat" (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── VÉRIFICATION ─────────────────────────────────────────────
SELECT '✅ Schéma MediTike créé avec succès' AS message,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('User','Pharmacy','PharmacyDuty','ProductRequest','ProductResponse','Photo','AuditLog','AppStat')) AS tables_creees;
