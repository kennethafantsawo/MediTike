-- ============================================================
-- MediTike — Comptes pharmaciens + pharmacies de garde
-- ============================================================
-- À exécuter dans Supabase Dashboard → SQL Editor
-- Généré le 2026-07-06T12:15:25.652Z
-- 212 pharmacies uniques
-- Mots de passe hashés avec bcrypt (12 rounds)
-- ============================================================

BEGIN;

-- ─── 1. Insertion des pharmacies (table "Pharmacy") ─────────
-- Insertion conditionnelle : si une pharmacie avec le même nom
-- existe déjà, on ne crée pas de doublon.

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-001', 'SANTE', '+22870449137', NULL, 'Près de NOPATO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SANTE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-002', 'AKOFA', '+22822210097', '70 49 96 28', 'Av. Maman N’Danida Amoutivé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AKOFA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-003', 'CENTRE', '+22822218330', '91 03 83 83', 'ASSIVITO, face WATT', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CENTRE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-004', 'BON SAMARITAIN', '+22822214530', '91 34 41 94', 'BE PA de SOUZA / Hôpital de BE', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BON SAMARITAIN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-005', 'ECLAIR', '+22896800906', NULL, 'Rue Avenou, Bè Ahligo, dans le prolongement du Marché de Ahligo', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ECLAIR');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-006', 'DE LA MAIRIE', '+22822212639', '91 03 21 21', '39, Avenue Nicolas Grunitzky Nyekonakpoe', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DE LA MAIRIE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-007', 'DE LA MARINA', '+22822214846', '91 01 96 91', 'sur la RN2,BD du Mono en face du poste frontière D''Aflao Kodjoviakopé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DE LA MARINA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-008', 'AVE MARIA', '+22822223301', '99 03 20 12', 'Face ENSF (Ecole Nationale des Sages Femmes) près du CHU Tokoin', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AVE MARIA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-009', 'LIBERATION', '+22822222525', '96 80 09 35', 'Avenue Libération Prolongée', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LIBERATION');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-010', 'GBOSSIME', '+22822225050', '92 47 61 21', '376, Boulevard de la Kara 08 B.P.: 80859 Lomé-TOGO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'GBOSSIME');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-011', 'KLOKPE', '+22896801003', '90 53 60 52', 'Derrière la Foire Togo 2000', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'KLOKPE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-012', 'PROVIDENCE', '+22891148888', '99 76 96 96', 'Bd. Jean Paul II', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'PROVIDENCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-013', 'UNIVERS-SANTE', '+22822618143', '93 88 83 31', 'Bd. GNASSINGBE Eyadéma, Cité OUA face à l''entrée du CHU-CAMPUS', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'UNIVERS-SANTE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-014', 'AEROPORT', '+22822262122', '96 51 59 74', 'Rte de l’Aéroport SITO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AEROPORT');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-015', 'INTERNATIONALE', '+22822268994', '71 00 09 09', 'Sise Marché de Hédzranawoé "Assiyéyé", Boulevard du Haho', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'INTERNATIONALE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-016', 'DES LILAS', '+22896165589', '93 48 88 12', '123HDN, 07 Route de Kégué Boulevard Jean Paul II prolongé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DES LILAS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-017', 'CHRIST-ROI', '+22822274666', '97 77 12 31', 'Kagomé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CHRIST-ROI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-018', 'MAËLYS', '+22822276019', '70 44 86 79', '1688, Bd Malfakassa - Bè Kpota en Face de NETADI', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MAËLYS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-019', 'MISERICORDE', '+22896800945', NULL, 'BE-KPOTA à 300M de NISSAN, A côté de la Station MRS', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MISERICORDE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-020', 'DE LA CITE', '+22822250125', '99 08 15 35', 'Boulevard du 30 Août - BP 8461 - LOME - TOGO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DE LA CITE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-021', 'EPIPHANIA', '+22870401052', '96 80 10 04', 'Rue de La Pampa, Carrefour AGBEMADON, ADIDOGOME', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EPIPHANIA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-022', 'BESDA', '+22822510529', '70 42 68 25', 'Route de Kpalimé , Adidogomé Aménopé 04 BP : 604 Lomé - TOGO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BESDA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-023', 'CONSEIL', '+22893109292', '96 80 21 37', 'Carrefour du CEG Sagbado Logoté', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CONSEIL');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-024', 'DODJI', '+22870291677', '97 74 28 36', 'Ségbé Akato, immeuble Akato plage non loin de l''Eglise Catholique d''Akato', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DODJI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-025', 'POINT E', '+22822519171', '90 37 45 96', '506, rue 129 Aflao Gakli (Kiniti Gomè), à Djidjolé dans le von de la pharmacie Djidjolé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'POINT E');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-026', 'VERTE', '+22822250326', '91 98 50 17', 'Face Ecole du Parti Klikamé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'VERTE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-027', 'DELALI', '+22893645372', '99 29 13 13', 'En face de l''hôpital de Cacavéli à 100m entre la Cour d''Appel et le marché de Cacavéli', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DELALI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-028', 'NATION', '+22822259965', '96 80 09 47', 'Face ancien Marché TOTSI', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'NATION');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-029', 'LAUS DEO', '+22822251505', '93 00 65 75', 'Rte de Léo 2OOO, face Clinique Besthesda - quartier Adidoadin', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LAUS DEO');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-030', 'VITAFLORE', '+22870402286', NULL, 'Agoè Vakpossito à 100 m de la station Shell Agoè Vakpossito', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'VITAFLORE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-031', 'MAINA', '+22870436534', '96 80 10 15', 'Quartier AVEDJI, non loin de Hôpital Source de Vie, à 500m du Carrefour Y', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MAINA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-032', 'ADOUNI', '+22870393939', '97 08 79 79', 'Vakpossito-Logogomé, près du carrefour AISED', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ADOUNI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-033', 'IRIS', '+22891684804', '99 98 00 70', 'Amadahomé, Imm. Havon, A 500m de la station CAP, Rue 50m à coté des Casses Auto', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'IRIS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-034', 'NABINE', '+22893362626', '99 01 77 77', 'Sise à Agoè Anomé dit Plateau (Route du Bar Plateau)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'NABINE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-035', 'ADONAÏ', '+22822500405', NULL, 'Face Hôtel la Plantation à Agoè-Nyivé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ADONAÏ');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-036', 'TCHEP''SON', '+22870429441', '96 90 04 64', 'Face Terminal du Sahel (Togblékopé)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'TCHEP''SON');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-037', 'LIDDY', '+22870901960', NULL, 'AGOE-DIKAME, Bernard Copé après la station CAP en face du Camp de tir', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LIDDY');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-038', 'AMEN', '+22890885588', '97 18 02 02', 'Marché Adétikopé, près de l''Eglise Catholique Christ-Roi', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AMEN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-039', 'DIVINA GRACIA', '+22893839100', '96 80 10 21', 'Quartier Agoè-Fiovi Carrefour Bafana-Bafana', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DIVINA GRACIA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-040', 'LA BARAKA', '+22890174928', '70 41 44 13', 'Agoè LOGOPE, non loin de l''ECOLE LA BRUYERE A PROXIMITE DU CAMP GP', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LA BARAKA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-041', 'EXCELLENCE', '+22822502447', '93 27 95 54', 'AGOE Démakpoé Voie CEDEAO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EXCELLENCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-042', 'VITAS', '+22822256343', NULL, 'Située à Agoè Assiyéyé du côté ouest', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'VITAS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-043', 'ZOSSIME', '+22822554352', '70 46 26 64', 'AGOE - Zossimé, près du marché', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ZOSSIME');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-044', 'SAINT SYLVESTRE', '+22893515198', NULL, 'Zanguéra,Quartier Sanyramé, non loin du rond-point Sanyramé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SAINT SYLVESTRE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-045', 'ST PHILIPPE', '+22890673324', '99 99 80 04', 'SANGUERA, Rte Lomé - Kpalimé près de la Station service OANDO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ST PHILIPPE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-046', 'EVA', '+22892163232', NULL, 'SANGUERA, Klikamé, Non loin du T-OIL', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EVA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-047', 'NOUVELLE TULIPE', '+22899470070', NULL, 'Rte de Mission - Tové; Près de la station CAP Agoè-Légbassito', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'NOUVELLE TULIPE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-048', 'GRATITUDE', '+22892189485', NULL, 'Agoè Legbassito Zovadjin non loin du carrefour Avinato', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'GRATITUDE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-049', 'DE L''EDEN', '+22870421398', NULL, 'Route d''Aného, face Cité Baguida', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DE L''EDEN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-050', 'AVEPOZO', '+22822270486', '93 01 73 51', 'AVEPOZO Be Kome à côté de la place publique 04 BP: 353 Lomé - Togo', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AVEPOZO');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-051', 'PRINCIPALE', '+22890826767', '99 98 66 66', 'Rte d’Aného Kpogan Yovo Kopé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'PRINCIPALE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-052', 'SIKA', '+22892620651', '97 10 75 75', 'DJAGBLE, Hiheatro à 200m du complexe scolaire la Perseverance rte Akakope-Gbamakope', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SIKA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-053', 'AJP-ABOLAVE', '+22890413402', '90 36 07 53', 'Djablé,sur la route d''abolavé, non loin  de l''Institut Scolaire le Souverain', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AJP-ABOLAVE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-054', 'BEL AIR', '+22822210321', '96 80 08 75', 'PRES DE L''EEPT DE AFEGAME (PLAGE) ET DE SUPER RAMCO MARINA (ANCIEN GOYISCORE)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BEL AIR');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-055', 'MATTHIA', '+22822212964', '96 80 10 07', '1048, Avenue de la Libération', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MATTHIA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-056', 'STE RITA', '+22896800970', '72 43 49 39', 'Route pavée, Doulassamé - Face Hôtel SANA', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'STE RITA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-057', 'CHÂTEAU-D''EAU', '+22871338888', '96 80 08 88', 'Av. Augustino de Souza, près  du Château d’eau de BE', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CHÂTEAU-D''EAU');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-058', 'OLIVIERS', '+22822270434', '96 80 09 50', '01, Rue du Rotary club international angle Bd Felix Houphët-Boigny 08 BP 8480 Lomé 08 TOGO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'OLIVIERS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-059', 'EMMANUEL', '+22822213098', '90 09 94 03', '637, Av. Duisburg Face MIVIP Kodjoviakopé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EMMANUEL');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-060', 'SOURCE DE VIE', '+22822202759', '90 88 25 82', 'Face Collège Protestant Tokoin Lomé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SOURCE DE VIE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-061', 'ST KISITO', '+22822219963', '96 80 09 64', 'Bd. de la Kara près du Bar TAMTAM', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ST KISITO');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-062', 'THERYA', '+22870448177', '96 80 09 92', 'Petit contournement, à 500m de la Foire internationale Togo 2000', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'THERYA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-063', 'ST PAUL', '+22896800967', '92 60 51 67', 'Bd. Jean Paul II', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ST PAUL');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-064', 'LE JOURDAIN', '+22822615614', '92 38 30 50', 'Boulevard Léopold Sédar SENGHOR, face au CEG Tokoin Wuiti', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LE JOURDAIN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-065', 'HEDZRANAWE', '+22896800927', '92 51 34 38', 'Avenu du Grand Seminaire non loin de la banque Atlantique', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'HEDZRANAWE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-066', 'KOUESSAN', '+22896801001', '90 50 48 12', 'En face du stade de Kégué', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'KOUESSAN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-067', 'J-MIMSHAK', '+22896443108', '22 61 30 70', 'Rue Tchamba 964, à 50m de la Base SATOM 01 BP : 1391 Hountigomé Lomé - Togo', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'J-MIMSHAK');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-068', 'UNION', '+22822277164', '96 32 97 26', 'Bd Malfakassa, face crèmerie BAMUDAS - BE KPOTA', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'UNION');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-069', 'LE PROGRES', '+22870458655', '96 80 10 00', 'Grd contournement, face EPPL Universelle, non loin de la Gendarmerie d''AHADZI-Kpota', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LE PROGRES');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-070', 'ADIDOGOME', '+22822511891', '91 05 78 21', 'Face au camp 2ème RI d''Adidogomé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ADIDOGOME');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-071', 'SILOE', '+22890802639', '96 80 10 16', 'Carrefour Aflao Apédokoè Atigangomé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SILOE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-072', 'ACTUELLE', '+22890614644', '96 80 09 95', 'Route de Ségbé; Quartier Sagbado - Adidogomé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ACTUELLE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-073', 'SEGBE', '+22892594935', '79 30 07 29', 'Ségbé qt Zanvi, près de l''EPP et du CEG Ségbé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SEGBE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-074', 'WASTINE', '+22892611700', '22 51 81 19', 'Adidogome logoté, à 400m du carrefour logoté sur la route menant au quartier Lankouvi', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'WASTINE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-075', 'DJIDJOLE', '+22822256512', '93 93 99 27', 'DJIDJOLE', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DJIDJOLE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-076', 'ST JOSEPH', '+22822257465', '96 80 09 65', 'Bretelle BE KLIKAME', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ST JOSEPH');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-077', 'VIGUEUR', '+22822516330', '70 44 81 96', 'Rue 267, AGBALEPEDOGAN, Kilimandjaro', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'VIGUEUR');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-078', 'MILLENAIRE', '+22870213197', NULL, 'Face réserve de la gendarmerie d''Agoè-Nyivé, sur la route de 50m à 300m du côté Nord', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MILLENAIRE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-079', 'DIEUDONNE', '+22870448459', '79 98 33 33', 'AGOE-TELESSOU NON LOIN DE LA STATION 
CAP', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DIEUDONNE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-080', 'OSSAN', '+22870404425', NULL, 'Carrefour AVEDZI, face Ets LA LIMOUSINE', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'OSSAN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-081', 'APOLLON', '+22893504255', '70 41 01 07', 'Avédji, Face complexe scolaire Makafui - Non loin du carrefour des hirondelles', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'APOLLON');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-082', 'YESHUA', '+22898772153', '98 77 21 50', 'AGOE Vakpossito vers l''Ecole NDE, entre le CMS Mur et le CMS Maranatha', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'YESHUA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-083', 'CLEMENCE', '+22870193535', '70 21 26 26', 'Rte de la Cour d''Appel, entre l''Agence CEET Agoè et l''Ecole privée La Source', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CLEMENCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-084', 'ST MICHEL', '+22822517022', '70 43 30 43', 'Située à Agoè-Nyivé entre la Brasserie BB et l''espace Télécom', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ST MICHEL');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-085', 'LE ROCHER', '+22892300656', '99 08 05 01', 'Agoè zongo, sur la route national N°1, près du terrain de jeu de golf', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LE ROCHER');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-086', 'ZILIDJI', '+22892616608', NULL, 'Derrière le marche d''agoè zongo', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ZILIDJI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-087', 'EL NOUR', '+22897799374', NULL, 'AGOE - Alinka non loin du CMS Togblekopé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EL NOUR');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-088', 'ASSURANCE', '+22893087676', '96 82 76 76', 'Adétikopé, National N°1, non loin du marché', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ASSURANCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-089', 'KOBOYO', '+22893704812', '93 70 34 78', 'DAVIE, rte de la Nationale No 1 avant le péage de Davié en face de la Station Sanol', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'KOBOYO');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-090', 'DENIS', '+22893084640', '96 74 03 80', 'AGOE Kové, Carrefour Kpogli', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DENIS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-091', 'ABRAHAM', '+22822501000', '92 25 99 83', 'AGOE - Logopé Kossigan', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ABRAHAM');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-092', 'ALTA', '+22822259447', '70 08 46 46', 'AGOE Anonkui Route Mission Tové en face du Centre Culturel Loyola', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ALTA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-093', 'LA MAIN DE DIEU', '+22893402121', NULL, 'AGOE ASSIYEYE non loin de l''église des Assemblées de Dieu (Temple Galilée)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LA MAIN DE DIEU');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-094', 'GANFAT', '+22822550815', '70 22 15 15', 'AGOE DALIKO près du Carf EDEM (CAMP GP)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'GANFAT');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-095', 'ZOPOMAHE', '+22896283410', '98 80 68 83', 'ZOPOMAHE, sur la route Zossimé - Sanguera à côté de la salle des témoins de Jehovah', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ZOPOMAHE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-096', 'EL-SALI', '+22897534444', '70 12 44 44', 'Rte Lomé-Kpalimé, Aflao Apédokoè Gbomamé, à 50 m de la quaincaillerie MACO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EL-SALI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-097', 'MAWULOM', '+22899349797', '70 17 87 87', 'Agoè Nyivé quartier Athiémé Carrefour kponsé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MAWULOM');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-098', 'A DIEU LA GLOIRE', '+22893263600', NULL, 'Marché de Légbassito, à côté de la Poste, sur le grand contournement', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'A DIEU LA GLOIRE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-099', 'OBSERVANCE', '+22822504860', '70 74 22 22', 'SOGBOSSITO, en face de la station Total Energies à Côté du Camp BIR', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'OBSERVANCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-100', 'HYGEA', '+22899273636', '93 33 99 66', 'Face Lycée publique de Baguida sur la rte d''Afanoukopé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'HYGEA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-101', 'VERSEAU', '+22890019029', '92 05 23 49', 'Près de la maison Bateau Baguida', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'VERSEAU');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-102', 'HELENE', '+22896981515', '92 66 09 08', 'Aveta face au marché d'' Aveta', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'HELENE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-103', 'LUMEN', '+22870416836', NULL, 'DJAGBLE, En face de l’EPP (Plakomé)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LUMEN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-104', 'JEANNE D''ARC', '+22822220801', '90 86 40 51', 'Près de Marox-Renault-Star', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'JEANNE D''ARC');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-105', 'ETOILES', '+22822218847', '96 27 05 05', '10 Av. Nouvelle Marche', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ETOILES');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-106', 'AMESSIAME-BE', '+22896329760', '70 49 96 29', 'Marché de Bè', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AMESSIAME-BE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-107', 'DES APÔTRES', '+22870453805', NULL, '49, Bd Moboutou Sese Seko, Akodésséwa, non loin du Centre de Formation CAMA', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DES APÔTRES');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-108', 'OCEANE', '+22822226277', '96 75 25 02', 'Rue HOULATA, perpendiculaire rue de l''OCAM, face Hôtel de la PAIX', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'OCEANE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-109', 'ADJOLOLO', '+22870499500', '97 93 86 59', '1319, Rue de la Charité proche du CMS de Nyekonakpoe', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ADJOLOLO');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-110', 'HOPITAL', '+22822200808', '79 69 08 08', 'Face Hôpital CHU-Tokoin', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'HOPITAL');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-111', 'AMITIE', '+22822217447', '70 25 62 57', '72 Av. des Hydrocarbures (SOTED)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AMITIE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-112', 'CAMPUS', '+22896800885', '93 38 08 84', 'ADEWI - Boulevard de la Kara à côté de UTB', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CAMPUS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-113', 'BAH', '+22822260320', '90 55 79 59', 'Bd Zio, Face EPP Hédzranawé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BAH');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-114', 'CITRUS', '+22870445924', '96 80 09 03', 'Attiégou Carrefour DVA, Grand Contournement', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CITRUS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-115', 'ISIS', '+22870448387', NULL, 'Avenue Jean Paul II près des rails NUKAFU Gakpoto', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ISIS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-116', 'YEM-BLA', '+22822267651', '90 88 98 72', '258, Av. Akéï face à la Résidence', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'YEM-BLA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-117', 'FRATERNITE', '+22822268155', '96 80 09 19', 'Hédzranawé près de la Clinique St Joseph', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'FRATERNITE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-118', 'APOTHEKA', '+22822615775', '70 44 33 33', 'Face siège Fédération Togolaise de Football, route de Kegué', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'APOTHEKA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-119', 'MAWULE', '+22870459186', NULL, '54 Bd de l''OTI Rond Point Gakpoto, Bè-Kpota', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MAWULE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-120', 'FIDELIA', '+22822719595', '96 80 09 18', 'Bè-Kpota, Route d''Attiégou, près de l''hôtel "LE REFERENTIEL"', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'FIDELIA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-121', 'SARAH', '+22870426902', '72 33 51 58', '186 Bd MALFAKASSA , Face au centre de santé d''ADAKPAME 32 BP60', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SARAH');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-122', 'ELI-BERACA', '+22899911342', '99 69 89 21', 'Route d''Adidogomé, Immeuble SIKOVIC face bureau de poste', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ELI-BERACA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-123', 'LA REFERENCE', '+22896800996', '70 49 96 47', 'Route de Kpalimé, Adidogomé Assiyéyé, à côté du bar Madiba', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LA REFERENCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-124', 'BONTE', '+22822507431', '96 80 09 00', 'Route de SEGBE, Wonyomé-Adidogomé en face de la station Sanol', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BONTE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-125', 'AZUR', '+22890494456', '98 89 80 09', 'Apédokoè-Gbomamé, rte d''Atigangomé, Carrefour Obéna, près de l''eglise Pentécôte', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AZUR');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-126', 'AURORE', '+22892531293', '71 00 75 75', 'LANKOUVI, non-loin de l''école La divine providence', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AURORE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-127', 'JAHNAP', '+22822512286', '96 80 09 29', 'A côté de l''EPP Gakli, Djidjolé-Gakli, immeuble Favo', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'JAHNAP');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-128', 'CONFIANCE', '+22870157846', '91 01 33 28', 'Face GTA', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CONFIANCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-129', 'LUMIERE', '+22870431549', NULL, 'AGBALEPEDOGAN - Lossossime près du Rond Point de l''Œuf', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LUMIERE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-130', 'GROUPE C', '+22899982087', '92 33 49 76', 'Agbalépédogan face Clinique la VICTOIRE non loin de l''EPP Groupe C', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'GROUPE C');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-131', 'DES ORCHIDEES', '+22893431049', '99 01 03 74', 'AGOE-TELESSOU, LEO 2000', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DES ORCHIDEES');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-132', 'DE LA VICTOIRE', '+22870457492', '99 11 35 35', 'Avédji Wessomé, sur le Bd Faure Gnassingbé (voie douane d''Adidogomé - Carf Limousine), après les rails.', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DE LA VICTOIRE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-133', 'SOLIDARITE', '+22822503707', '96 80 09 76', 'Rue Avédji Limousine, Près de l''UTB Totsi BP : 8919 Lomé - TOGO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SOLIDARITE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-134', 'ARC-EN-CIEL', '+22870425000', '91 50 50 45', 'Agoè-Télessou, Carrefour Margot 05 BP 670 lomé-TOGO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ARC-EN-CIEL');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-135', 'SHALOM', '+22893587823', '70 49 96 51', 'Agoè-Cacavéli, non loin de BKS. Sur Bd Faure GNASSINGBE', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SHALOM');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-136', 'AGOE-NYIVE', '+22822258338', '91 61 02 62', 'A côté de l’Eglise Catholique d’Agoè-Nyivé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AGOE-NYIVE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-137', 'SALA HOUBEIDA', '+22891911535', NULL, 'Agoè Kelegougan (Koffi Panou, Carrefour O''queens)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SALA HOUBEIDA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-138', 'TAKOE', '+22891551804', '96 80 09 77', 'Avant la station CAP ESSO de Zongo (côté opposé)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'TAKOE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-139', 'ZONGO', '+22870499655', '99 99 22 39', 'Togblékopé carrefour Hermann entre Orabank et la station Sanol Togblékopé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ZONGO');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-140', 'ELEMAWUSSI', '+22892340680', '97 67 09 37', 'Adétikopé, Médina, Nationale N°1, avant PIA (Plateforme Industrielle)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ELEMAWUSSI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-141', 'SATIS', '+22870448517', NULL, 'Agoè-Logopé face CEG Agoègnivé Ouest (Kossigan) sur la rue de 50m', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SATIS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-142', 'DAFEANNE', '+22870776942', '92 62 44 44', 'Agoè-sogbossito,Route reliant le contournement au camp GP,à 300m de l''espace de loisirs privilège plus.', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DAFEANNE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-143', 'CHARITE', '+22822251260', '90 65 21 90', 'A côté du CEG d''Agoè-Nyivé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CHARITE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-144', 'MAA-LA', '+22890106092', '22 51 07 80', 'Agoè Demakpoè à côté de AZ Batiment non loin de l''école la Référence', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MAA-LA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-145', 'SANGUERA', '+22870428080', '99 90 89 72', 'Près du lycée Sanguera', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SANGUERA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-146', 'SAG''BIBA', '+22891838783', '22 55 73 17', 'AGOE-Nanegbe à côté de la station T-Oil', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SAG''BIBA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-147', 'LA SHEKINAH', '+22893339205', '96 40 17 17', 'AGOE-NYIVE Qt Atiomé carrefour Amadenta', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LA SHEKINAH');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-148', 'NELLY''S', '+22892011100', '99 90 90 80', 'Klémé Agokpanou, non loin du château d''eau, sur la voie de Ségbé à Sanguéra', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'NELLY''S');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-149', 'MAWUNYO', '+22870423464', NULL, 'AGOE-Sogbossito, route de Mission TOVE en face de la station OANDO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MAWUNYO');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-150', 'M''BA', '+22870278181', '99 76 81 81', 'Agoè-Légbassito. Route de Mission Tové, 300 mètres après le marché de Légbassito', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'M''BA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-151', 'TRIOMPHE', '+22893258036', '91 00 11 91', 'Quartier Bokpokor,Route contournement,300m de carrefour kpala', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'TRIOMPHE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-152', 'VERONIQUE', '+22892034040', '96 68 53 53', 'Avépozo en face de l''école nationale de gendarmerie D''Avépozo', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'VERONIQUE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-153', 'LE DESTIN', '+22870411541', NULL, 'A côté de l''Agence ECOBANK de Baguida', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LE DESTIN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-154', 'SAINTE MARIE', '+22892859794', '22 60 46 97', 'DJAGBLE, Non loin du marché d’Avéta (Adja Adoté-kopé)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SAINTE MARIE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-155', 'SAINT PIO', '+22893404040', '96 86 86 86', 'KLOBATEME, non loin du CMS Klobatèmé et près du complexe scolaire Le Bon Samaritain', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SAINT PIO');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-156', 'BON PASTEUR', '+22822211367', '91 43 44 84', '44 Av. de la libération, en face de Brother Home', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BON PASTEUR');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-157', '3IEME ARRONDISSEMENT', '+22822215227', '96 32 97 71', 'Bd. du 13 Janvier, près de l''Immeuble FIATA', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = '3IEME ARRONDISSEMENT');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-158', 'BIOVA', '+22822345093', '70 23 19 23', 'Bd. Houphët-Boigny', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BIOVA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-159', 'PORT', '+22822276188', '70 41 54 53', 'Face Hôtel Sarakawa', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'PORT');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-160', 'OCAM', '+22822216205', '92 85 99 55', 'Rue de l''ENTENTE', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'OCAM');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-161', 'HORIZON', '+22822204242', '90 56 52 56', '165, Bd du 13 janvier Nyékonakpoè. Face Sapeurs-Pompiers à côté de l''immeuble A.AC.', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'HORIZON');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-162', 'JUSTINE', '+22896800931', '22 21 00 01', '291, Bd des Armées - Tokoin Habitat', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'JUSTINE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-163', 'AGBEGNIGAN', '+22870200000', '96 77 33 33', 'Tokoin Ramco - Gbadago, Av. de la Libération, près du PRÊT À MANGER', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AGBEGNIGAN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-164', 'BON SECOURS', '+22870457674', '96 80 08 83', 'Rue du Grand Collège du Plateau - Cassablanca', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BON SECOURS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-165', 'NOTRE DAME', '+22896801012', NULL, 'Rte de l''Aéroport entre la foire TOGO 2000 et l''Aéroport', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'NOTRE DAME');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-166', 'LA PROSPERITE', '+22896800991', '70 44 86 96', 'Bd Eyadéma entre l''immeuble EDA OBA et la Direction Police Judiciaire (DPJ)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LA PROSPERITE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-167', 'MADINA', '+22891183333', '99 99 78 58', 'WUITI en face de la cité de la CNSS à côté de UTB Novissi', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MADINA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-168', 'ST PIERRE', '+22822261973', '70 43 26 67', 'Sagboville Hédzranawé. Boulevard Haho', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ST PIERRE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-169', 'DEO GRATIAS', '+22896285713', '96 80 08 93', 'Rue Notre Dame de la Miséricorde KEGUE DINGBLE', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DEO GRATIAS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-170', 'PEUPLE', '+22822613729', '98 25 04 86', 'Rue Santiagou, près du marché NUKAFU 06 BP 61217 Lomé 06', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'PEUPLE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-171', 'BA-AYETA', '+22897726969', '71 32 33 33', 'KEGUE, Zogbédji non loin de la station NRL( ancienne station Ouando)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BA-AYETA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-172', 'O GRAIN D''OR', '+22871901166', '22 71 90 06', 'Ahadji - Kpota, Rue Carrefour Zorrobar, Grand Contournement, Lomé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'O GRAIN D''OR');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-173', 'SEPOPO', '+22870346565', '79 50 80 41', 'ADAKPAME grand contournement, rond point Sawleto non loin de la station Somayaf', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SEPOPO');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-174', 'PHARMACIE 2000', '+22896379425', '22 70 85 87', 'BE KPOTA près du Marché Dzifa', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'PHARMACIE 2000');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-175', 'BETHEL', '+22822252370', '91 86 29 87', 'ADIDOGOME Soviépé, bd du 30 Août, face OraBank et Banque Atlantique', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BETHEL');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-176', 'DES ECOLES', '+22822517575', '96 80 09 14', 'Face Lycée Technique Adidogomé et près du CEG, Route de Kpalimé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DES ECOLES');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-177', 'EL-NISSI', '+22899733932', '70 17 97 08', 'Rte Lomé-Kpalimé, carrefour Apédokoè-Gbomamé à 200 m de la station total d''Apédokoè', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EL-NISSI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-178', 'HOSANNA', '+22897776959', '92 53 50 00', 'Carrefour Sagbado-Sémékonawo, en face de la station service SANOL', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'HOSANNA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-179', 'MAGNIFICAT', '+22870445159', '93 29 07 37', 'Adidogomé yokoè Agblégan, rue de la pampa  à 100m du palais royal de Yokoè', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MAGNIFICAT');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-180', 'GREENRX', '+22892961919', '22 55 61 88', 'Segbe dans l''immeuble Mabiz Plaza Non loin du Rond point Douane', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'GREENRX');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-181', 'MATHILDA', '+22893025212', NULL, 'Route PATASSE - Lomégan - ODEF', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'MATHILDA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-182', 'EL-SHADAI', '+22822514425', '96 80 09 10', 'Face Ecole Théologie ESTAO', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EL-SHADAI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-183', 'ENOULI', '+22822558646', '93 63 29 29', 'Derrière la gare routière d''Agbalepedogan 05 BP 633', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ENOULI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-184', 'LE GALIEN', '+22822517171', '96 80 09 21', 'Rue Pavée d''Adidoadin', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LE GALIEN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-185', 'DES ROSES', '+22870423772', '96 80 09 62', 'AGOE - Vakpossito, près de l''entreprise de l''Union', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'DES ROSES');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-186', 'BETANIA', '+22896801011', '70 43 89 40', 'Rue Sito, Totsi-Glenkomé non loin de la salle des Témoins de Jéhovah', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BETANIA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-187', 'VOLONTAS DEI', '+22870422360', '91 21 25 97', 'Avédji, Carrefour  "SUN CITY", face à l''ancien bar Sun City', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'VOLONTAS DEI');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-188', 'EL-SHAMMAH', '+22870432585', '22 25 88 42', 'Sise à Amadahomé à côté de la Maison des Jeunes 04BP: 1004', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EL-SHAMMAH');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-189', 'NOTRE DAME DE LOURDES', '+22870440101', '96 80 10 19', 'Carrefour Maison Blanche en allant à "Deux Lions" en face de STAM', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'NOTRE DAME DE LOURDES');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-190', 'LA GRÂCE', '+22822259165', '90 56 16 81', 'Près de l’Auberge Sahara avant la Station SUN AGIP Agoè', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LA GRÂCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-191', 'REGINA PACIS', '+22870459858', '96 55 71 55', 'ADETIKOPE, Rte National N°1 près du bar Sous l''Antenne', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'REGINA PACIS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-192', 'ESPACE VIE', '+22899858907', NULL, 'AGOE Logopé non loin de place de Loisir BKS 2', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ESPACE VIE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-193', 'AUREOLE', '+22870709898', '96 89 96 96', 'Agoè Trokpossimé au carrefour camp GP à 50m de l''EPP du camp GP', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'AUREOLE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-194', 'EMMAÜS', '+22870402540', '96 80 09 12', 'Sur la route de Mission Tové à côté du bar Solidarité', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'EMMAÜS');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-195', 'BAGUIDA', '+22870424777', NULL, 'Face CMS de Baguida', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BAGUIDA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-196', 'LA FLAMME D''AMOUR', '+22870457014', NULL, 'Qt. Bobole kope / Kpogan Non Loin du cimétière Zogbedjimonou de Kpogan', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LA FLAMME D''AMOUR');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-197', 'LA PATIENCE', '+22870052339', '96 12 26 06', 'DJAGBLE, A 300 mètres du CMS (Ayokléfé)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LA PATIENCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-198', 'CRISTAL', '+22822209091', '70 44 40 18', 'Face EPP BE-AKLASSOU, BOULEVARD (Bd) Felix H.BOIGNY', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'CRISTAL');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-199', 'BE-KPEHENOU', '+22870442503', '96 80 09 34', 'Boulevard Félix HOUPHOUET BOIGNY Lomé-Bè à côté de l''agence UTB de Bè,07 BP 12470 Lomé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BE-KPEHENOU');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-200', 'ESPERANCE', '+22822210128', NULL, 'Av F.J. STRAUSS, Face Ecole Française Nyékonakpoè (Rue Adjololo)', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ESPERANCE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-201', 'ROBERTSON', '+22822222841', NULL, '607, Avenue François MITTERAND Nyékonakpoè', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ROBERTSON');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-202', 'RAOUDHA', '+22891613332', '70 51 66 21', 'Située au 4495 Boulevard Zio Hédzranawoe, derrière TOGO 2000', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'RAOUDHA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-203', 'N.D. DE LA TRINITE', '+22898465088', '93 69 22 34', 'Sise au 20 boulevard de la Paix à Super Taco', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'N.D. DE LA TRINITE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-204', 'FOREVER', '+22822261177', '91 00 29 17', '01 BP 4884 Lomé 1-TOGO-52 Avenue des Kondona, face Garage Central Administratif', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'FOREVER');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-205', 'SANTA MADONNA', '+22870010303', '96 68 03 03', 'Kégué, face maison Kader Coubadja & Eglise catholique Ste Thèrèse', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'SANTA MADONNA');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-206', 'BIEN ETRE', '+22822264516', '70 54 29 07', '100, bd du haho, hedzranawoe, à côté de la station d''essence total', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BIEN ETRE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-207', 'KELEGOUGAN', '+22892953838', '99 78 23 23', 'AGOE-Kelegougan,Voie du contournement, à 100m de la station TOTAL Kelegougan et du bar Obrigado', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'KELEGOUGAN');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-208', 'LA RUCHE', '+22891541616', '99 41 52 52', 'Attiégou derrière la clôture de l’aéroport voie menant au Grand Contournement, non loin de l’école les Savoirs', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'LA RUCHE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-209', 'BOULEVARD', '+22822216549', '90 89 28 49', 'Bd. Du 13 Janv. Doulassamé', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'BOULEVARD');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-210', 'HANOUKOPE', '+22870499663', '96 80 09 26', 'Avenue de la Nouvelle Marche, Immeuble Radio Kanal FM', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'HANOUKOPE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-211', 'KODJOVIAKOPE', '+22822218990', '22 20 44 71', 'Avenue Duisbourg', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'KODJOVIAKOPE');

