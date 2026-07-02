-- ==================================================================================
-- SCHEMA SQL POUR MEDITIKE
-- Copiez et collez ce script directement dans l'éditeur SQL de votre console Supabase !
-- Ce script gère :
--   1. Les profils (patients/clients et pharmacies partenaires)
--   2. Les demandes de recherche de médicaments
--   3. Les réponses/offres de disponibilité des pharmacies
-- ==================================================================================

-- ==================================================================================
-- OPTIONNEL : RESET COMPLET (DÉCOMENTEZ LES LIGNES CI-DESSOUS POUR RECOMMENCER À ZÉRO)
-- ==================================================================================
-- DROP TABLE IF EXISTS public.responses CASCADE;
-- DROP TABLE IF EXISTS public.requests CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- -------------------------------------------------------------
-- 1. TABLE : profiles (Profils Utilisateurs)
-- Unifié pour supporter à la fois le camelCase et le snake_case
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    id_profile UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'pharmacist')),
    
    -- Nom & Informations Patients / Pharmacies
    full_name TEXT,
    "fullName" TEXT,
    
    -- Nom de la pharmacie (seulement pour l'officine)
    pharmacy_name TEXT,
    "pharmacyName" TEXT,
    
    -- Numéro de téléphone WhatsApp
    phone_number TEXT,
    "phoneNumber" TEXT,
    
    -- Adresse physique (pour l'officine)
    address TEXT,
    address_text TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active la synchronisation en temps réel (Realtime) sur les profils
-- Pour éviter les erreurs si déjà ajouté à la publication :
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;

-- RLS (Sécurité Niveau Ligne)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (Profiles) - Nettoyage et création
DROP POLICY IF EXISTS "lecture_publique_profils" ON public.profiles;
DROP POLICY IF EXISTS "insertion_soi_meme" ON public.profiles;
DROP POLICY IF EXISTS "modification_propre_profil" ON public.profiles;
DROP POLICY IF EXISTS "suppression_par_admin" ON public.profiles;

CREATE POLICY "lecture_publique_profils" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "insertion_soi_meme" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "modification_propre_profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "suppression_par_admin" ON public.profiles FOR DELETE USING (true);


-- -------------------------------------------------------------
-- 2. TABLE : requests (Demandes de médicament lancées par les patients)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- UID client
    client_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "clientUid" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Noms de produits (bruts et normalisés)
    product_name TEXT NOT NULL,
    "productName" TEXT,
    normalized_product_name TEXT,
    "normalizedProductName" TEXT,
    
    -- Statut du ticket
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'expired')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Active la synchronisation en temps réel (Realtime) sur les requêtes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.requests;
  END IF;
END $$;

-- RLS (Sécurité Niveau Ligne)
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (Requests) - Nettoyage et création
DROP POLICY IF EXISTS "lecture_toutes_requetes" ON public.requests;
DROP POLICY IF EXISTS "creation_requetes_clients" ON public.requests;
DROP POLICY IF EXISTS "modification_requetes_proprietaire" ON public.requests;
DROP POLICY IF EXISTS "suppression_requetes_proprietaire" ON public.requests;

CREATE POLICY "lecture_toutes_requetes" ON public.requests FOR SELECT USING (true);
CREATE POLICY "creation_requetes_clients" ON public.requests FOR INSERT WITH CHECK (true);
CREATE POLICY "modification_requetes_proprietaire" ON public.requests FOR UPDATE USING (true);
CREATE POLICY "suppression_requetes_proprietaire" ON public.requests FOR DELETE USING (true);


-- -------------------------------------------------------------
-- 3. TABLE : responses (Offres/Réponses des pharmacies officines)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Référence de la requête associée
    request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
    "requestId" UUID REFERENCES public.requests(id) ON DELETE CASCADE,
    
    -- Identifiant du pharmacien offrant
    pharmacist_uid UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    "pharmacistUid" UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Métadonnées de l'officine participante
    pharmacy_name TEXT,
    "pharmacyName" TEXT,
    pharmacy_phone TEXT,
    "pharmacyPhone" TEXT,
    pharmacy_address TEXT,
    "pharmacyAddress" TEXT,
    
    -- Disponibilité et tarification
    available BOOLEAN NOT NULL DEFAULT TRUE,
    price NUMERIC(10, 2),
    note TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Active la synchronisation en temps réel (Realtime) sur les réponses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'responses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.responses;
  END IF;
END $$;

-- RLS (Sécurité Niveau Ligne)
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (Responses) - Nettoyage et création
DROP POLICY IF EXISTS "lecture_toutes_reponses" ON public.responses;
DROP POLICY IF EXISTS "creation_reponses_pharmaciens" ON public.responses;
DROP POLICY IF EXISTS "modification_reponses" ON public.responses;
DROP POLICY IF EXISTS "suppression_reponses" ON public.responses;

CREATE POLICY "lecture_toutes_reponses" ON public.responses FOR SELECT USING (true);
CREATE POLICY "creation_reponses_pharmaciens" ON public.responses FOR INSERT WITH CHECK (true);
CREATE POLICY "modification_reponses" ON public.responses FOR UPDATE USING (true);
CREATE POLICY "suppression_reponses" ON public.responses FOR DELETE USING (true);
