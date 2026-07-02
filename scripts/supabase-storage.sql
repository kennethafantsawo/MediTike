-- ============================================================
-- MediTike — Initialisation Supabase Storage
-- À exécuter dans Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Créer le bucket privé pour les photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('meditike-photos', 'meditike-photos', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Politiques RLS (Row Level Security) sur le bucket
-- ⚠️ Important: le bucket est PRIVÉ. Les photos ne sont accessibles
-- que via l'API MediTike (qui utilise la service_role key côté serveur).
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Politique: seul le service_role (server) peut écrire/lire
CREATE POLICY "Service role full access on meditike-photos"
  ON storage.objects FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3. Vérification
SELECT id, name, public FROM storage.buckets WHERE id = 'meditike-photos';