INSERT INTO "Pharmacy" (id, name, phone1, phone2, address, city, "isActive", "createdAt", "updatedAt")
SELECT 'pharmacy-212', 'ST ESPRIT', '+22870402906', NULL, 'Sur la bretelle Agoè-Nyivé Kégué, Face au CEG Agoè-Est', 'Lomé', TRUE, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Pharmacy" WHERE name = 'ST ESPRIT');

-- ─── 2. Insertion des comptes pharmaciens (table "User") ────
-- role='pharmacist', mot de passe hashé avec bcrypt (12 rounds).
-- Le "pharmacyId" est résolu via sous-requête : on pointe vers
-- l'ID de la pharmacie existante (par nom) ou vers l'ID qu'on vient
-- d'insérer ci-dessus ('pharmacy-XXX').

INSERT INTO "User" (id, phone, "passwordHash", "fullName", role, "pharmacyId", "isActive", "createdAt", "updatedAt")
VALUES
  ('pharma-001', '+22870449137', '$2b$12$fzBFF0lv7oZSXSlNN/SDRu2A4BqPQrQlSjHv40ljsk7HTs/LAS1JW', 'Pharmacie SANTE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SANTE' LIMIT 1), 'pharmacy-001'), TRUE, now(), now()),
  ('pharma-002', '+22822210097', '$2b$12$OjPiGu9HTZKmZ6NhNh54M.4OXo45g.vvL/ZZGRrsncywPS61N3Q9S', 'Pharmacie AKOFA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AKOFA' LIMIT 1), 'pharmacy-002'), TRUE, now(), now()),
  ('pharma-003', '+22822218330', '$2b$12$tRpFpX1avUCK7ekwdP1XiOwlr7it6..w6..OcaYsB4cgon06KpKOW', 'Pharmacie CENTRE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CENTRE' LIMIT 1), 'pharmacy-003'), TRUE, now(), now()),
  ('pharma-004', '+22822214530', '$2b$12$1/d3jVrWmdmMLzyIGF8bCun2IQqLAtKGHCzYnKRWkJUUgWlgeDmmS', 'Pharmacie BON SAMARITAIN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BON SAMARITAIN' LIMIT 1), 'pharmacy-004'), TRUE, now(), now()),
  ('pharma-005', '+22896800906', '$2b$12$mvzWRD74amqJY5u8uWE0nuUfzNITs3sR8eCCVZV/L667tLtXmoVYK', 'Pharmacie ECLAIR', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ECLAIR' LIMIT 1), 'pharmacy-005'), TRUE, now(), now()),
  ('pharma-006', '+22822212639', '$2b$12$nVAfB90T.PXdQcFwIQlbOexSrO0Wy0YfqMqByG36.D6Co/0BhGK9C', 'Pharmacie DE LA MAIRIE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DE LA MAIRIE' LIMIT 1), 'pharmacy-006'), TRUE, now(), now()),
  ('pharma-007', '+22822214846', '$2b$12$YDNdg5AUkxu2/mJ4HkpkEedQrkBgYhrGIJy3y67GR5mn2EkkM3HGi', 'Pharmacie DE LA MARINA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DE LA MARINA' LIMIT 1), 'pharmacy-007'), TRUE, now(), now()),
  ('pharma-008', '+22822223301', '$2b$12$0yKL6gcBDBmilepnCTP8p.WJAxcN8FHE6ifThyXDP7l2ZCwbzOf0S', 'Pharmacie AVE MARIA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AVE MARIA' LIMIT 1), 'pharmacy-008'), TRUE, now(), now()),
  ('pharma-009', '+22822222525', '$2b$12$E9TB38oKiDFDqQ96xaf9geXueqpDZc2vM.u07pszrf5aKzx5IPffa', 'Pharmacie LIBERATION', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LIBERATION' LIMIT 1), 'pharmacy-009'), TRUE, now(), now()),
  ('pharma-010', '+22822225050', '$2b$12$rUfDco52SidpR9GDlXfDyO947yf61AgzlOSFkEBGL2.5KJe5Y9o0q', 'Pharmacie GBOSSIME', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'GBOSSIME' LIMIT 1), 'pharmacy-010'), TRUE, now(), now()),
  ('pharma-011', '+22896801003', '$2b$12$SoSMxJQpw28tbypn82zkMeG68J4LHMQaA.jb33zfedJffH3IbO6ve', 'Pharmacie KLOKPE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'KLOKPE' LIMIT 1), 'pharmacy-011'), TRUE, now(), now()),
  ('pharma-012', '+22891148888', '$2b$12$66ygmcZ8SSkfHOlx1Y8.TuNKN7kbGVxRHU.aVOHT.PHnAdxxlpKzO', 'Pharmacie PROVIDENCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'PROVIDENCE' LIMIT 1), 'pharmacy-012'), TRUE, now(), now()),
  ('pharma-013', '+22822618143', '$2b$12$5Ao1x4f6JhEUA9RBNgXUOOJym/2dZ2moJuW16haAzGW/L6yAzYBAy', 'Pharmacie UNIVERS-SANTE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'UNIVERS-SANTE' LIMIT 1), 'pharmacy-013'), TRUE, now(), now()),
  ('pharma-014', '+22822262122', '$2b$12$XWqSncQY5dHkK8EOZWVci.mbcUc37ICgKVkXtMrBZ.HgJitHB9Pe6', 'Pharmacie AEROPORT', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AEROPORT' LIMIT 1), 'pharmacy-014'), TRUE, now(), now()),
  ('pharma-015', '+22822268994', '$2b$12$ke1eBwUt.8WSCoUnKjvcKOXBWAXLN6RbyvwbWmw7A46r7.tCniTTG', 'Pharmacie INTERNATIONALE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'INTERNATIONALE' LIMIT 1), 'pharmacy-015'), TRUE, now(), now()),
  ('pharma-016', '+22896165589', '$2b$12$46HeompLpDGrzZ9wL6Kl2uCzfOhtUA29BYgeRqh7iCRrJhTd0lpc.', 'Pharmacie DES LILAS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DES LILAS' LIMIT 1), 'pharmacy-016'), TRUE, now(), now()),
  ('pharma-017', '+22822274666', '$2b$12$fEkaIzH74QMKe1lkMer0Besqm2t88w4BMMJp38uWtTtUsYCpODC.e', 'Pharmacie CHRIST-ROI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CHRIST-ROI' LIMIT 1), 'pharmacy-017'), TRUE, now(), now()),
  ('pharma-018', '+22822276019', '$2b$12$UIVgknf8hDNhw3JWiqljcu3Y0meitA3fIY/4zsU4jCitRCPjVId.q', 'Pharmacie MAËLYS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MAËLYS' LIMIT 1), 'pharmacy-018'), TRUE, now(), now()),
  ('pharma-019', '+22896800945', '$2b$12$8DXfoYqi2NA4Sq98.Zzck.yEVnw/gtaOtvfrQnIwQr4DpeDXJjbca', 'Pharmacie MISERICORDE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MISERICORDE' LIMIT 1), 'pharmacy-019'), TRUE, now(), now()),
  ('pharma-020', '+22822250125', '$2b$12$nA8akWUGwOC6BOlrS5tiyOyR1mo7xFkZ0bZonS6aA5FrxcHxaokoS', 'Pharmacie DE LA CITE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DE LA CITE' LIMIT 1), 'pharmacy-020'), TRUE, now(), now()),
  ('pharma-021', '+22870401052', '$2b$12$FIq6RyhIQ0a9xQ0pnpyNl.DyPsI.0/Akkhia6B.lHdt.KwSJAVImi', 'Pharmacie EPIPHANIA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EPIPHANIA' LIMIT 1), 'pharmacy-021'), TRUE, now(), now()),
  ('pharma-022', '+22822510529', '$2b$12$7j2ezZE/phj.b5EAnYEVferoevGHed607kzb4paylBnjAsMrFX8jq', 'Pharmacie BESDA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BESDA' LIMIT 1), 'pharmacy-022'), TRUE, now(), now()),
  ('pharma-023', '+22893109292', '$2b$12$FbMUH8YAjHeLXCLuxm7Zae8tQnhowBzC37bHiA/RGLk2o50EQFT5y', 'Pharmacie CONSEIL', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CONSEIL' LIMIT 1), 'pharmacy-023'), TRUE, now(), now()),
  ('pharma-024', '+22870291677', '$2b$12$4CtxzJltsyt65kfFbBUcN.fe.1T.QH2BQhA1vHbNjtqPVXXD0FNk.', 'Pharmacie DODJI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DODJI' LIMIT 1), 'pharmacy-024'), TRUE, now(), now()),
  ('pharma-025', '+22822519171', '$2b$12$71yF5BnKd5G7JUTTu7MvceuVwsbueaUrEbkAVYGUSU5X94YyLY6oq', 'Pharmacie POINT E', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'POINT E' LIMIT 1), 'pharmacy-025'), TRUE, now(), now()),
  ('pharma-026', '+22822250326', '$2b$12$u0oQZOmgtmz7UbgQDyybHuOdQfL0eTCY4Kj5a4LEScH74Cb86VQgu', 'Pharmacie VERTE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'VERTE' LIMIT 1), 'pharmacy-026'), TRUE, now(), now()),
  ('pharma-027', '+22893645372', '$2b$12$jzSkt1afiwrroWpq6ayMSedcVvzodUGHbh/GdpsuPjV3eoQCBUwxS', 'Pharmacie DELALI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DELALI' LIMIT 1), 'pharmacy-027'), TRUE, now(), now()),
  ('pharma-028', '+22822259965', '$2b$12$66gXYNn1HVHuY1CRvQVTh./a7Oi62E1az9KFXjYpsMk8X12Xo8ye2', 'Pharmacie NATION', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'NATION' LIMIT 1), 'pharmacy-028'), TRUE, now(), now()),
  ('pharma-029', '+22822251505', '$2b$12$43okp7nQ3QOrkbBr.0p/5.wjICs0jhThqmm7TDWaNKxuRgya1U9pe', 'Pharmacie LAUS DEO', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LAUS DEO' LIMIT 1), 'pharmacy-029'), TRUE, now(), now()),
  ('pharma-030', '+22870402286', '$2b$12$qb3bCR.F/2uFT9TyQNw4veiQHQ0zrPpU3Tr71SO/.kt.3cNvcNxs2', 'Pharmacie VITAFLORE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'VITAFLORE' LIMIT 1), 'pharmacy-030'), TRUE, now(), now()),
  ('pharma-031', '+22870436534', '$2b$12$TuesX9Myw9cSyTTMzdSKTeUxMBZ4meSKr06uEWIlVX6lDZMFDJXgm', 'Pharmacie MAINA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MAINA' LIMIT 1), 'pharmacy-031'), TRUE, now(), now()),
  ('pharma-032', '+22870393939', '$2b$12$wo.QcYq6N9fIvFtb5Z1Roemz31qhS112FKxT8F.Bp7UI.Na/7mG8i', 'Pharmacie ADOUNI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ADOUNI' LIMIT 1), 'pharmacy-032'), TRUE, now(), now()),
  ('pharma-033', '+22891684804', '$2b$12$irp83YBoDBkMdU6M9hmJBOXS4/ZKUlJJueUjroGWSyt1wtJW1BZHy', 'Pharmacie IRIS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'IRIS' LIMIT 1), 'pharmacy-033'), TRUE, now(), now()),
  ('pharma-034', '+22893362626', '$2b$12$m5wcJW9A2QTe89jHfXXtd.cPTsfDGX0.8pt.1gjS578o1mo59Xjq6', 'Pharmacie NABINE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'NABINE' LIMIT 1), 'pharmacy-034'), TRUE, now(), now()),
  ('pharma-035', '+22822500405', '$2b$12$YvPmvXz7qOAzdixx3WAJPO3V5Ys4iYpGJx0RM2QtUypteSlA3SsAq', 'Pharmacie ADONAÏ', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ADONAÏ' LIMIT 1), 'pharmacy-035'), TRUE, now(), now()),
  ('pharma-036', '+22870429441', '$2b$12$kBGHrO8C2dFzUpq1yFJ3VuGL0gha4WvCRqNp5l.uMm5a8e7kbwe2K', 'Pharmacie TCHEP''SON', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'TCHEP''SON' LIMIT 1), 'pharmacy-036'), TRUE, now(), now()),
  ('pharma-037', '+22870901960', '$2b$12$GYDTOtRQ0UjsaHz1JvG5SOK.UH.UJf3zk/VUC/ume4pWRiWkbsLQe', 'Pharmacie LIDDY', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LIDDY' LIMIT 1), 'pharmacy-037'), TRUE, now(), now()),
  ('pharma-038', '+22890885588', '$2b$12$i0zOJ46P/C7vRorcS.yYbev6EQffFY4UM/DhB6Fp0uqx13kyyAtGa', 'Pharmacie AMEN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AMEN' LIMIT 1), 'pharmacy-038'), TRUE, now(), now()),
  ('pharma-039', '+22893839100', '$2b$12$OiTferjZiWVP7KL2Dc3RTuv4wzr1kBnlzJejt6C7cwCiH54u92mxS', 'Pharmacie DIVINA GRACIA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DIVINA GRACIA' LIMIT 1), 'pharmacy-039'), TRUE, now(), now()),
  ('pharma-040', '+22890174928', '$2b$12$vXRglnJX1mO4prGxLbGtHud0MDqtJgsflQskligj36Ofr/90DndVu', 'Pharmacie LA BARAKA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LA BARAKA' LIMIT 1), 'pharmacy-040'), TRUE, now(), now()),
  ('pharma-041', '+22822502447', '$2b$12$Dmm/QY6ga870YEjyhb.cV.X3690lHcYAMWumsEFve5n/r5.0uRxT6', 'Pharmacie EXCELLENCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EXCELLENCE' LIMIT 1), 'pharmacy-041'), TRUE, now(), now()),
  ('pharma-042', '+22822256343', '$2b$12$d/fnGmkPR31TiBGKZ8wRluxOfQTGOtl62NHsLvOEcqXGMvMFMEqz2', 'Pharmacie VITAS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'VITAS' LIMIT 1), 'pharmacy-042'), TRUE, now(), now()),
  ('pharma-043', '+22822554352', '$2b$12$0pLYMMQ7tERDxtE97nHOteC11RA08n5SivnPAbsO5SMmuew5WuxXK', 'Pharmacie ZOSSIME', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ZOSSIME' LIMIT 1), 'pharmacy-043'), TRUE, now(), now()),
  ('pharma-044', '+22893515198', '$2b$12$NQ2.Me/TdX0mrXLgG44Pp.ejQZ4taNLqBujcyHJStDghIB41JJ1se', 'Pharmacie SAINT SYLVESTRE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SAINT SYLVESTRE' LIMIT 1), 'pharmacy-044'), TRUE, now(), now()),
  ('pharma-045', '+22890673324', '$2b$12$gk4XCaPMCKtgWIp5HlD5KeLbcbGGecZMElbb8BnX8PiCb/xpr7XQW', 'Pharmacie ST PHILIPPE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ST PHILIPPE' LIMIT 1), 'pharmacy-045'), TRUE, now(), now()),
  ('pharma-046', '+22892163232', '$2b$12$TJ2Ja6.xmNHufuWEs2GcyeU8sASl/v3.VneEBk1GuVuSmiOv2S9R2', 'Pharmacie EVA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EVA' LIMIT 1), 'pharmacy-046'), TRUE, now(), now()),
  ('pharma-047', '+22899470070', '$2b$12$CdqrdfSa/sBbW2raSnzK5O3M.Qs6BHObLqaWgbVOcORH2xoq4c5Sa', 'Pharmacie NOUVELLE TULIPE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'NOUVELLE TULIPE' LIMIT 1), 'pharmacy-047'), TRUE, now(), now()),
  ('pharma-048', '+22892189485', '$2b$12$tRW49atAllrXHcKJ/rzfkuh/wt3aul40.uEnuFSfGFU4dwRxBFCQi', 'Pharmacie GRATITUDE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'GRATITUDE' LIMIT 1), 'pharmacy-048'), TRUE, now(), now()),
  ('pharma-049', '+22870421398', '$2b$12$fBrCSNmjJ7WZX4f/AFcU6OBmF/cALdXVWd3opMaJkkNFmfsIszBUC', 'Pharmacie DE L''EDEN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DE L''EDEN' LIMIT 1), 'pharmacy-049'), TRUE, now(), now()),
  ('pharma-050', '+22822270486', '$2b$12$8ppnq8g39qObPHN.jb/wC.SzM5tbUHLIq/JpMgcYqKmGGAfXg3/Vy', 'Pharmacie AVEPOZO', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AVEPOZO' LIMIT 1), 'pharmacy-050'), TRUE, now(), now()),
  ('pharma-051', '+22890826767', '$2b$12$GHnzgW0Fm/LnG2wZ6qBFXO2JOZxW5ClEOxPWSOvGRcIq1kFXoULDa', 'Pharmacie PRINCIPALE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'PRINCIPALE' LIMIT 1), 'pharmacy-051'), TRUE, now(), now()),
  ('pharma-052', '+22892620651', '$2b$12$x5YSq6JdpvQ1mYeY6o2zGODPK/BJz2FdeS5jIwhukkrXh5lf23GTG', 'Pharmacie SIKA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SIKA' LIMIT 1), 'pharmacy-052'), TRUE, now(), now()),
  ('pharma-053', '+22890413402', '$2b$12$Ld19FgjLzzyM7RyUQHoYI.wz1R5t9Hgk3gmuxyKSBTcAQaTruWgDW', 'Pharmacie AJP-ABOLAVE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AJP-ABOLAVE' LIMIT 1), 'pharmacy-053'), TRUE, now(), now()),
  ('pharma-054', '+22822210321', '$2b$12$ZppZd.l6M2xbvH9gWH0AcOAgWraA219LcaT5MN6O74lDvCP2UMlYy', 'Pharmacie BEL AIR', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BEL AIR' LIMIT 1), 'pharmacy-054'), TRUE, now(), now()),
  ('pharma-055', '+22822212964', '$2b$12$/4gGeHJf7zBq6Z5oZIa.JeD5zglrIrtbj3wsW8UKrhEsKt8JkFpfy', 'Pharmacie MATTHIA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MATTHIA' LIMIT 1), 'pharmacy-055'), TRUE, now(), now()),
  ('pharma-056', '+22896800970', '$2b$12$t7jgVXJ4R7FwGAWcBmaMG.84mJfM1hN5rxIShWiN.j30OvgrreVjC', 'Pharmacie STE RITA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'STE RITA' LIMIT 1), 'pharmacy-056'), TRUE, now(), now()),
  ('pharma-057', '+22871338888', '$2b$12$gsP.v/b/nC4SCp1pG9Llf.BpZF6.kRCHxYk.kAeG3VgoUGPPJLgii', 'Pharmacie CHÂTEAU-D''EAU', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CHÂTEAU-D''EAU' LIMIT 1), 'pharmacy-057'), TRUE, now(), now()),
  ('pharma-058', '+22822270434', '$2b$12$Ro8B7LobSv8r55FxdfJMJ.mQ1XaVGfP4b.EQf/tgdGOm/pWijEhY2', 'Pharmacie OLIVIERS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'OLIVIERS' LIMIT 1), 'pharmacy-058'), TRUE, now(), now()),
  ('pharma-059', '+22822213098', '$2b$12$3jXYsVhVeJZFE2HPJoSWXeQ/jUPHKX8IP7W9ujJVWjwLZZLamBxYS', 'Pharmacie EMMANUEL', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EMMANUEL' LIMIT 1), 'pharmacy-059'), TRUE, now(), now()),
  ('pharma-060', '+22822202759', '$2b$12$cG9VedVurjmqeZjtpAq/wuvugakUG4aBm0L6CQinjIqagD02jmtEa', 'Pharmacie SOURCE DE VIE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SOURCE DE VIE' LIMIT 1), 'pharmacy-060'), TRUE, now(), now()),
  ('pharma-061', '+22822219963', '$2b$12$ZJywCDn.k0k1l9UoTOynzOWSq2vmYj5tWBivk761J42qB6AZ0uPFW', 'Pharmacie ST KISITO', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ST KISITO' LIMIT 1), 'pharmacy-061'), TRUE, now(), now()),
  ('pharma-062', '+22870448177', '$2b$12$c8JHJN7uaCKUxq0V7ZxgeerNxz3yBICOnp6FVGpwLfUmNJPsqDzua', 'Pharmacie THERYA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'THERYA' LIMIT 1), 'pharmacy-062'), TRUE, now(), now()),
  ('pharma-063', '+22896800967', '$2b$12$ZLaCNJYuf6O.LlDfgu2gaObb0guxuPjZtSvZbpXxDS8eHJ6U8PZe6', 'Pharmacie ST PAUL', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ST PAUL' LIMIT 1), 'pharmacy-063'), TRUE, now(), now()),
  ('pharma-064', '+22822615614', '$2b$12$KUwuSbF/Xzn0PG0v1oxotOeyoQy2C0Upf8PQswZY4yPze3TcRidda', 'Pharmacie LE JOURDAIN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LE JOURDAIN' LIMIT 1), 'pharmacy-064'), TRUE, now(), now()),
  ('pharma-065', '+22896800927', '$2b$12$eYJhIw6vsQCbN1Nbv90in.8ALST2pyW8pan184gw7hoT4fekZpsbq', 'Pharmacie HEDZRANAWE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'HEDZRANAWE' LIMIT 1), 'pharmacy-065'), TRUE, now(), now()),
  ('pharma-066', '+22896801001', '$2b$12$d1UOgITTyQ2ezfBaBivAM.vIKVmnRfJ5tmW/WKe1O.iqanJZMF0YK', 'Pharmacie KOUESSAN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'KOUESSAN' LIMIT 1), 'pharmacy-066'), TRUE, now(), now()),
  ('pharma-067', '+22896443108', '$2b$12$mzfkCY5WDbHanxOZkqQcheBv/U3.BRUtsm/Lszx64Vp3wm9a.A16S', 'Pharmacie J-MIMSHAK', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'J-MIMSHAK' LIMIT 1), 'pharmacy-067'), TRUE, now(), now()),
  ('pharma-068', '+22822277164', '$2b$12$mxLZQ4XRf4VbbQvjXLpAlez4uLuJxwLgoY6vQok39XQJ9vzb68F0q', 'Pharmacie UNION', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'UNION' LIMIT 1), 'pharmacy-068'), TRUE, now(), now()),
  ('pharma-069', '+22870458655', '$2b$12$zlOUKriDbcpCIZQumjZfv.j.uXXlILTYxAjRCTdole1FR8ypA/Rru', 'Pharmacie LE PROGRES', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LE PROGRES' LIMIT 1), 'pharmacy-069'), TRUE, now(), now()),
  ('pharma-070', '+22822511891', '$2b$12$X2qxAnOQr0s2BaatygdNqu81jVkXOM27VcBOrln0JEU02Y4GSMMAS', 'Pharmacie ADIDOGOME', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ADIDOGOME' LIMIT 1), 'pharmacy-070'), TRUE, now(), now()),
  ('pharma-071', '+22890802639', '$2b$12$HgWBWyuAchrNlgWBAt6rDOnh3WHtq.zwJBX7A2eyeU0KHc0lWQHPG', 'Pharmacie SILOE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SILOE' LIMIT 1), 'pharmacy-071'), TRUE, now(), now()),
  ('pharma-072', '+22890614644', '$2b$12$PxbEplyz9aBo7hkJeY2EwulciXfCva3uLCsc7zbw8aNVcaFDabCWe', 'Pharmacie ACTUELLE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ACTUELLE' LIMIT 1), 'pharmacy-072'), TRUE, now(), now()),
  ('pharma-073', '+22892594935', '$2b$12$hsKqSWbL/shZoPFr9sqPyeoycqKuw1WTg6Mo4/ydqsqQ3EN3/PGku', 'Pharmacie SEGBE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SEGBE' LIMIT 1), 'pharmacy-073'), TRUE, now(), now()),
  ('pharma-074', '+22892611700', '$2b$12$O9mCRtj7ZqMqA8QJVYcYc.7.2WdF4SoG3Jg.K.s5A7uBOzvcx0vie', 'Pharmacie WASTINE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'WASTINE' LIMIT 1), 'pharmacy-074'), TRUE, now(), now()),
  ('pharma-075', '+22822256512', '$2b$12$qML9QC3.DiHmrCxsL8RlGu7WW7FkpKIYnyQcpSMM3502Wpxqe4TWO', 'Pharmacie DJIDJOLE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DJIDJOLE' LIMIT 1), 'pharmacy-075'), TRUE, now(), now()),
  ('pharma-076', '+22822257465', '$2b$12$NwgLIFQ987ojjhprfh53YezCDUDgeLfw0LLVCZEFPkrzr8pJ/Szj.', 'Pharmacie ST JOSEPH', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ST JOSEPH' LIMIT 1), 'pharmacy-076'), TRUE, now(), now()),
  ('pharma-077', '+22822516330', '$2b$12$T7X0I8yD2kpDZqG4DzXS1OXh85yc2LkV22Ne76DQaGGBURoi/8gCe', 'Pharmacie VIGUEUR', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'VIGUEUR' LIMIT 1), 'pharmacy-077'), TRUE, now(), now()),
  ('pharma-078', '+22870213197', '$2b$12$mzVkBf9iSrGmu5mpv.wdUegefBViGYnj7gkyiVPsg8Ko6Ryw5wJy6', 'Pharmacie MILLENAIRE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MILLENAIRE' LIMIT 1), 'pharmacy-078'), TRUE, now(), now()),
  ('pharma-079', '+22870448459', '$2b$12$5wQhkJXvGHEqjxYl6iU37ezDa.sJCdS.PFh1IH6RN7WIYkum2S6T.', 'Pharmacie DIEUDONNE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DIEUDONNE' LIMIT 1), 'pharmacy-079'), TRUE, now(), now()),
  ('pharma-080', '+22870404425', '$2b$12$0EMDR6aPfOQ6wIhboXGcSu573p6AFplbzK2eNAeH31hjPt1rMXHbe', 'Pharmacie OSSAN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'OSSAN' LIMIT 1), 'pharmacy-080'), TRUE, now(), now()),
  ('pharma-081', '+22893504255', '$2b$12$YskTzG.BO9t6Q6GNQQzbv.dcjLVJiFuDQpDQfyZ4eFf9zHG7x0/km', 'Pharmacie APOLLON', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'APOLLON' LIMIT 1), 'pharmacy-081'), TRUE, now(), now()),
  ('pharma-082', '+22898772153', '$2b$12$ftbcSnkAiyuCKvFnltZtRO8c6jNZelk62ZOHhc9gfZn7qqF7gE2Oa', 'Pharmacie YESHUA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'YESHUA' LIMIT 1), 'pharmacy-082'), TRUE, now(), now()),
  ('pharma-083', '+22870193535', '$2b$12$FzOlQQPrH.jBLNZHAELcie9T9rqD.cCI7GWnpk4tPZHHnzWulbjHa', 'Pharmacie CLEMENCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CLEMENCE' LIMIT 1), 'pharmacy-083'), TRUE, now(), now()),
  ('pharma-084', '+22822517022', '$2b$12$1G11a3kaUfSZgCuLxmws1uizGKk8pdoCnToXrCyl67DPUCeoxD4tK', 'Pharmacie ST MICHEL', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ST MICHEL' LIMIT 1), 'pharmacy-084'), TRUE, now(), now()),
  ('pharma-085', '+22892300656', '$2b$12$5hgHWwth0eNp78OEyJYja.bW/wuEF5UTBU5D3TIJsIF3/IJaOy/Fi', 'Pharmacie LE ROCHER', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LE ROCHER' LIMIT 1), 'pharmacy-085'), TRUE, now(), now()),
  ('pharma-086', '+22892616608', '$2b$12$5e42dNfYACb9K1Ek4pyY1ORX20vSZW9uMK8u83aOkCM8uLhMW.nRC', 'Pharmacie ZILIDJI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ZILIDJI' LIMIT 1), 'pharmacy-086'), TRUE, now(), now()),
  ('pharma-087', '+22897799374', '$2b$12$uOjWgwKO5wd4FAAJMvJ5YuNu37yvW.TQMglKMBlEZvl4UP2omTtJa', 'Pharmacie EL NOUR', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EL NOUR' LIMIT 1), 'pharmacy-087'), TRUE, now(), now()),
  ('pharma-088', '+22893087676', '$2b$12$ELJnx95jx8eTPsqowjqA6ehxYhwNl2hINh94WXfb0HztSKjVoYE3C', 'Pharmacie ASSURANCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ASSURANCE' LIMIT 1), 'pharmacy-088'), TRUE, now(), now()),
  ('pharma-089', '+22893704812', '$2b$12$ZzufvFouA.pOAvnJwp.65.541GOcnBzrtpIK62hkO6EEDr9yCPdz2', 'Pharmacie KOBOYO', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'KOBOYO' LIMIT 1), 'pharmacy-089'), TRUE, now(), now()),
  ('pharma-090', '+22893084640', '$2b$12$B5xbT/vDHVJEcYuiugRRY.QD/Ubspry9nPd7hp17alIvRQSugpprW', 'Pharmacie DENIS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DENIS' LIMIT 1), 'pharmacy-090'), TRUE, now(), now()),
  ('pharma-091', '+22822501000', '$2b$12$x/jmxCO6NYLuBmzz5QAo1eozTx4IY3qPtGe77IXg3eEuknWGBrzj.', 'Pharmacie ABRAHAM', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ABRAHAM' LIMIT 1), 'pharmacy-091'), TRUE, now(), now()),
  ('pharma-092', '+22822259447', '$2b$12$DjGcT9d/a7vYClCDT.CQKuvhqBm.XbutpONkATWQweXoIZOyDmGg2', 'Pharmacie ALTA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ALTA' LIMIT 1), 'pharmacy-092'), TRUE, now(), now()),
  ('pharma-093', '+22893402121', '$2b$12$brbsZtETgng3qigPUB.Nz.M.l.K60S0IwlZ8yRgKZdggHncXPJv4W', 'Pharmacie LA MAIN DE DIEU', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LA MAIN DE DIEU' LIMIT 1), 'pharmacy-093'), TRUE, now(), now()),
  ('pharma-094', '+22822550815', '$2b$12$qxxABUADsfqBm7Pcq5rT3.BIF2F7XopoBP0vMgfcULxqyqMnALSqS', 'Pharmacie GANFAT', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'GANFAT' LIMIT 1), 'pharmacy-094'), TRUE, now(), now()),
  ('pharma-095', '+22896283410', '$2b$12$BXF5Wht77y2R246rze7oP.MR4Yv8xDnNfbkEP1hlOXyE5LbK13fEm', 'Pharmacie ZOPOMAHE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ZOPOMAHE' LIMIT 1), 'pharmacy-095'), TRUE, now(), now()),
  ('pharma-096', '+22897534444', '$2b$12$bFwWzycvPVhgQ0iqNUZEvOeyjbbRbNzWp3ICdf45mIUb2dCc.Y9Aq', 'Pharmacie EL-SALI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EL-SALI' LIMIT 1), 'pharmacy-096'), TRUE, now(), now()),
  ('pharma-097', '+22899349797', '$2b$12$0ZP7tEDZp7Xq8xvBGFDGL.q0F4TXe7uekykQsYDV.0SerXSdRk1EG', 'Pharmacie MAWULOM', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MAWULOM' LIMIT 1), 'pharmacy-097'), TRUE, now(), now()),
  ('pharma-098', '+22893263600', '$2b$12$3oV.WIXfmKFxUsrTV.DUo.Bg6qRDCUakH4ov12HSjMmS3lOdl0iCW', 'Pharmacie A DIEU LA GLOIRE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'A DIEU LA GLOIRE' LIMIT 1), 'pharmacy-098'), TRUE, now(), now()),
  ('pharma-099', '+22822504860', '$2b$12$DRByHaGyz7ZZ5YtNP52seOmYUxSKgVFrPbLUALqM50ldjvFCGT/mm', 'Pharmacie OBSERVANCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'OBSERVANCE' LIMIT 1), 'pharmacy-099'), TRUE, now(), now()),
  ('pharma-100', '+22899273636', '$2b$12$YR.1X4xRSXcnpwoNCpEXWueGV4IN4U/A9yLy.OPTXcWd7t0Lu1JGS', 'Pharmacie HYGEA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'HYGEA' LIMIT 1), 'pharmacy-100'), TRUE, now(), now()),
  ('pharma-101', '+22890019029', '$2b$12$9n8c0b2cSfXADiY/eG5MDuLHJOKQ7JlEkB.2.nre7xzrI5ok6x1Z6', 'Pharmacie VERSEAU', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'VERSEAU' LIMIT 1), 'pharmacy-101'), TRUE, now(), now()),
  ('pharma-102', '+22896981515', '$2b$12$iK0GOxe9NohbMp8UvJPc0uoLVc25BMt4aSoLALB683yAYi/CVCp1i', 'Pharmacie HELENE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'HELENE' LIMIT 1), 'pharmacy-102'), TRUE, now(), now()),
  ('pharma-103', '+22870416836', '$2b$12$aPAethEVZoq2dWRLfygz2eXWvUHoD2kAOv6chdCEwD50oQj80CY4i', 'Pharmacie LUMEN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LUMEN' LIMIT 1), 'pharmacy-103'), TRUE, now(), now()),
  ('pharma-104', '+22822220801', '$2b$12$iTSKpF8eFVCZd2C3YvtUsuhhC61V8TOchoNx9oV5Cjk.skNHA.63e', 'Pharmacie JEANNE D''ARC', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'JEANNE D''ARC' LIMIT 1), 'pharmacy-104'), TRUE, now(), now()),
  ('pharma-105', '+22822218847', '$2b$12$WTfmyb4qRR2ga/rEvncH8.kgu5ZqaJqcoNEFRUH4vdy3qoy74LOE6', 'Pharmacie ETOILES', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ETOILES' LIMIT 1), 'pharmacy-105'), TRUE, now(), now()),
  ('pharma-106', '+22896329760', '$2b$12$ZYgbFNTE54mWMMYp6UtjleucX1tpW2r/NDgkw/dF/9HRfCynsi5Pe', 'Pharmacie AMESSIAME-BE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AMESSIAME-BE' LIMIT 1), 'pharmacy-106'), TRUE, now(), now()),
  ('pharma-107', '+22870453805', '$2b$12$hGiwFzU8ZN/jf5T/6G7mNuumQvNw4SONOC7wErBHq56KISdzHcsxy', 'Pharmacie DES APÔTRES', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DES APÔTRES' LIMIT 1), 'pharmacy-107'), TRUE, now(), now()),
  ('pharma-108', '+22822226277', '$2b$12$5mm6JgqDn9dAfPWESKf1VO5FIYGwyBon8LvI/inTVc4Q0a5IpvzdS', 'Pharmacie OCEANE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'OCEANE' LIMIT 1), 'pharmacy-108'), TRUE, now(), now()),
  ('pharma-109', '+22870499500', '$2b$12$4D6oVLaVcyTTpO/s.SgIiuA4p98JPoQ3a0c6iL/l7qR5lZs74LYWC', 'Pharmacie ADJOLOLO', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ADJOLOLO' LIMIT 1), 'pharmacy-109'), TRUE, now(), now()),
  ('pharma-110', '+22822200808', '$2b$12$il4H0VTPfY6sAE0fAnhsJuzW6sOSc1EG4MfrprNs4wBej6xooA0gi', 'Pharmacie HOPITAL', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'HOPITAL' LIMIT 1), 'pharmacy-110'), TRUE, now(), now()),
  ('pharma-111', '+22822217447', '$2b$12$KJydPwAPny7PWPLuWGTQyuMFWHDJfGIqFT1tt0TRqCkq4AZOdGvpC', 'Pharmacie AMITIE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AMITIE' LIMIT 1), 'pharmacy-111'), TRUE, now(), now()),
  ('pharma-112', '+22896800885', '$2b$12$/KOxw6Ar.roku6EdzGHbrO/xNu10sdRzd9Ahk3GLG3QitAQwdbxbu', 'Pharmacie CAMPUS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CAMPUS' LIMIT 1), 'pharmacy-112'), TRUE, now(), now()),
  ('pharma-113', '+22822260320', '$2b$12$PxfdmyBwf/rfI/pzrkBlsOolPUaW8Lqmr2lVRAkMt45Dy6fD2lR/K', 'Pharmacie BAH', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BAH' LIMIT 1), 'pharmacy-113'), TRUE, now(), now()),
  ('pharma-114', '+22870445924', '$2b$12$gXjdRtovJ8BfgSLOm/D73uzJCQjjrtICbAtRtLuwsC5KNxSWbKBUS', 'Pharmacie CITRUS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CITRUS' LIMIT 1), 'pharmacy-114'), TRUE, now(), now()),
  ('pharma-115', '+22870448387', '$2b$12$UAehLz99BbK3N6QiKQbww.ZjamvmZV9rovwnfkecawyxt8.Z75nbC', 'Pharmacie ISIS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ISIS' LIMIT 1), 'pharmacy-115'), TRUE, now(), now()),
  ('pharma-116', '+22822267651', '$2b$12$S9YvIdNIM76prySWZajrredE0Y82eqLIUCO6.yUrUcxCTi6Nai2YW', 'Pharmacie YEM-BLA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'YEM-BLA' LIMIT 1), 'pharmacy-116'), TRUE, now(), now()),
  ('pharma-117', '+22822268155', '$2b$12$tpZSG21VO9geNmlRLwN7VuxkE5iOBsKHy0kmDAcMxRmKDGWkhxbNq', 'Pharmacie FRATERNITE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'FRATERNITE' LIMIT 1), 'pharmacy-117'), TRUE, now(), now()),
  ('pharma-118', '+22822615775', '$2b$12$pQbE23w693gPVVWS.wdWierjzwrngzgQ8hB7q7gOP.G4EwbYGFH9K', 'Pharmacie APOTHEKA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'APOTHEKA' LIMIT 1), 'pharmacy-118'), TRUE, now(), now()),
  ('pharma-119', '+22870459186', '$2b$12$7BHTl3AFBm7sTUlJg2XY4uoYWfb0k1kGjMfqUaoaVgDZKOJ8A8FI.', 'Pharmacie MAWULE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MAWULE' LIMIT 1), 'pharmacy-119'), TRUE, now(), now()),
  ('pharma-120', '+22822719595', '$2b$12$tfxpNXnWHPA1YBKrQS4z3Oc9QZbrKUVoUachWS7v8KIGv4m8ostGu', 'Pharmacie FIDELIA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'FIDELIA' LIMIT 1), 'pharmacy-120'), TRUE, now(), now()),
  ('pharma-121', '+22870426902', '$2b$12$urMhEVuaEnP.wt3NfAFI6ehVPqLI5Dvujk5XtH.644rOFJQOJQa8S', 'Pharmacie SARAH', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SARAH' LIMIT 1), 'pharmacy-121'), TRUE, now(), now()),
  ('pharma-122', '+22899911342', '$2b$12$s2pI/wmqcMwtXGZkxELCfuOl.O/0TDseF9ScA/.vYChIN3eiZ4orW', 'Pharmacie ELI-BERACA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ELI-BERACA' LIMIT 1), 'pharmacy-122'), TRUE, now(), now()),
  ('pharma-123', '+22896800996', '$2b$12$B6m4JmO.AFMsKKs8F1N/Helzx6bRnz6kgxcZetM6IZKL6yoQQs3nq', 'Pharmacie LA REFERENCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LA REFERENCE' LIMIT 1), 'pharmacy-123'), TRUE, now(), now()),
  ('pharma-124', '+22822507431', '$2b$12$/EjlTv921ZCcrQT3BaNumOmIPsR5mPkEAm0Am1Zlz3s9QlE6Q87Vy', 'Pharmacie BONTE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BONTE' LIMIT 1), 'pharmacy-124'), TRUE, now(), now()),
  ('pharma-125', '+22890494456', '$2b$12$qdNixCWHFlAF8x0MArjOWeBkRff/2LKFHbPuzvbRe6FgcpI1LYKIS', 'Pharmacie AZUR', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AZUR' LIMIT 1), 'pharmacy-125'), TRUE, now(), now()),
  ('pharma-126', '+22892531293', '$2b$12$mu7ROHQ/cPV83ITYhpkDoezyt3Xw/JRo.M6Wjsy573a5DeATaBztO', 'Pharmacie AURORE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AURORE' LIMIT 1), 'pharmacy-126'), TRUE, now(), now()),
  ('pharma-127', '+22822512286', '$2b$12$AbVbA8O7sO1GSh23ZVoDiutu8pwredtJJsJJ8MGkrXx2NJ0.6nkYe', 'Pharmacie JAHNAP', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'JAHNAP' LIMIT 1), 'pharmacy-127'), TRUE, now(), now()),
  ('pharma-128', '+22870157846', '$2b$12$O8imOuJRogDU3IkMBwogcukB2g9vCDE4zo24GPmrgCiNeQ2GnN50i', 'Pharmacie CONFIANCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CONFIANCE' LIMIT 1), 'pharmacy-128'), TRUE, now(), now()),
  ('pharma-129', '+22870431549', '$2b$12$HaOKfmGlJr18ImNrNZj5b.Z1BorPxVEQrrI9LA0UM/Rrxyn3uBHDS', 'Pharmacie LUMIERE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LUMIERE' LIMIT 1), 'pharmacy-129'), TRUE, now(), now()),
  ('pharma-130', '+22899982087', '$2b$12$vrNNf1CNCfHX0LIWXdnROe3V54KCiCHr6Rj8UHNIuzSWN9CnJZdby', 'Pharmacie GROUPE C', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'GROUPE C' LIMIT 1), 'pharmacy-130'), TRUE, now(), now()),
  ('pharma-131', '+22893431049', '$2b$12$wB5FXIeyM.y3KPMn5MtTDOUYFgHgCYkQ.Yq4lk0nzixEK3NNkZKy.', 'Pharmacie DES ORCHIDEES', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DES ORCHIDEES' LIMIT 1), 'pharmacy-131'), TRUE, now(), now()),
  ('pharma-132', '+22870457492', '$2b$12$7rbLFIRXiiTGxJt3YDsuYOKl7zg0roTjk3w2DvGtE0VeoQNMJMV3y', 'Pharmacie DE LA VICTOIRE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DE LA VICTOIRE' LIMIT 1), 'pharmacy-132'), TRUE, now(), now()),
  ('pharma-133', '+22822503707', '$2b$12$a4jYfn/LHkIGtYfZ.Y9B/eZCR3p5ny8eaa1XGdrnNFNB2EBSuWMeq', 'Pharmacie SOLIDARITE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SOLIDARITE' LIMIT 1), 'pharmacy-133'), TRUE, now(), now()),
  ('pharma-134', '+22870425000', '$2b$12$ebD67g8bjGaKsXpd4VDT6ejobLLYwYkzoSAlPNepKYw/OWYhM2WWm', 'Pharmacie ARC-EN-CIEL', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ARC-EN-CIEL' LIMIT 1), 'pharmacy-134'), TRUE, now(), now()),
  ('pharma-135', '+22893587823', '$2b$12$1kfYEafc43ttS48sS.ii1eDDEQQA3Wg0DTEbK3ByLaUieTru3FvEO', 'Pharmacie SHALOM', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SHALOM' LIMIT 1), 'pharmacy-135'), TRUE, now(), now()),
  ('pharma-136', '+22822258338', '$2b$12$m5w0lmDVuWIhAZrJvyMmYOgqnfJwk48mnallO9lnz0VSrtUYlex0S', 'Pharmacie AGOE-NYIVE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AGOE-NYIVE' LIMIT 1), 'pharmacy-136'), TRUE, now(), now()),
  ('pharma-137', '+22891911535', '$2b$12$PCe04BSnpyx4gPyV4s0wHug194phrzHEXV9QX3N2GFzqefeCzGNtm', 'Pharmacie SALA HOUBEIDA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SALA HOUBEIDA' LIMIT 1), 'pharmacy-137'), TRUE, now(), now()),
  ('pharma-138', '+22891551804', '$2b$12$.BXSkcEj0RF0bTYuOIUFmeGvrafQdeu1P15LkG3BiJCjqVrn.Cjq.', 'Pharmacie TAKOE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'TAKOE' LIMIT 1), 'pharmacy-138'), TRUE, now(), now()),
  ('pharma-139', '+22870499655', '$2b$12$Y1cr8zTMvmqQZgzXcBj1S.zTjdgO.O9ndcxLsPJsmj3rbV6WYkrSS', 'Pharmacie ZONGO', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ZONGO' LIMIT 1), 'pharmacy-139'), TRUE, now(), now()),
  ('pharma-140', '+22892340680', '$2b$12$qdAhOLTU5.kGMbnPXvXnFO.fqLh5FbByC0ynHphUb5EKkhc/oLRje', 'Pharmacie ELEMAWUSSI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ELEMAWUSSI' LIMIT 1), 'pharmacy-140'), TRUE, now(), now()),
  ('pharma-141', '+22870448517', '$2b$12$kFJzWB0teyVKotzU2FyTyOHCQlIjBUYPjbrw0a79vds3DeQLLshhK', 'Pharmacie SATIS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SATIS' LIMIT 1), 'pharmacy-141'), TRUE, now(), now()),
  ('pharma-142', '+22870776942', '$2b$12$QJPA7vd6wX/xGY26z62AT.O9CgczIFL3r4GLJDt9ZOCXvlOhAEUvK', 'Pharmacie DAFEANNE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DAFEANNE' LIMIT 1), 'pharmacy-142'), TRUE, now(), now()),
  ('pharma-143', '+22822251260', '$2b$12$vm2nO3F8qxW12TQ26keMje2qwkVNkAN8oejYHKIXyl.aNlvi4oFHi', 'Pharmacie CHARITE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CHARITE' LIMIT 1), 'pharmacy-143'), TRUE, now(), now()),
  ('pharma-144', '+22890106092', '$2b$12$eaphR1uR6xs2K5ng4Jub7O0nMZYEBxcx4eS7WsTJEp0dw2uW3V2ga', 'Pharmacie MAA-LA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MAA-LA' LIMIT 1), 'pharmacy-144'), TRUE, now(), now()),
  ('pharma-145', '+22870428080', '$2b$12$1jhXsulLOF/HIzNB6RREKe4SSo93Qkl/5r1WlPhhRNAzUOl/w528.', 'Pharmacie SANGUERA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SANGUERA' LIMIT 1), 'pharmacy-145'), TRUE, now(), now()),
  ('pharma-146', '+22891838783', '$2b$12$hXWuAlkci9x9UtOCi7dNGuEDxpwjs6Nf5aI1wNhdab9Xiigj7CH6K', 'Pharmacie SAG''BIBA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SAG''BIBA' LIMIT 1), 'pharmacy-146'), TRUE, now(), now()),
  ('pharma-147', '+22893339205', '$2b$12$DTSUq8Z9I94zwpvtaRGmH.f1bxlZsxvGUkva1sfJfAUJzs.LXOIL2', 'Pharmacie LA SHEKINAH', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LA SHEKINAH' LIMIT 1), 'pharmacy-147'), TRUE, now(), now()),
  ('pharma-148', '+22892011100', '$2b$12$cJ7r6BPS2ZRmZh5dOShoyewMxPUDh5ySpCmUBLZMqIuTWVDyu6JB6', 'Pharmacie NELLY''S', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'NELLY''S' LIMIT 1), 'pharmacy-148'), TRUE, now(), now()),
  ('pharma-149', '+22870423464', '$2b$12$Etk6DCCVu45ticpaf8jiK.M1RlgzMjLl18jltOXOYPTF.xY6QiEGu', 'Pharmacie MAWUNYO', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MAWUNYO' LIMIT 1), 'pharmacy-149'), TRUE, now(), now()),
  ('pharma-150', '+22870278181', '$2b$12$hq59JQbuFfQw6FpN1Wz4qepOTlJci1X236ChfBzxqIC/uyu.d3ti.', 'Pharmacie M''BA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'M''BA' LIMIT 1), 'pharmacy-150'), TRUE, now(), now()),
  ('pharma-151', '+22893258036', '$2b$12$CKzUCjYk6vmH0skaSO3qB.mHYRwUe6R1dwv1C2cTa4sdiuSaX6kV6', 'Pharmacie TRIOMPHE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'TRIOMPHE' LIMIT 1), 'pharmacy-151'), TRUE, now(), now()),
  ('pharma-152', '+22892034040', '$2b$12$y5Qt6n0VMMxAQDMsC54Bmub5nbXv6yex9rQ5.MtM8/PqGHKS03kl6', 'Pharmacie VERONIQUE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'VERONIQUE' LIMIT 1), 'pharmacy-152'), TRUE, now(), now()),
  ('pharma-153', '+22870411541', '$2b$12$L2OtFmRpCEqxL5bZV3kX0.KziUQ2fQkw9oayfpNz5vKMBLOJh5dl6', 'Pharmacie LE DESTIN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LE DESTIN' LIMIT 1), 'pharmacy-153'), TRUE, now(), now()),
  ('pharma-154', '+22892859794', '$2b$12$6PWMioJZzbWCVmg06zZdXOOdooQnd8.DRXXWFC6xOuyg6yx4Qh5xC', 'Pharmacie SAINTE MARIE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SAINTE MARIE' LIMIT 1), 'pharmacy-154'), TRUE, now(), now()),
  ('pharma-155', '+22893404040', '$2b$12$6h9l0iTRZsAsj3AF2q6ZvO3XwT95cc/N8p4AUUA.MiJLOrHNk6frW', 'Pharmacie SAINT PIO', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SAINT PIO' LIMIT 1), 'pharmacy-155'), TRUE, now(), now()),
  ('pharma-156', '+22822211367', '$2b$12$lQFicLOKAtTuCVVC9nM9Ee2wBBJW7htNsXsSctW.TPvPfQQreQB.S', 'Pharmacie BON PASTEUR', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BON PASTEUR' LIMIT 1), 'pharmacy-156'), TRUE, now(), now()),
  ('pharma-157', '+22822215227', '$2b$12$K51GMmcdK.w.FGjXBmrRB.0/6SfoMdKqggZiPu1JJMd9f9ZWZ7Bve', 'Pharmacie 3IEME ARRONDISSEMENT', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = '3IEME ARRONDISSEMENT' LIMIT 1), 'pharmacy-157'), TRUE, now(), now()),
  ('pharma-158', '+22822345093', '$2b$12$VgOPPosKFz3rAXG8vbu5u.2u4/Y/FTqcmNt23rk1JHmBFHPFStICq', 'Pharmacie BIOVA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BIOVA' LIMIT 1), 'pharmacy-158'), TRUE, now(), now()),
  ('pharma-159', '+22822276188', '$2b$12$kG6YLEVN9uZDMVatJ.vSeeMNe54Z5blZwvF50PHBrPmJD4LEZ265i', 'Pharmacie PORT', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'PORT' LIMIT 1), 'pharmacy-159'), TRUE, now(), now()),
  ('pharma-160', '+22822216205', '$2b$12$YbtRIuVcjQfByTxn3Emnce6YFIFEONaCIlIjsN5PtTIzMOaJgahAe', 'Pharmacie OCAM', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'OCAM' LIMIT 1), 'pharmacy-160'), TRUE, now(), now()),
  ('pharma-161', '+22822204242', '$2b$12$zIoKOsHMgOBdkEenqsN3d.UD7iGZYZGsIdLh3QujOOPKqFaDzSInm', 'Pharmacie HORIZON', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'HORIZON' LIMIT 1), 'pharmacy-161'), TRUE, now(), now()),
  ('pharma-162', '+22896800931', '$2b$12$ncctZpPFKulVkQB5smhSu.v90Vp4oO5JpdeYcHawwNvmOg25of/W2', 'Pharmacie JUSTINE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'JUSTINE' LIMIT 1), 'pharmacy-162'), TRUE, now(), now()),
  ('pharma-163', '+22870200000', '$2b$12$3SNRJBUsXR0scD6L37vZ.Olaf3m88G7JGViIswnvBKkpXH3yHu4AW', 'Pharmacie AGBEGNIGAN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AGBEGNIGAN' LIMIT 1), 'pharmacy-163'), TRUE, now(), now()),
  ('pharma-164', '+22870457674', '$2b$12$ZxaukADnuC0dgvTMax6.uelOxL5O9xy./g9SmsPRpRC8JJWwIfxzu', 'Pharmacie BON SECOURS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BON SECOURS' LIMIT 1), 'pharmacy-164'), TRUE, now(), now()),
  ('pharma-165', '+22896801012', '$2b$12$awBw0YfNECwlU3cMs5UvheGi64dSEGvc.u0Ns4SyLrTbqoLVvJh9C', 'Pharmacie NOTRE DAME', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'NOTRE DAME' LIMIT 1), 'pharmacy-165'), TRUE, now(), now()),
  ('pharma-166', '+22896800991', '$2b$12$khj2dedDShR53g2pj9YzwOpe47foEFwo5.O7JDJb68yipkcrQYI0K', 'Pharmacie LA PROSPERITE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LA PROSPERITE' LIMIT 1), 'pharmacy-166'), TRUE, now(), now()),
  ('pharma-167', '+22891183333', '$2b$12$Lzi.Q.oONZc69OvPORZltutWn954DXVfFMDwmyqqhzecnCnOzO6qa', 'Pharmacie MADINA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MADINA' LIMIT 1), 'pharmacy-167'), TRUE, now(), now()),
  ('pharma-168', '+22822261973', '$2b$12$30ToCek21GS.OJho4Xkw1Ok0YRLfVqulRdlxsozuljdqn1P1SXamu', 'Pharmacie ST PIERRE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ST PIERRE' LIMIT 1), 'pharmacy-168'), TRUE, now(), now()),
  ('pharma-169', '+22896285713', '$2b$12$MypGrPGcXln24vf3ds2FD.39FRi.7.iQOkF2ZFqYhXAbap0P8/dG2', 'Pharmacie DEO GRATIAS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DEO GRATIAS' LIMIT 1), 'pharmacy-169'), TRUE, now(), now()),
  ('pharma-170', '+22822613729', '$2b$12$8uEaGE7Lkgdf2slXsl/D6e2yOzKTbw857CCEcCpXQmvFd0Ar3Z5ju', 'Pharmacie PEUPLE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'PEUPLE' LIMIT 1), 'pharmacy-170'), TRUE, now(), now()),
  ('pharma-171', '+22897726969', '$2b$12$3csA9SF/PS4jladofMuCWu83E4iMaukySrhVrDYvq.nl1cMfL6mwW', 'Pharmacie BA-AYETA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BA-AYETA' LIMIT 1), 'pharmacy-171'), TRUE, now(), now()),
  ('pharma-172', '+22871901166', '$2b$12$D.pt2fL3xiVkqHT28t1pru9N6DwaxhyGRZPNale6MBOVKXCNH0RgG', 'Pharmacie O GRAIN D''OR', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'O GRAIN D''OR' LIMIT 1), 'pharmacy-172'), TRUE, now(), now()),
  ('pharma-173', '+22870346565', '$2b$12$sC9c8/gCeRRBrziUS7QpUuyUTGJR3pyrPaV5Yr7GJnKMnurEAxzAO', 'Pharmacie SEPOPO', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SEPOPO' LIMIT 1), 'pharmacy-173'), TRUE, now(), now()),
  ('pharma-174', '+22896379425', '$2b$12$rBJAfpm/DU3qi19k8dypV.vPtOEX2D1A3IftXAVPryp24FcB32ew2', 'Pharmacie PHARMACIE 2000', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'PHARMACIE 2000' LIMIT 1), 'pharmacy-174'), TRUE, now(), now()),
  ('pharma-175', '+22822252370', '$2b$12$LxIR1bNv7MDuVPapwomHp.dxgYJZ3kxXuXgSx1Y5ZegBdcycZGoHm', 'Pharmacie BETHEL', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BETHEL' LIMIT 1), 'pharmacy-175'), TRUE, now(), now()),
  ('pharma-176', '+22822517575', '$2b$12$OMLk0IE.qIRPRlgf/xQ2H.7J8TqcweUGmRyjhYmMka//JNz9mppaa', 'Pharmacie DES ECOLES', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DES ECOLES' LIMIT 1), 'pharmacy-176'), TRUE, now(), now()),
  ('pharma-177', '+22899733932', '$2b$12$BTWfcSu9WFBqgDi8xrIOIe7HEekimU7QuIU5KfRtCx3.A13MbGp82', 'Pharmacie EL-NISSI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EL-NISSI' LIMIT 1), 'pharmacy-177'), TRUE, now(), now()),
  ('pharma-178', '+22897776959', '$2b$12$JfH4KtmSXdKXH1M3t7VOWuF3lQIXrkaa0.1zyYXWNzhWILjA1ML0C', 'Pharmacie HOSANNA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'HOSANNA' LIMIT 1), 'pharmacy-178'), TRUE, now(), now()),
  ('pharma-179', '+22870445159', '$2b$12$XD2Y7rqrdoE6mNzebobu1OmgAfe7pxmjZ0G9DDDLvRZ2zmyFmMcNu', 'Pharmacie MAGNIFICAT', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MAGNIFICAT' LIMIT 1), 'pharmacy-179'), TRUE, now(), now()),
  ('pharma-180', '+22892961919', '$2b$12$aQn3QRYYLjcUJKhBdNoSYehK7/x15Lt8xdB3X.iIOwglFGqtUBaeW', 'Pharmacie GREENRX', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'GREENRX' LIMIT 1), 'pharmacy-180'), TRUE, now(), now()),
  ('pharma-181', '+22893025212', '$2b$12$4H.0piIXPJIq/CU1aV72Gu5nxXXnDHlWY6uMk3q5zwXEYNDO08S4C', 'Pharmacie MATHILDA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'MATHILDA' LIMIT 1), 'pharmacy-181'), TRUE, now(), now()),
  ('pharma-182', '+22822514425', '$2b$12$X0/4L4jfDSmmsSBCM61w2uWMK9IfLNzuI1xsb4IWg78qpSI.AwTwq', 'Pharmacie EL-SHADAI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EL-SHADAI' LIMIT 1), 'pharmacy-182'), TRUE, now(), now()),
  ('pharma-183', '+22822558646', '$2b$12$i/BCKitnrd0SDc1uNB7QkOULN5/u1FJTN9iq1T7dHf7WyU54WCnyq', 'Pharmacie ENOULI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ENOULI' LIMIT 1), 'pharmacy-183'), TRUE, now(), now()),
  ('pharma-184', '+22822517171', '$2b$12$YKDUtqBPMAJjMcPBNrSPB.ILe0X9HFGaC.3gB2xLw5Dv8sGpqSemm', 'Pharmacie LE GALIEN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LE GALIEN' LIMIT 1), 'pharmacy-184'), TRUE, now(), now()),
  ('pharma-185', '+22870423772', '$2b$12$FAAvAuQposbCDl2DIjPDh.bqVeYpUS3gjOWYZt0uDruMGp.9XDymW', 'Pharmacie DES ROSES', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'DES ROSES' LIMIT 1), 'pharmacy-185'), TRUE, now(), now()),
  ('pharma-186', '+22896801011', '$2b$12$Y5YmaR8lkySIlonXdIovYO6e8xgC/0zdzSshNQG3jWxZFAzQmigW2', 'Pharmacie BETANIA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BETANIA' LIMIT 1), 'pharmacy-186'), TRUE, now(), now()),
  ('pharma-187', '+22870422360', '$2b$12$stfjrKGaPRRQGC3KguLyt.uOH2UgYAK/ELAP1aKO.ptvHzwYUC1qy', 'Pharmacie VOLONTAS DEI', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'VOLONTAS DEI' LIMIT 1), 'pharmacy-187'), TRUE, now(), now()),
  ('pharma-188', '+22870432585', '$2b$12$7gShwD4IcF2fqViLcCXd4OM/SbN.9TAlV2fRww89hAqcqqPObUzg2', 'Pharmacie EL-SHAMMAH', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EL-SHAMMAH' LIMIT 1), 'pharmacy-188'), TRUE, now(), now()),
  ('pharma-189', '+22870440101', '$2b$12$ScA8Fo/.2NgENXTDBtpvauj64RQ0A8m5o8pU1UnFpHRbF4PbAVz7y', 'Pharmacie NOTRE DAME DE LOURDES', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'NOTRE DAME DE LOURDES' LIMIT 1), 'pharmacy-189'), TRUE, now(), now()),
  ('pharma-190', '+22822259165', '$2b$12$ZapqRblksJSBWO3ChMkBUeQJJtEz8W6F5NX.Apf7PSRUQn/QX..6a', 'Pharmacie LA GRÂCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LA GRÂCE' LIMIT 1), 'pharmacy-190'), TRUE, now(), now()),
  ('pharma-191', '+22870459858', '$2b$12$zuhVnUkFnRmYEWjLMooemOjuBjygZarnveubDV9KcIpC8v91r4HEq', 'Pharmacie REGINA PACIS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'REGINA PACIS' LIMIT 1), 'pharmacy-191'), TRUE, now(), now()),
  ('pharma-192', '+22899858907', '$2b$12$ris4csxHiHrYKfmwRuCNjeqkoLSJk7k.ql/47kRhZp5YVOM5LbEqO', 'Pharmacie ESPACE VIE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ESPACE VIE' LIMIT 1), 'pharmacy-192'), TRUE, now(), now()),
  ('pharma-193', '+22870709898', '$2b$12$FU0m5Mw4NFtfFJsK8YJg2OUGCJHpe3RUDsgwVLOBSwrGT4t56KNyu', 'Pharmacie AUREOLE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'AUREOLE' LIMIT 1), 'pharmacy-193'), TRUE, now(), now()),
  ('pharma-194', '+22870402540', '$2b$12$MjraWTQJvHlZc3XhwG1BVewfPZczWE40xOA3xBlgOBqNGEs6d7Ox.', 'Pharmacie EMMAÜS', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'EMMAÜS' LIMIT 1), 'pharmacy-194'), TRUE, now(), now()),
  ('pharma-195', '+22870424777', '$2b$12$Jm9BwKFGSIdU4v/rGWPXTe5o70URYhCbs.5ufq9pV1keh.k14k0pW', 'Pharmacie BAGUIDA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BAGUIDA' LIMIT 1), 'pharmacy-195'), TRUE, now(), now()),
  ('pharma-196', '+22870457014', '$2b$12$G80bLCHvtAA4CNzItytjvOKiUg4DKEZfdP2WDK3TtZ7tLzHc/bduy', 'Pharmacie LA FLAMME D''AMOUR', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LA FLAMME D''AMOUR' LIMIT 1), 'pharmacy-196'), TRUE, now(), now()),
  ('pharma-197', '+22870052339', '$2b$12$35YlIr3PiUyHOOR/4X1ktO0d04xwdFfDy2muamb8txvXprDiVogXe', 'Pharmacie LA PATIENCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LA PATIENCE' LIMIT 1), 'pharmacy-197'), TRUE, now(), now()),
  ('pharma-198', '+22822209091', '$2b$12$BbGWCtoHg9HGumh/QCq3ZOqFFzhRs4KB7JgQQquDNodv/F19HpNoi', 'Pharmacie CRISTAL', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'CRISTAL' LIMIT 1), 'pharmacy-198'), TRUE, now(), now()),
  ('pharma-199', '+22870442503', '$2b$12$xcmkxX1EJ7lnS2CKqQ.W1..Ln44stGOjFgYzDa.duP6gulOaX/wkS', 'Pharmacie BE-KPEHENOU', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BE-KPEHENOU' LIMIT 1), 'pharmacy-199'), TRUE, now(), now()),
  ('pharma-200', '+22822210128', '$2b$12$ncibTPK3TxdEt/gwtJLHOeRQ1l7UNZciYxofh0DnsQTeMh1TvVM0i', 'Pharmacie ESPERANCE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ESPERANCE' LIMIT 1), 'pharmacy-200'), TRUE, now(), now()),
  ('pharma-201', '+22822222841', '$2b$12$IhzLXXDNWoKuuj/dGt0Iuui7fI7XwueizcqtUSGJMmLAj/ayWdrl2', 'Pharmacie ROBERTSON', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ROBERTSON' LIMIT 1), 'pharmacy-201'), TRUE, now(), now()),
  ('pharma-202', '+22891613332', '$2b$12$uudVRGtka.m.q4z6rMKjKeXVJjgYpx1M5Na8uLS22ZRUE6P6pHvNK', 'Pharmacie RAOUDHA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'RAOUDHA' LIMIT 1), 'pharmacy-202'), TRUE, now(), now()),
  ('pharma-203', '+22898465088', '$2b$12$verwGfXDRpPYBNN9ZZyAYuq3iFnMsJUChZdDBfQNeQVFSFa.EfZ5S', 'Pharmacie N.D. DE LA TRINITE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'N.D. DE LA TRINITE' LIMIT 1), 'pharmacy-203'), TRUE, now(), now()),
  ('pharma-204', '+22822261177', '$2b$12$2s1.i7ACmMED3/xmkGbWpOBjZlfaCzung6u8yTF2eP2kdIBnKNpIi', 'Pharmacie FOREVER', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'FOREVER' LIMIT 1), 'pharmacy-204'), TRUE, now(), now()),
  ('pharma-205', '+22870010303', '$2b$12$FJDvT3.p/VOK620/mjjiyuDEmgrF96K0JItoEOdO7Ag5gfl7ijT.O', 'Pharmacie SANTA MADONNA', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'SANTA MADONNA' LIMIT 1), 'pharmacy-205'), TRUE, now(), now()),
  ('pharma-206', '+22822264516', '$2b$12$1YnNLO4DVfezT76Qltf1Putp9EC1NqR5Xlx86EKo.xZ4eR2T7NqWq', 'Pharmacie BIEN ETRE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BIEN ETRE' LIMIT 1), 'pharmacy-206'), TRUE, now(), now()),
  ('pharma-207', '+22892953838', '$2b$12$/iUm/A0FLu.DlNvpvsHs/.hfR19qO1b4mGhdFFibHIrlcjHjHYJTG', 'Pharmacie KELEGOUGAN', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'KELEGOUGAN' LIMIT 1), 'pharmacy-207'), TRUE, now(), now()),
  ('pharma-208', '+22891541616', '$2b$12$/O405HjkQm49tOa/fUkn2uQb9BHTKp/O0as1BNE/JGOij4llcbT0a', 'Pharmacie LA RUCHE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'LA RUCHE' LIMIT 1), 'pharmacy-208'), TRUE, now(), now()),
  ('pharma-209', '+22822216549', '$2b$12$sTSppvzRVJ83MDuMh1EbP.gkNSNbZoyeeRgTbnb/TwzuTkmxAa2Ym', 'Pharmacie BOULEVARD', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'BOULEVARD' LIMIT 1), 'pharmacy-209'), TRUE, now(), now()),
  ('pharma-210', '+22870499663', '$2b$12$uCb/CE4gZILJwcNyTXxMNO7ai3VLyLvcDtGnr4djmLnfYpvQKvUnm', 'Pharmacie HANOUKOPE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'HANOUKOPE' LIMIT 1), 'pharmacy-210'), TRUE, now(), now()),
  ('pharma-211', '+22822218990', '$2b$12$9Tqii49X4Vw4inxOmXKrkOmxqObRuJ6yDfXsLsOkcWiNVdRuM/NL6', 'Pharmacie KODJOVIAKOPE', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'KODJOVIAKOPE' LIMIT 1), 'pharmacy-211'), TRUE, now(), now()),
  ('pharma-212', '+22870402906', '$2b$12$n5O9xTpt1je3dtMlAsQcBOIsyWi7n9SuhzulWmBeKAj2sahUpCKoa', 'Pharmacie ST ESPRIT', 'pharmacist', COALESCE((SELECT id FROM "Pharmacy" WHERE name = 'ST ESPRIT' LIMIT 1), 'pharmacy-212'), TRUE, now(), now())
ON CONFLICT (phone) DO NOTHING;

-- ─── 3. Vérification ─────────────────────────────────────────
SELECT u.id AS "user_id", u.phone, u."fullName", u.role, p.name AS "pharmacy_name", u."pharmacyId"
FROM "User" u
LEFT JOIN "Pharmacy" p ON p.id = u."pharmacyId"
WHERE u.role = 'pharmacist' ORDER BY u.id;

COMMIT;

-- Fin du script — MediTike pharmacy password generator
