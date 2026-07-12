-- ============================================================
-- MediTike — Row Level Security (RLS) Supabase — Niveau 5/5
-- ============================================================
-- À exécuter dans Supabase Dashboard → SQL Editor
-- Active RLS sur toutes les tables avec politiques strictes
-- ============================================================

-- ─── ACTIVER RLS SUR TOUTES LES TABLES ─────────────────────────

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Pharmacy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PharmacyDuty" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductResponse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Photo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppStat" ENABLE ROW LEVEL SECURITY;

-- ─── POLITIQUES RLS ────────────────────────────────────────────
-- Principe : service_role (serveur) a TOUS les droits
-- Les requêtes directes Supabase (anon key) sont BLOQUÉES
-- Toute la logique passe par l'API Next.js qui utilise service_role

-- User : aucune lecture directe (tout passe par l'API)
DROP POLICY IF EXISTS "service_role_all_User" ON "User";
CREATE POLICY "service_role_all_User" ON "User"
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Pharmacy : lecture publique des pharmacies actives (pour la liste de connexion)
DROP POLICY IF EXISTS "public_read_active_pharmacies" ON "Pharmacy";
CREATE POLICY "public_read_active_pharmacies" ON "Pharmacy"
  FOR SELECT USING ("isActive" = true);

DROP POLICY IF EXISTS "service_role_all_Pharmacy" ON "Pharmacy";
CREATE POLICY "service_role_all_Pharmacy" ON "Pharmacy"
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- PharmacyDuty : lecture publique (liste de garde)
DROP POLICY IF EXISTS "public_read_duty" ON "PharmacyDuty";
CREATE POLICY "public_read_duty" ON "PharmacyDuty"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "service_role_all_PharmacyDuty" ON "PharmacyDuty";
CREATE POLICY "service_role_all_PharmacyDuty" ON "PharmacyDuty"
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ProductRequest : service_role uniquement
DROP POLICY IF EXISTS "service_role_all_ProductRequest" ON "ProductRequest";
CREATE POLICY "service_role_all_ProductRequest" ON "ProductRequest"
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ProductResponse : service_role uniquement
DROP POLICY IF EXISTS "service_role_all_ProductResponse" ON "ProductResponse";
CREATE POLICY "service_role_all_ProductResponse" ON "ProductResponse"
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Photo : service_role uniquement (JAMAIS de lecture publique)
DROP POLICY IF EXISTS "service_role_all_Photo" ON "Photo";
CREATE POLICY "service_role_all_Photo" ON "Photo"
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- AuditLog : service_role uniquement
DROP POLICY IF EXISTS "service_role_all_AuditLog" ON "AuditLog";
CREATE POLICY "service_role_all_AuditLog" ON "AuditLog"
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- AppStat : lecture publique (stats affichées sur le site)
DROP POLICY IF EXISTS "public_read_stats" ON "AppStat";
CREATE POLICY "public_read_stats" ON "AppStat"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "service_role_all_AppStat" ON "AppStat";
CREATE POLICY "service_role_all_AppStat" ON "AppStat"
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ─── VÉRIFICATION ──────────────────────────────────────────────
SELECT
  tablename,
  rowsecurity,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) AS policies_count
FROM pg_tables t
WHERE schemaname = 'public'
ORDER BY tablename;
