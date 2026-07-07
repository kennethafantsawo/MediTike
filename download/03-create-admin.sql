-- ============================================================
-- MediTike — Créer un compte administrateur caché
-- ============================================================
-- À exécuter dans Supabase Dashboard → SQL Editor
-- Crée un compte admin avec le numéro +228 97 21 70 56 et le mot de passe kenneth18
-- ============================================================

-- Supprimer l'ancien compte admin par défaut s'il existe (optionnel)
-- DELETE FROM "User" WHERE phone = '+22890000001';

-- Créer le nouveau compte admin
INSERT INTO "User" (id, phone, "passwordHash", "fullName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  'admin-kenneth-001',
  '+22897217056',
  '$2b$12$8aSgsYqOoRBnMQcQhc4d5u4m5iL92QO9PRoB16UiRsbVYRT0YmR2u',
  'Kenneth Afantsawo',
  'admin',
  TRUE,
  now(),
  now()
)
ON CONFLICT (phone) DO UPDATE SET
  "passwordHash" = EXCLUDED."passwordHash",
  "fullName" = EXCLUDED."fullName",
  role = EXCLUDED.role,
  "isActive" = TRUE,
  "updatedAt" = now();

-- Vérification
SELECT id, phone, "fullName", role, "isActive" FROM "User" WHERE phone = '+22897217056';
