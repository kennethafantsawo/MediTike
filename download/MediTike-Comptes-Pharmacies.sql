-- ============================================================
-- MediTike — Comptes pharmaciens (générés automatiquement)
-- À exécuter dans Supabase Dashboard → SQL Editor
-- ============================================================
-- Ce script crée :
-- 1. Les pharmacies (table Pharmacy)
-- 2. Les comptes pharmaciens (table User) avec mots de passe hashés
-- Le pharmacien pourra se connecter et compléter ses informations.
-- ============================================================

BEGIN;

-- ─── PHARMACIES ────────────────────────────────────────────────
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-001',
  'Pharmacie SANTE',
  '+22870449137',
  NULL,
  '+22870449137',
  'Près de NOPATO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-002',
  'Pharmacie AKOFA',
  '+22822210097',
  '70 49 96 28',
  '+22822210097',
  'Av. Maman N’Danida Amoutivé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-003',
  'Pharmacie CENTRE',
  '+22822218330',
  '91 03 83 83',
  '+22822218330',
  'ASSIVITO, face WATT',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-004',
  'Pharmacie BON SAMARITAIN',
  '+22822214530',
  '91 34 41 94',
  '+22822214530',
  'BE PA de SOUZA / Hôpital de BE',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-005',
  'Pharmacie ECLAIR',
  '+22896800906',
  NULL,
  '+22896800906',
  'Rue Avenou, Bè Ahligo, dans le prolongement du Marché de Ahligo',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-006',
  'Pharmacie DE LA MAIRIE',
  '+22822212639',
  '91 03 21 21',
  '+22822212639',
  '39, Avenue Nicolas Grunitzky Nyekonakpoe',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-007',
  'Pharmacie DE LA MARINA',
  '+22822214846',
  '91 01 96 91',
  '+22822214846',
  'sur la RN2,BD du Mono en face du poste frontière D''Aflao Kodjoviakopé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-008',
  'Pharmacie AVE MARIA',
  '+22822223301',
  '99 03 20 12',
  '+22822223301',
  'Face ENSF (Ecole Nationale des Sages Femmes) près du CHU Tokoin',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-009',
  'Pharmacie LIBERATION',
  '+22822222525',
  '96 80 09 35',
  '+22822222525',
  'Avenue Libération Prolongée',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-010',
  'Pharmacie GBOSSIME',
  '+22822225050',
  '92 47 61 21',
  '+22822225050',
  '376, Boulevard de la Kara 08 B.P.: 80859 Lomé-TOGO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-011',
  'Pharmacie KLOKPE',
  '+22896801003',
  '90 53 60 52',
  '+22896801003',
  'Derrière la Foire Togo 2000',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-012',
  'Pharmacie PROVIDENCE',
  '+22891148888',
  '99 76 96 96',
  '+22891148888',
  'Bd. Jean Paul II',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-013',
  'Pharmacie UNIVERS-SANTE',
  '+22822618143',
  '93 88 83 31',
  '+22822618143',
  'Bd. GNASSINGBE Eyadéma, Cité OUA face à l''entrée du CHU-CAMPUS',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-014',
  'Pharmacie AEROPORT',
  '+22822262122',
  '96 51 59 74',
  '+22822262122',
  'Rte de l’Aéroport SITO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-015',
  'Pharmacie INTERNATIONALE',
  '+22822268994',
  '71 00 09 09',
  '+22822268994',
  'Sise Marché de Hédzranawoé "Assiyéyé", Boulevard du Haho',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-016',
  'Pharmacie DES LILAS',
  '+22896165589',
  '93 48 88 12',
  '+22896165589',
  '123HDN, 07 Route de Kégué Boulevard Jean Paul II prolongé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-017',
  'Pharmacie CHRIST-ROI',
  '+22822274666',
  '97 77 12 31',
  '+22822274666',
  'Kagomé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-018',
  'Pharmacie MAËLYS',
  '+22822276019',
  '70 44 86 79',
  '+22822276019',
  '1688, Bd Malfakassa - Bè Kpota en Face de NETADI',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-019',
  'Pharmacie MISERICORDE',
  '+22896800945',
  NULL,
  '+22896800945',
  'BE-KPOTA à 300M de NISSAN, A côté de la Station MRS',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-020',
  'Pharmacie DE LA CITE',
  '+22822250125',
  '99 08 15 35',
  '+22822250125',
  'Boulevard du 30 Août - BP 8461 - LOME - TOGO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-021',
  'Pharmacie EPIPHANIA',
  '+22870401052',
  '96 80 10 04',
  '+22870401052',
  'Rue de La Pampa, Carrefour AGBEMADON, ADIDOGOME',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-022',
  'Pharmacie BESDA',
  '+22822510529',
  '70 42 68 25',
  '+22822510529',
  'Route de Kpalimé , Adidogomé Aménopé 04 BP : 604 Lomé - TOGO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-023',
  'Pharmacie CONSEIL',
  '+22893109292',
  '96 80 21 37',
  '+22893109292',
  'Carrefour du CEG Sagbado Logoté',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-024',
  'Pharmacie DODJI',
  '+22870291677',
  '97 74 28 36',
  '+22870291677',
  'Ségbé Akato, immeuble Akato plage non loin de l''Eglise Catholique d''Akato',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-025',
  'Pharmacie POINT E',
  '+22822519171',
  '90 37 45 96',
  '+22822519171',
  '506, rue 129 Aflao Gakli (Kiniti Gomè), à Djidjolé dans le von de la pharmacie Djidjolé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-026',
  'Pharmacie VERTE',
  '+22822250326',
  '91 98 50 17',
  '+22822250326',
  'Face Ecole du Parti Klikamé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-027',
  'Pharmacie DELALI',
  '+22893645372',
  '99 29 13 13',
  '+22893645372',
  'En face de l''hôpital de Cacavéli à 100m entre la Cour d''Appel et le marché de Cacavéli',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-028',
  'Pharmacie NATION',
  '+22822259965',
  '96 80 09 47',
  '+22822259965',
  'Face ancien Marché TOTSI',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-029',
  'Pharmacie LAUS DEO',
  '+22822251505',
  '93 00 65 75',
  '+22822251505',
  'Rte de Léo 2OOO, face Clinique Besthesda - quartier Adidoadin',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-030',
  'Pharmacie VITAFLORE',
  '+22870402286',
  NULL,
  '+22870402286',
  'Agoè Vakpossito à 100 m de la station Shell Agoè Vakpossito',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-031',
  'Pharmacie MAINA',
  '+22870436534',
  '96 80 10 15',
  '+22870436534',
  'Quartier AVEDJI, non loin de Hôpital Source de Vie, à 500m du Carrefour Y',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-032',
  'Pharmacie ADOUNI',
  '+22870393939',
  '97 08 79 79',
  '+22870393939',
  'Vakpossito-Logogomé, près du carrefour AISED',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-033',
  'Pharmacie IRIS',
  '+22891684804',
  '99 98 00 70',
  '+22891684804',
  'Amadahomé, Imm. Havon, A 500m de la station CAP, Rue 50m à coté des Casses Auto',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-034',
  'Pharmacie NABINE',
  '+22893362626',
  '99 01 77 77',
  '+22893362626',
  'Sise à Agoè Anomé dit Plateau (Route du Bar Plateau)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-035',
  'Pharmacie ADONAÏ',
  '+22822500405',
  NULL,
  '+22822500405',
  'Face Hôtel la Plantation à Agoè-Nyivé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-036',
  'Pharmacie TCHEP''SON',
  '+22870429441',
  '96 90 04 64',
  '+22870429441',
  'Face Terminal du Sahel (Togblékopé)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-037',
  'Pharmacie LIDDY',
  '+22870901960',
  NULL,
  '+22870901960',
  'AGOE-DIKAME, Bernard Copé après la station CAP en face du Camp de tir',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-038',
  'Pharmacie AMEN',
  '+22890885588',
  '97 18 02 02',
  '+22890885588',
  'Marché Adétikopé, près de l''Eglise Catholique Christ-Roi',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-039',
  'Pharmacie DIVINA GRACIA',
  '+22893839100',
  '96 80 10 21',
  '+22893839100',
  'Quartier Agoè-Fiovi Carrefour Bafana-Bafana',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-040',
  'Pharmacie LA BARAKA',
  '+22890174928',
  '70 41 44 13',
  '+22890174928',
  'Agoè LOGOPE, non loin de l''ECOLE LA BRUYERE A PROXIMITE DU CAMP GP',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-041',
  'Pharmacie EXCELLENCE',
  '+22822502447',
  '93 27 95 54',
  '+22822502447',
  'AGOE Démakpoé Voie CEDEAO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-042',
  'Pharmacie VITAS',
  '+22822256343',
  NULL,
  '+22822256343',
  'Située à Agoè Assiyéyé du côté ouest',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-043',
  'Pharmacie ZOSSIME',
  '+22822554352',
  '70 46 26 64',
  '+22822554352',
  'AGOE - Zossimé, près du marché',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-044',
  'Pharmacie SAINT SYLVESTRE',
  '+22893515198',
  NULL,
  '+22893515198',
  'Zanguéra,Quartier Sanyramé, non loin du rond-point Sanyramé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-045',
  'Pharmacie ST PHILIPPE',
  '+22890673324',
  '99 99 80 04',
  '+22890673324',
  'SANGUERA, Rte Lomé - Kpalimé près de la Station service OANDO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-046',
  'Pharmacie EVA',
  '+22892163232',
  NULL,
  '+22892163232',
  'SANGUERA, Klikamé, Non loin du T-OIL',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-047',
  'Pharmacie NOUVELLE TULIPE',
  '+22899470070',
  NULL,
  '+22899470070',
  'Rte de Mission - Tové; Près de la station CAP Agoè-Légbassito',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-048',
  'Pharmacie GRATITUDE',
  '+22892189485',
  NULL,
  '+22892189485',
  'Agoè Legbassito Zovadjin non loin du carrefour Avinato',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-049',
  'Pharmacie DE L''EDEN',
  '+22870421398',
  NULL,
  '+22870421398',
  'Route d''Aného, face Cité Baguida',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-050',
  'Pharmacie AVEPOZO',
  '+22822270486',
  '93 01 73 51',
  '+22822270486',
  'AVEPOZO Be Kome à côté de la place publique 04 BP: 353 Lomé - Togo',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-051',
  'Pharmacie PRINCIPALE',
  '+22890826767',
  '99 98 66 66',
  '+22890826767',
  'Rte d’Aného Kpogan Yovo Kopé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-052',
  'Pharmacie SIKA',
  '+22892620651',
  '97 10 75 75',
  '+22892620651',
  'DJAGBLE, Hiheatro à 200m du complexe scolaire la Perseverance rte Akakope-Gbamakope',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-053',
  'Pharmacie AJP-ABOLAVE',
  '+22890413402',
  '90 36 07 53',
  '+22890413402',
  'Djablé,sur la route d''abolavé, non loin  de l''Institut Scolaire le Souverain',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-054',
  'Pharmacie BEL AIR',
  '+22822210321',
  '96 80 08 75',
  '+22822210321',
  'PRES DE L''EEPT DE AFEGAME (PLAGE) ET DE SUPER RAMCO MARINA (ANCIEN GOYISCORE)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-055',
  'Pharmacie MATTHIA',
  '+22822212964',
  '96 80 10 07',
  '+22822212964',
  '1048, Avenue de la Libération',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-056',
  'Pharmacie STE RITA',
  '+22896800970',
  '72 43 49 39',
  '+22896800970',
  'Route pavée, Doulassamé - Face Hôtel SANA',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-057',
  'Pharmacie CHÂTEAU-D''EAU',
  '+22871338888',
  '96 80 08 88',
  '+22871338888',
  'Av. Augustino de Souza, près  du Château d’eau de BE',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-058',
  'Pharmacie OLIVIERS',
  '+22822270434',
  '96 80 09 50',
  '+22822270434',
  '01, Rue du Rotary club international angle Bd Felix Houphët-Boigny 08 BP 8480 Lomé 08 TOGO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-059',
  'Pharmacie EMMANUEL',
  '+22822213098',
  '90 09 94 03',
  '+22822213098',
  '637, Av. Duisburg Face MIVIP Kodjoviakopé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-060',
  'Pharmacie SOURCE DE VIE',
  '+22822202759',
  '90 88 25 82',
  '+22822202759',
  'Face Collège Protestant Tokoin Lomé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-061',
  'Pharmacie ST KISITO',
  '+22822219963',
  '96 80 09 64',
  '+22822219963',
  'Bd. de la Kara près du Bar TAMTAM',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-062',
  'Pharmacie THERYA',
  '+22870448177',
  '96 80 09 92',
  '+22870448177',
  'Petit contournement, à 500m de la Foire internationale Togo 2000',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-063',
  'Pharmacie ST PAUL',
  '+22896800967',
  '92 60 51 67',
  '+22896800967',
  'Bd. Jean Paul II',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-064',
  'Pharmacie LE JOURDAIN',
  '+22822615614',
  '92 38 30 50',
  '+22822615614',
  'Boulevard Léopold Sédar SENGHOR, face au CEG Tokoin Wuiti',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-065',
  'Pharmacie HEDZRANAWE',
  '+22896800927',
  '92 51 34 38',
  '+22896800927',
  'Avenu du Grand Seminaire non loin de la banque Atlantique',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-066',
  'Pharmacie KOUESSAN',
  '+22896801001',
  '90 50 48 12',
  '+22896801001',
  'En face du stade de Kégué',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-067',
  'Pharmacie J-MIMSHAK',
  '+22896443108',
  '22 61 30 70',
  '+22896443108',
  'Rue Tchamba 964, à 50m de la Base SATOM 01 BP : 1391 Hountigomé Lomé - Togo',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-068',
  'Pharmacie UNION',
  '+22822277164',
  '96 32 97 26',
  '+22822277164',
  'Bd Malfakassa, face crèmerie BAMUDAS - BE KPOTA',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-069',
  'Pharmacie LE PROGRES',
  '+22870458655',
  '96 80 10 00',
  '+22870458655',
  'Grd contournement, face EPPL Universelle, non loin de la Gendarmerie d''AHADZI-Kpota',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-070',
  'Pharmacie ADIDOGOME',
  '+22822511891',
  '91 05 78 21',
  '+22822511891',
  'Face au camp 2ème RI d''Adidogomé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-071',
  'Pharmacie SILOE',
  '+22890802639',
  '96 80 10 16',
  '+22890802639',
  'Carrefour Aflao Apédokoè Atigangomé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-072',
  'Pharmacie ACTUELLE',
  '+22890614644',
  '96 80 09 95',
  '+22890614644',
  'Route de Ségbé; Quartier Sagbado - Adidogomé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-073',
  'Pharmacie SEGBE',
  '+22892594935',
  '79 30 07 29',
  '+22892594935',
  'Ségbé qt Zanvi, près de l''EPP et du CEG Ségbé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-074',
  'Pharmacie WASTINE',
  '+22892611700',
  '22 51 81 19',
  '+22892611700',
  'Adidogome logoté, à 400m du carrefour logoté sur la route menant au quartier Lankouvi',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-075',
  'Pharmacie DJIDJOLE',
  '+22822256512',
  '93 93 99 27',
  '+22822256512',
  'DJIDJOLE',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-076',
  'Pharmacie ST JOSEPH',
  '+22822257465',
  '96 80 09 65',
  '+22822257465',
  'Bretelle BE KLIKAME',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-077',
  'Pharmacie VIGUEUR',
  '+22822516330',
  '70 44 81 96',
  '+22822516330',
  'Rue 267, AGBALEPEDOGAN, Kilimandjaro',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-078',
  'Pharmacie MILLENAIRE',
  '+22870213197',
  NULL,
  '+22870213197',
  'Face réserve de la gendarmerie d''Agoè-Nyivé, sur la route de 50m à 300m du côté Nord',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-079',
  'Pharmacie DIEUDONNE',
  '+22870448459',
  '79 98 33 33',
  '+22870448459',
  'AGOE-TELESSOU NON LOIN DE LA STATION 
CAP',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-080',
  'Pharmacie OSSAN',
  '+22870404425',
  NULL,
  '+22870404425',
  'Carrefour AVEDZI, face Ets LA LIMOUSINE',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-081',
  'Pharmacie APOLLON',
  '+22893504255',
  '70 41 01 07',
  '+22893504255',
  'Avédji, Face complexe scolaire Makafui - Non loin du carrefour des hirondelles',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-082',
  'Pharmacie YESHUA',
  '+22898772153',
  '98 77 21 50',
  '+22898772153',
  'AGOE Vakpossito vers l''Ecole NDE, entre le CMS Mur et le CMS Maranatha',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-083',
  'Pharmacie CLEMENCE',
  '+22870193535',
  '70 21 26 26',
  '+22870193535',
  'Rte de la Cour d''Appel, entre l''Agence CEET Agoè et l''Ecole privée La Source',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-084',
  'Pharmacie ST MICHEL',
  '+22822517022',
  '70 43 30 43',
  '+22822517022',
  'Située à Agoè-Nyivé entre la Brasserie BB et l''espace Télécom',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-085',
  'Pharmacie LE ROCHER',
  '+22892300656',
  '99 08 05 01',
  '+22892300656',
  'Agoè zongo, sur la route national N°1, près du terrain de jeu de golf',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-086',
  'Pharmacie ZILIDJI',
  '+22892616608',
  NULL,
  '+22892616608',
  'Derrière le marche d''agoè zongo',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-087',
  'Pharmacie EL NOUR',
  '+22897799374',
  NULL,
  '+22897799374',
  'AGOE - Alinka non loin du CMS Togblekopé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-088',
  'Pharmacie ASSURANCE',
  '+22893087676',
  '96 82 76 76',
  '+22893087676',
  'Adétikopé, National N°1, non loin du marché',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-089',
  'Pharmacie KOBOYO',
  '+22893704812',
  '93 70 34 78',
  '+22893704812',
  'DAVIE, rte de la Nationale No 1 avant le péage de Davié en face de la Station Sanol',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-090',
  'Pharmacie DENIS',
  '+22893084640',
  '96 74 03 80',
  '+22893084640',
  'AGOE Kové, Carrefour Kpogli',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-091',
  'Pharmacie ABRAHAM',
  '+22822501000',
  '92 25 99 83',
  '+22822501000',
  'AGOE - Logopé Kossigan',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-092',
  'Pharmacie ALTA',
  '+22822259447',
  '70 08 46 46',
  '+22822259447',
  'AGOE Anonkui Route Mission Tové en face du Centre Culturel Loyola',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-093',
  'Pharmacie LA MAIN DE DIEU',
  '+22893402121',
  NULL,
  '+22893402121',
  'AGOE ASSIYEYE non loin de l''église des Assemblées de Dieu (Temple Galilée)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-094',
  'Pharmacie GANFAT',
  '+22822550815',
  '70 22 15 15',
  '+22822550815',
  'AGOE DALIKO près du Carf EDEM (CAMP GP)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-095',
  'Pharmacie ZOPOMAHE',
  '+22896283410',
  '98 80 68 83',
  '+22896283410',
  'ZOPOMAHE, sur la route Zossimé - Sanguera à côté de la salle des témoins de Jehovah',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-096',
  'Pharmacie EL-SALI',
  '+22897534444',
  '70 12 44 44',
  '+22897534444',
  'Rte Lomé-Kpalimé, Aflao Apédokoè Gbomamé, à 50 m de la quaincaillerie MACO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-097',
  'Pharmacie MAWULOM',
  '+22899349797',
  '70 17 87 87',
  '+22899349797',
  'Agoè Nyivé quartier Athiémé Carrefour kponsé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-098',
  'Pharmacie A DIEU LA GLOIRE',
  '+22893263600',
  NULL,
  '+22893263600',
  'Marché de Légbassito, à côté de la Poste, sur le grand contournement',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-099',
  'Pharmacie OBSERVANCE',
  '+22822504860',
  '70 74 22 22',
  '+22822504860',
  'SOGBOSSITO, en face de la station Total Energies à Côté du Camp BIR',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-100',
  'Pharmacie HYGEA',
  '+22899273636',
  '93 33 99 66',
  '+22899273636',
  'Face Lycée publique de Baguida sur la rte d''Afanoukopé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-101',
  'Pharmacie VERSEAU',
  '+22890019029',
  '92 05 23 49',
  '+22890019029',
  'Près de la maison Bateau Baguida',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-102',
  'Pharmacie HELENE',
  '+22896981515',
  '92 66 09 08',
  '+22896981515',
  'Aveta face au marché d'' Aveta',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-103',
  'Pharmacie LUMEN',
  '+22870416836',
  NULL,
  '+22870416836',
  'DJAGBLE, En face de l’EPP (Plakomé)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-104',
  'Pharmacie JEANNE D''ARC',
  '+22822220801',
  '90 86 40 51',
  '+22822220801',
  'Près de Marox-Renault-Star',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-105',
  'Pharmacie ETOILES',
  '+22822218847',
  '96 27 05 05',
  '+22822218847',
  '10 Av. Nouvelle Marche',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-106',
  'Pharmacie AMESSIAME-BE',
  '+22896329760',
  '70 49 96 29',
  '+22896329760',
  'Marché de Bè',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-107',
  'Pharmacie DES APÔTRES',
  '+22870453805',
  NULL,
  '+22870453805',
  '49, Bd Moboutou Sese Seko, Akodésséwa, non loin du Centre de Formation CAMA',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-108',
  'Pharmacie OCEANE',
  '+22822226277',
  '96 75 25 02',
  '+22822226277',
  'Rue HOULATA, perpendiculaire rue de l''OCAM, face Hôtel de la PAIX',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-109',
  'Pharmacie ADJOLOLO',
  '+22870499500',
  '97 93 86 59',
  '+22870499500',
  '1319, Rue de la Charité proche du CMS de Nyekonakpoe',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-110',
  'Pharmacie HOPITAL',
  '+22822200808',
  '79 69 08 08',
  '+22822200808',
  'Face Hôpital CHU-Tokoin',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-111',
  'Pharmacie AMITIE',
  '+22822217447',
  '70 25 62 57',
  '+22822217447',
  '72 Av. des Hydrocarbures (SOTED)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-112',
  'Pharmacie CAMPUS',
  '+22896800885',
  '93 38 08 84',
  '+22896800885',
  'ADEWI - Boulevard de la Kara à côté de UTB',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-113',
  'Pharmacie BAH',
  '+22822260320',
  '90 55 79 59',
  '+22822260320',
  'Bd Zio, Face EPP Hédzranawé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-114',
  'Pharmacie CITRUS',
  '+22870445924',
  '96 80 09 03',
  '+22870445924',
  'Attiégou Carrefour DVA, Grand Contournement',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-115',
  'Pharmacie ISIS',
  '+22870448387',
  NULL,
  '+22870448387',
  'Avenue Jean Paul II près des rails NUKAFU Gakpoto',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-116',
  'Pharmacie YEM-BLA',
  '+22822267651',
  '90 88 98 72',
  '+22822267651',
  '258, Av. Akéï face à la Résidence',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-117',
  'Pharmacie FRATERNITE',
  '+22822268155',
  '96 80 09 19',
  '+22822268155',
  'Hédzranawé près de la Clinique St Joseph',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-118',
  'Pharmacie APOTHEKA',
  '+22822615775',
  '70 44 33 33',
  '+22822615775',
  'Face siège Fédération Togolaise de Football, route de Kegué',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-119',
  'Pharmacie MAWULE',
  '+22870459186',
  NULL,
  '+22870459186',
  '54 Bd de l''OTI Rond Point Gakpoto, Bè-Kpota',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-120',
  'Pharmacie FIDELIA',
  '+22822719595',
  '96 80 09 18',
  '+22822719595',
  'Bè-Kpota, Route d''Attiégou, près de l''hôtel "LE REFERENTIEL"',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-121',
  'Pharmacie SARAH',
  '+22870426902',
  '72 33 51 58',
  '+22870426902',
  '186 Bd MALFAKASSA , Face au centre de santé d''ADAKPAME 32 BP60',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-122',
  'Pharmacie ELI-BERACA',
  '+22899911342',
  '99 69 89 21',
  '+22899911342',
  'Route d''Adidogomé, Immeuble SIKOVIC face bureau de poste',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-123',
  'Pharmacie LA REFERENCE',
  '+22896800996',
  '70 49 96 47',
  '+22896800996',
  'Route de Kpalimé, Adidogomé Assiyéyé, à côté du bar Madiba',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-124',
  'Pharmacie BONTE',
  '+22822507431',
  '96 80 09 00',
  '+22822507431',
  'Route de SEGBE, Wonyomé-Adidogomé en face de la station Sanol',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-125',
  'Pharmacie AZUR',
  '+22890494456',
  '98 89 80 09',
  '+22890494456',
  'Apédokoè-Gbomamé, rte d''Atigangomé, Carrefour Obéna, près de l''eglise Pentécôte',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-126',
  'Pharmacie AURORE',
  '+22892531293',
  '71 00 75 75',
  '+22892531293',
  'LANKOUVI, non-loin de l''école La divine providence',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-127',
  'Pharmacie JAHNAP',
  '+22822512286',
  '96 80 09 29',
  '+22822512286',
  'A côté de l''EPP Gakli, Djidjolé-Gakli, immeuble Favo',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-128',
  'Pharmacie CONFIANCE',
  '+22870157846',
  '91 01 33 28',
  '+22870157846',
  'Face GTA',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-129',
  'Pharmacie LUMIERE',
  '+22870431549',
  NULL,
  '+22870431549',
  'AGBALEPEDOGAN - Lossossime près du Rond Point de l''Œuf',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-130',
  'Pharmacie GROUPE C',
  '+22899982087',
  '92 33 49 76',
  '+22899982087',
  'Agbalépédogan face Clinique la VICTOIRE non loin de l''EPP Groupe C',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-131',
  'Pharmacie DES ORCHIDEES',
  '+22893431049',
  '99 01 03 74',
  '+22893431049',
  'AGOE-TELESSOU, LEO 2000',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-132',
  'Pharmacie DE LA VICTOIRE',
  '+22870457492',
  '99 11 35 35',
  '+22870457492',
  'Avédji Wessomé, sur le Bd Faure Gnassingbé (voie douane d''Adidogomé - Carf Limousine), après les rails.',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-133',
  'Pharmacie SOLIDARITE',
  '+22822503707',
  '96 80 09 76',
  '+22822503707',
  'Rue Avédji Limousine, Près de l''UTB Totsi BP : 8919 Lomé - TOGO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-134',
  'Pharmacie ARC-EN-CIEL',
  '+22870425000',
  '91 50 50 45',
  '+22870425000',
  'Agoè-Télessou, Carrefour Margot 05 BP 670 lomé-TOGO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-135',
  'Pharmacie SHALOM',
  '+22893587823',
  '70 49 96 51',
  '+22893587823',
  'Agoè-Cacavéli, non loin de BKS. Sur Bd Faure GNASSINGBE',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-136',
  'Pharmacie AGOE-NYIVE',
  '+22822258338',
  '91 61 02 62',
  '+22822258338',
  'A côté de l’Eglise Catholique d’Agoè-Nyivé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-137',
  'Pharmacie SALA HOUBEIDA',
  '+22891911535',
  NULL,
  '+22891911535',
  'Agoè Kelegougan (Koffi Panou, Carrefour O''queens)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-138',
  'Pharmacie TAKOE',
  '+22891551804',
  '96 80 09 77',
  '+22891551804',
  'Avant la station CAP ESSO de Zongo (côté opposé)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-139',
  'Pharmacie ZONGO',
  '+22870499655',
  '99 99 22 39',
  '+22870499655',
  'Togblékopé carrefour Hermann entre Orabank et la station Sanol Togblékopé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-140',
  'Pharmacie ELEMAWUSSI',
  '+22892340680',
  '97 67 09 37',
  '+22892340680',
  'Adétikopé, Médina, Nationale N°1, avant PIA (Plateforme Industrielle)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-141',
  'Pharmacie SATIS',
  '+22870448517',
  NULL,
  '+22870448517',
  'Agoè-Logopé face CEG Agoègnivé Ouest (Kossigan) sur la rue de 50m',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-142',
  'Pharmacie DAFEANNE',
  '+22870776942',
  '92 62 44 44',
  '+22870776942',
  'Agoè-sogbossito,Route reliant le contournement au camp GP,à 300m de l''espace de loisirs privilège plus.',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-143',
  'Pharmacie CHARITE',
  '+22822251260',
  '90 65 21 90',
  '+22822251260',
  'A côté du CEG d''Agoè-Nyivé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-144',
  'Pharmacie MAA-LA',
  '+22890106092',
  '22 51 07 80',
  '+22890106092',
  'Agoè Demakpoè à côté de AZ Batiment non loin de l''école la Référence',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-145',
  'Pharmacie SANGUERA',
  '+22870428080',
  '99 90 89 72',
  '+22870428080',
  'Près du lycée Sanguera',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-146',
  'Pharmacie SAG''BIBA',
  '+22891838783',
  '22 55 73 17',
  '+22891838783',
  'AGOE-Nanegbe à côté de la station T-Oil',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-147',
  'Pharmacie LA SHEKINAH',
  '+22893339205',
  '96 40 17 17',
  '+22893339205',
  'AGOE-NYIVE Qt Atiomé carrefour Amadenta',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-148',
  'Pharmacie NELLY''S',
  '+22892011100',
  '99 90 90 80',
  '+22892011100',
  'Klémé Agokpanou, non loin du château d''eau, sur la voie de Ségbé à Sanguéra',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-149',
  'Pharmacie MAWUNYO',
  '+22870423464',
  NULL,
  '+22870423464',
  'AGOE-Sogbossito, route de Mission TOVE en face de la station OANDO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-150',
  'Pharmacie M''BA',
  '+22870278181',
  '99 76 81 81',
  '+22870278181',
  'Agoè-Légbassito. Route de Mission Tové, 300 mètres après le marché de Légbassito',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-151',
  'Pharmacie TRIOMPHE',
  '+22893258036',
  '91 00 11 91',
  '+22893258036',
  'Quartier Bokpokor,Route contournement,300m de carrefour kpala',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-152',
  'Pharmacie VERONIQUE',
  '+22892034040',
  '96 68 53 53',
  '+22892034040',
  'Avépozo en face de l''école nationale de gendarmerie D''Avépozo',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-153',
  'Pharmacie LE DESTIN',
  '+22870411541',
  NULL,
  '+22870411541',
  'A côté de l''Agence ECOBANK de Baguida',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-154',
  'Pharmacie SAINTE MARIE',
  '+22892859794',
  '22 60 46 97',
  '+22892859794',
  'DJAGBLE, Non loin du marché d’Avéta (Adja Adoté-kopé)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-155',
  'Pharmacie SAINT PIO',
  '+22893404040',
  '96 86 86 86',
  '+22893404040',
  'KLOBATEME, non loin du CMS Klobatèmé et près du complexe scolaire Le Bon Samaritain',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-156',
  'Pharmacie BON PASTEUR',
  '+22822211367',
  '91 43 44 84',
  '+22822211367',
  '44 Av. de la libération, en face de Brother Home',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-157',
  'Pharmacie 3IEME ARRONDISSEMENT',
  '+22822215227',
  '96 32 97 71',
  '+22822215227',
  'Bd. du 13 Janvier, près de l''Immeuble FIATA',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-158',
  'Pharmacie BIOVA',
  '+22822345093',
  '70 23 19 23',
  '+22822345093',
  'Bd. Houphët-Boigny',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-159',
  'Pharmacie PORT',
  '+22822276188',
  '70 41 54 53',
  '+22822276188',
  'Face Hôtel Sarakawa',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-160',
  'Pharmacie OCAM',
  '+22822216205',
  '92 85 99 55',
  '+22822216205',
  'Rue de l''ENTENTE',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-161',
  'Pharmacie HORIZON',
  '+22822204242',
  '90 56 52 56',
  '+22822204242',
  '165, Bd du 13 janvier Nyékonakpoè. Face Sapeurs-Pompiers à côté de l''immeuble A.AC.',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-162',
  'Pharmacie JUSTINE',
  '+22896800931',
  '22 21 00 01',
  '+22896800931',
  '291, Bd des Armées - Tokoin Habitat',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-163',
  'Pharmacie AGBEGNIGAN',
  '+22870200000',
  '96 77 33 33',
  '+22870200000',
  'Tokoin Ramco - Gbadago, Av. de la Libération, près du PRÊT À MANGER',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-164',
  'Pharmacie BON SECOURS',
  '+22870457674',
  '96 80 08 83',
  '+22870457674',
  'Rue du Grand Collège du Plateau - Cassablanca',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-165',
  'Pharmacie NOTRE DAME',
  '+22896801012',
  NULL,
  '+22896801012',
  'Rte de l''Aéroport entre la foire TOGO 2000 et l''Aéroport',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-166',
  'Pharmacie LA PROSPERITE',
  '+22896800991',
  '70 44 86 96',
  '+22896800991',
  'Bd Eyadéma entre l''immeuble EDA OBA et la Direction Police Judiciaire (DPJ)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-167',
  'Pharmacie MADINA',
  '+22891183333',
  '99 99 78 58',
  '+22891183333',
  'WUITI en face de la cité de la CNSS à côté de UTB Novissi',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-168',
  'Pharmacie ST PIERRE',
  '+22822261973',
  '70 43 26 67',
  '+22822261973',
  'Sagboville Hédzranawé. Boulevard Haho',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-169',
  'Pharmacie DEO GRATIAS',
  '+22896285713',
  '96 80 08 93',
  '+22896285713',
  'Rue Notre Dame de la Miséricorde KEGUE DINGBLE',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-170',
  'Pharmacie PEUPLE',
  '+22822613729',
  '98 25 04 86',
  '+22822613729',
  'Rue Santiagou, près du marché NUKAFU 06 BP 61217 Lomé 06',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-171',
  'Pharmacie BA-AYETA',
  '+22897726969',
  '71 32 33 33',
  '+22897726969',
  'KEGUE, Zogbédji non loin de la station NRL( ancienne station Ouando)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-172',
  'Pharmacie O GRAIN D''OR',
  '+22871901166',
  '22 71 90 06',
  '+22871901166',
  'Ahadji - Kpota, Rue Carrefour Zorrobar, Grand Contournement, Lomé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-173',
  'Pharmacie SEPOPO',
  '+22870346565',
  '79 50 80 41',
  '+22870346565',
  'ADAKPAME grand contournement, rond point Sawleto non loin de la station Somayaf',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-174',
  'Pharmacie 2000',
  '+22896379425',
  '22 70 85 87',
  '+22896379425',
  'BE KPOTA près du Marché Dzifa',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-175',
  'Pharmacie BETHEL',
  '+22822252370',
  '91 86 29 87',
  '+22822252370',
  'ADIDOGOME Soviépé, bd du 30 Août, face OraBank et Banque Atlantique',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-176',
  'Pharmacie DES ECOLES',
  '+22822517575',
  '96 80 09 14',
  '+22822517575',
  'Face Lycée Technique Adidogomé et près du CEG, Route de Kpalimé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-177',
  'Pharmacie EL-NISSI',
  '+22899733932',
  '70 17 97 08',
  '+22899733932',
  'Rte Lomé-Kpalimé, carrefour Apédokoè-Gbomamé à 200 m de la station total d''Apédokoè',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-178',
  'Pharmacie HOSANNA',
  '+22897776959',
  '92 53 50 00',
  '+22897776959',
  'Carrefour Sagbado-Sémékonawo, en face de la station service SANOL',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-179',
  'Pharmacie MAGNIFICAT',
  '+22870445159',
  '93 29 07 37',
  '+22870445159',
  'Adidogomé yokoè Agblégan, rue de la pampa  à 100m du palais royal de Yokoè',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-180',
  'Pharmacie GREENRX',
  '+22892961919',
  '22 55 61 88',
  '+22892961919',
  'Segbe dans l''immeuble Mabiz Plaza Non loin du Rond point Douane',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-181',
  'Pharmacie MATHILDA',
  '+22893025212',
  NULL,
  '+22893025212',
  'Route PATASSE - Lomégan - ODEF',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-182',
  'Pharmacie EL-SHADAI',
  '+22822514425',
  '96 80 09 10',
  '+22822514425',
  'Face Ecole Théologie ESTAO',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-183',
  'Pharmacie ENOULI',
  '+22822558646',
  '93 63 29 29',
  '+22822558646',
  'Derrière la gare routière d''Agbalepedogan 05 BP 633',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-184',
  'Pharmacie LE GALIEN',
  '+22822517171',
  '96 80 09 21',
  '+22822517171',
  'Rue Pavée d''Adidoadin',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-185',
  'Pharmacie DES ROSES',
  '+22870423772',
  '96 80 09 62',
  '+22870423772',
  'AGOE - Vakpossito, près de l''entreprise de l''Union',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-186',
  'Pharmacie BETANIA',
  '+22896801011',
  '70 43 89 40',
  '+22896801011',
  'Rue Sito, Totsi-Glenkomé non loin de la salle des Témoins de Jéhovah',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-187',
  'Pharmacie VOLONTAS DEI',
  '+22870422360',
  '91 21 25 97',
  '+22870422360',
  'Avédji, Carrefour  "SUN CITY", face à l''ancien bar Sun City',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-188',
  'Pharmacie EL-SHAMMAH',
  '+22870432585',
  '22 25 88 42',
  '+22870432585',
  'Sise à Amadahomé à côté de la Maison des Jeunes 04BP: 1004',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-189',
  'Pharmacie NOTRE DAME DE LOURDES',
  '+22870440101',
  '96 80 10 19',
  '+22870440101',
  'Carrefour Maison Blanche en allant à "Deux Lions" en face de STAM',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-190',
  'Pharmacie LA GRÂCE',
  '+22822259165',
  '90 56 16 81',
  '+22822259165',
  'Près de l’Auberge Sahara avant la Station SUN AGIP Agoè',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-191',
  'Pharmacie REGINA PACIS',
  '+22870459858',
  '96 55 71 55',
  '+22870459858',
  'ADETIKOPE, Rte National N°1 près du bar Sous l''Antenne',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-192',
  'Pharmacie ESPACE VIE',
  '+22899858907',
  NULL,
  '+22899858907',
  'AGOE Logopé non loin de place de Loisir BKS 2',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-193',
  'Pharmacie AUREOLE',
  '+22870709898',
  '96 89 96 96',
  '+22870709898',
  'Agoè Trokpossimé au carrefour camp GP à 50m de l''EPP du camp GP',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-194',
  'Pharmacie EMMAÜS',
  '+22870402540',
  '96 80 09 12',
  '+22870402540',
  'Sur la route de Mission Tové à côté du bar Solidarité',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-195',
  'Pharmacie BAGUIDA',
  '+22870424777',
  NULL,
  '+22870424777',
  'Face CMS de Baguida',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-196',
  'Pharmacie LA FLAMME D''AMOUR',
  '+22870457014',
  NULL,
  '+22870457014',
  'Qt. Bobole kope / Kpogan Non Loin du cimétière Zogbedjimonou de Kpogan',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-197',
  'Pharmacie LA PATIENCE',
  '+22870052339',
  '96 12 26 06',
  '+22870052339',
  'DJAGBLE, A 300 mètres du CMS (Ayokléfé)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-198',
  'Pharmacie CRISTAL',
  '+22822209091',
  '70 44 40 18',
  '+22822209091',
  'Face EPP BE-AKLASSOU, BOULEVARD (Bd) Felix H.BOIGNY',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-199',
  'Pharmacie BE-KPEHENOU',
  '+22870442503',
  '96 80 09 34',
  '+22870442503',
  'Boulevard Félix HOUPHOUET BOIGNY Lomé-Bè à côté de l''agence UTB de Bè,07 BP 12470 Lomé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-200',
  'Pharmacie ESPERANCE',
  '+22822210128',
  NULL,
  '+22822210128',
  'Av F.J. STRAUSS, Face Ecole Française Nyékonakpoè (Rue Adjololo)',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-201',
  'Pharmacie ROBERTSON',
  '+22822222841',
  NULL,
  '+22822222841',
  '607, Avenue François MITTERAND Nyékonakpoè',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-202',
  'Pharmacie RAOUDHA',
  '+22891613332',
  '70 51 66 21',
  '+22891613332',
  'Située au 4495 Boulevard Zio Hédzranawoe, derrière TOGO 2000',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-203',
  'Pharmacie N.D. DE LA TRINITE',
  '+22898465088',
  '93 69 22 34',
  '+22898465088',
  'Sise au 20 boulevard de la Paix à Super Taco',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-204',
  'Pharmacie FOREVER',
  '+22822261177',
  '91 00 29 17',
  '+22822261177',
  '01 BP 4884 Lomé 1-TOGO-52 Avenue des Kondona, face Garage Central Administratif',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-205',
  'Pharmacie SANTA MADONNA',
  '+22870010303',
  '96 68 03 03',
  '+22870010303',
  'Kégué, face maison Kader Coubadja & Eglise catholique Ste Thèrèse',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-206',
  'Pharmacie BIEN ETRE',
  '+22822264516',
  '70 54 29 07',
  '+22822264516',
  '100, bd du haho, hedzranawoe, à côté de la station d''essence total',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-207',
  'Pharmacie KELEGOUGAN',
  '+22892953838',
  '99 78 23 23',
  '+22892953838',
  'AGOE-Kelegougan,Voie du contournement, à 100m de la station TOTAL Kelegougan et du bar Obrigado',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-208',
  'Pharmacie LA RUCHE',
  '+22891541616',
  '99 41 52 52',
  '+22891541616',
  'Attiégou derrière la clôture de l’aéroport voie menant au Grand Contournement, non loin de l’école les Savoirs',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-209',
  'Pharmacie BOULEVARD',
  '+22822216549',
  '90 89 28 49',
  '+22822216549',
  'Bd. Du 13 Janv. Doulassamé',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-210',
  'Pharmacie HANOUKOPE',
  '+22870499663',
  '96 80 09 26',
  '+22870499663',
  'Avenue de la Nouvelle Marche, Immeuble Radio Kanal FM',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-211',
  'Pharmacie KODJOVIAKOPE',
  '+22822218990',
  '22 20 44 71',
  '+22822218990',
  'Avenue Duisbourg',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO "Pharmacy" (id, name, phone1, phone2, whatsapp, address, city, district, "isActive", "createdAt", "updatedAt")
VALUES (
  'pharma-212',
  'Pharmacie ST ESPRIT',
  '+22870402906',
  NULL,
  '+22870402906',
  'Sur la bretelle Agoè-Nyivé Kégué, Face au CEG Agoè-Est',
  'Lomé',
  NULL,
  TRUE,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- ─── COMPTES PHARMACIENS ──────────────────────────────────────
INSERT INTO "User" (id, phone, "passwordHash", "fullName", role, "pharmacyId", "isActive", "createdAt", "updatedAt")
VALUES
  (
    'pharma-user-001',
    '+22870449137',
    '$2b$12$38u2bCdDj.mmXiqmYi2iKeaz3rLnCNW7974KuyzpmDE0RMLHXx1qO',
    'Pharmacie SANTE',
    'pharmacist',
    'pharma-001',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-002',
    '+22822210097',
    '$2b$12$hqbpxr0MHj01XaGwO80GxOBwaHZ5gjVXrxGTtRoT3/ShStyFeStni',
    'Pharmacie AKOFA',
    'pharmacist',
    'pharma-002',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-003',
    '+22822218330',
    '$2b$12$QVXmSvcpdFOQs.D/q0lRVugUJNh9hGcVD/BNAq2MR4ZGW0mbhWiMy',
    'Pharmacie CENTRE',
    'pharmacist',
    'pharma-003',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-004',
    '+22822214530',
    '$2b$12$Ckini8c0/33dUhYFbnw2xOtbu7UOHYbCIyQ7xqz3eYU4TGpJDP6A2',
    'Pharmacie BON SAMARITAIN',
    'pharmacist',
    'pharma-004',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-005',
    '+22896800906',
    '$2b$12$XUc8DkdKMhRqnzEVHnr9IeiKKH0XLjT/5TNhnd0g6cabxRG/zPXHq',
    'Pharmacie ECLAIR',
    'pharmacist',
    'pharma-005',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-006',
    '+22822212639',
    '$2b$12$HysqRTDBEeGdpZ17lJdLL.cMzJmr.rwTICkbWJauD7N9530Wk8fg6',
    'Pharmacie DE LA MAIRIE',
    'pharmacist',
    'pharma-006',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-007',
    '+22822214846',
    '$2b$12$sInKL00qmp9EmWbotnMDAush9S06jveUw9t3kpJz4IEVujymSaleK',
    'Pharmacie DE LA MARINA',
    'pharmacist',
    'pharma-007',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-008',
    '+22822223301',
    '$2b$12$llB2YFk4PyJgwSXYgHF41.Aib3GaGehjwOkjVwHHW1aS68.Fe3sta',
    'Pharmacie AVE MARIA',
    'pharmacist',
    'pharma-008',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-009',
    '+22822222525',
    '$2b$12$5NUNdi1SsfduLyeyLSR/A.cQEXfhf2Ry4qffxaLxSHcmw7vTgh8DC',
    'Pharmacie LIBERATION',
    'pharmacist',
    'pharma-009',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-010',
    '+22822225050',
    '$2b$12$w1WqgLqk5IF1qxnKatwVWu.zu/gaetm.AkgtGaOP/eMwOA2GlygWK',
    'Pharmacie GBOSSIME',
    'pharmacist',
    'pharma-010',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-011',
    '+22896801003',
    '$2b$12$BCw9kbCWEzGvP079k5PUWeUoGrLF.AG4708BczKTWkF7.cZn7IDLm',
    'Pharmacie KLOKPE',
    'pharmacist',
    'pharma-011',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-012',
    '+22891148888',
    '$2b$12$60vo5zxfdX9ZiUDMIzROV.kkVUzeEBpijU0.wmD2Gkr19gfpWpgEO',
    'Pharmacie PROVIDENCE',
    'pharmacist',
    'pharma-012',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-013',
    '+22822618143',
    '$2b$12$Rqb9Ewjo/PIXELmVGbY.A.2HXTYK7iT9DiaUtqrEMuK.IKZUpGaVe',
    'Pharmacie UNIVERS-SANTE',
    'pharmacist',
    'pharma-013',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-014',
    '+22822262122',
    '$2b$12$7A2IOK05hbrBivv8f4L42egi92SBxK0amU8rFZA4Oc5tL.5RC5ijK',
    'Pharmacie AEROPORT',
    'pharmacist',
    'pharma-014',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-015',
    '+22822268994',
    '$2b$12$j32tta5JPKAr6nH2Xbmz/up7fMGeN6FEfcBLeBm1NlamKIL0tR6ii',
    'Pharmacie INTERNATIONALE',
    'pharmacist',
    'pharma-015',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-016',
    '+22896165589',
    '$2b$12$hdgSOdNrcfjiyBeYOdPAV.LThGrXqygv0/a1W0OATYQLgUOUxn.zS',
    'Pharmacie DES LILAS',
    'pharmacist',
    'pharma-016',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-017',
    '+22822274666',
    '$2b$12$yytmJofTAHKcEmJd6bV8jeHCj729PPU8A8yV5iA/o7W3GQwVD9YN.',
    'Pharmacie CHRIST-ROI',
    'pharmacist',
    'pharma-017',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-018',
    '+22822276019',
    '$2b$12$jyMgcpm.cqsjlvib5zFGC.nxu6BoWD2JZILT2dChv2tO7uoWAJ2c6',
    'Pharmacie MAËLYS',
    'pharmacist',
    'pharma-018',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-019',
    '+22896800945',
    '$2b$12$f0YWXIohVVDiGb/rMDRm5eehbAPMFO..L/1anoYpTLney5mE7tbLa',
    'Pharmacie MISERICORDE',
    'pharmacist',
    'pharma-019',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-020',
    '+22822250125',
    '$2b$12$7iVuiVYiMAVqCW9.kOjBFe29ieBy4xEjxr7CADwqY7CWtqEB5DyGm',
    'Pharmacie DE LA CITE',
    'pharmacist',
    'pharma-020',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-021',
    '+22870401052',
    '$2b$12$.CBmRfzWZSm9KbZLw0.GV.Ky5RgcliXDzceTyTzEwWIw18/hbbxGu',
    'Pharmacie EPIPHANIA',
    'pharmacist',
    'pharma-021',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-022',
    '+22822510529',
    '$2b$12$bCnQmdI7/8frHXy.KaJvyOP27Mg1bs.GCf8Yl2/YDvm4SVc53eHxm',
    'Pharmacie BESDA',
    'pharmacist',
    'pharma-022',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-023',
    '+22893109292',
    '$2b$12$n6cDBxfFLMpthNLaM/dll.spAvEw2EBgoDf0QSrxqysMiwDTKANCe',
    'Pharmacie CONSEIL',
    'pharmacist',
    'pharma-023',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-024',
    '+22870291677',
    '$2b$12$KLCNqtsfMRKytiwG58YOR.a/E7fm9vBGubl5cVco2NfWFtEfK3xrC',
    'Pharmacie DODJI',
    'pharmacist',
    'pharma-024',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-025',
    '+22822519171',
    '$2b$12$FP34EMY/VZZFd.uDahpkb.R/dZo0i3EU/OnimNOoTAyHzUHKAnxN6',
    'Pharmacie POINT E',
    'pharmacist',
    'pharma-025',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-026',
    '+22822250326',
    '$2b$12$j.QSMaLJx8isn1a7b/JIu.gCEt/M2ILRViF3wfs1avJ8b.27I/C1e',
    'Pharmacie VERTE',
    'pharmacist',
    'pharma-026',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-027',
    '+22893645372',
    '$2b$12$vBSsfTVbl6xWN3eGCJmpvOYx8TemEG9rBZpeuTdF5Oj4Qc/xI2yWe',
    'Pharmacie DELALI',
    'pharmacist',
    'pharma-027',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-028',
    '+22822259965',
    '$2b$12$h3Ztw9V5Rb6USWu03Pc5b.1o6y5BICFhbJWQZn4yMXjoCLh18Mx56',
    'Pharmacie NATION',
    'pharmacist',
    'pharma-028',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-029',
    '+22822251505',
    '$2b$12$AJRwvADX7Wb1Xf.O79thLui7JgLDF6aLMPHOZAmWrVQaLEyUwINKS',
    'Pharmacie LAUS DEO',
    'pharmacist',
    'pharma-029',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-030',
    '+22870402286',
    '$2b$12$EgjRDv.Mltvmb5vFleshVug.YxnxyWm9oMXhtsFsZ4hnDa3XiKdUO',
    'Pharmacie VITAFLORE',
    'pharmacist',
    'pharma-030',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-031',
    '+22870436534',
    '$2b$12$Ob8reDwVLofu1fFR.g09PetqgEpT3BX4bCbmzMNm2vtupU/jEy4ta',
    'Pharmacie MAINA',
    'pharmacist',
    'pharma-031',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-032',
    '+22870393939',
    '$2b$12$7uOo1.aWXVgMO.TAb6PYbudNj9.BNDxtBeTfLjPgRsPPdvCu.36zC',
    'Pharmacie ADOUNI',
    'pharmacist',
    'pharma-032',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-033',
    '+22891684804',
    '$2b$12$ABAZxkeClSi6vqByGX6vGev7Pz6qsraiGh9D60MWk6lb.Cpmvsucq',
    'Pharmacie IRIS',
    'pharmacist',
    'pharma-033',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-034',
    '+22893362626',
    '$2b$12$hL67VaMa.4uzOWkLnSoHG.r50NNXHToI2FYpCNVtWy9i/Gl5qxtlO',
    'Pharmacie NABINE',
    'pharmacist',
    'pharma-034',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-035',
    '+22822500405',
    '$2b$12$TpFEql4ecIIWaXE.qj1ZEOQH4XWvUOuA6qgdL7wB5GUHwLn6QXfoO',
    'Pharmacie ADONAÏ',
    'pharmacist',
    'pharma-035',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-036',
    '+22870429441',
    '$2b$12$VJ.OvIcNKmBDVovlyGDXUuAk40oGYqjAPA01Gx/HLV1DNoMSJVdxG',
    'Pharmacie TCHEP''SON',
    'pharmacist',
    'pharma-036',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-037',
    '+22870901960',
    '$2b$12$Kq2tW.OSrCeBaPFDMwmKg.7AbcYEeNIH/i2qrwIY/gm41cf9nXzKa',
    'Pharmacie LIDDY',
    'pharmacist',
    'pharma-037',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-038',
    '+22890885588',
    '$2b$12$lcexKTngXOYQ82z..5io9e86QHV6/nit78Cnnlol7DV/pTEjZmPzO',
    'Pharmacie AMEN',
    'pharmacist',
    'pharma-038',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-039',
    '+22893839100',
    '$2b$12$KEC35EMLYUG3/nNLgafcKeRBV6.YTABFMUeLe84wzDBBnCKTEW9Ge',
    'Pharmacie DIVINA GRACIA',
    'pharmacist',
    'pharma-039',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-040',
    '+22890174928',
    '$2b$12$gxXg5zpLSY4Mn2W0Rd2LMOCfHe73w7VVLSvCc03riV3/RdNNinEhe',
    'Pharmacie LA BARAKA',
    'pharmacist',
    'pharma-040',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-041',
    '+22822502447',
    '$2b$12$3xR10TXHWO7Ggwf9ubAX0uHaCKrD6CPMqalzdHZRb7riF5XBzMij2',
    'Pharmacie EXCELLENCE',
    'pharmacist',
    'pharma-041',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-042',
    '+22822256343',
    '$2b$12$FKpnrsPCW3s6sWoywEfOWO647k9MqmPRPIKZ6FUdwIxRVpj0OkNLS',
    'Pharmacie VITAS',
    'pharmacist',
    'pharma-042',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-043',
    '+22822554352',
    '$2b$12$S8CRl0c9Mi28xO4PUKoJ9udSOhRWw6spPfWh3sAVtGSAkOP1x1/.K',
    'Pharmacie ZOSSIME',
    'pharmacist',
    'pharma-043',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-044',
    '+22893515198',
    '$2b$12$UMzu9gAt1BqKGgjcL8Gv3OG16NIJ64BnF6C3gW5RqFOOQVra4RQKe',
    'Pharmacie SAINT SYLVESTRE',
    'pharmacist',
    'pharma-044',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-045',
    '+22890673324',
    '$2b$12$KBA1wggzusmfPMaxfEUiweNukOax2CSscUgF5zlhGxPCRU/1my2Gq',
    'Pharmacie ST PHILIPPE',
    'pharmacist',
    'pharma-045',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-046',
    '+22892163232',
    '$2b$12$4w94OlSwPQ9nOkPA69GIy.WR.zYI/R.qqCGPkuzJMn97nzkktnKpq',
    'Pharmacie EVA',
    'pharmacist',
    'pharma-046',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-047',
    '+22899470070',
    '$2b$12$0JdjtAWNUCYaQp3gGAdolOCjbbPP5epLN793udNtOZ938b4USnDxS',
    'Pharmacie NOUVELLE TULIPE',
    'pharmacist',
    'pharma-047',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-048',
    '+22892189485',
    '$2b$12$Nz5dFaM/pdIqaIKnNAzCI.l0TxJU2p1gpYvs9Y9fAvzlvrxgiw7wW',
    'Pharmacie GRATITUDE',
    'pharmacist',
    'pharma-048',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-049',
    '+22870421398',
    '$2b$12$7DyUJCS.6TAK6viaECVz0ONZtLNF69htlmJs7SAPpfvyrDPbVUFw.',
    'Pharmacie DE L''EDEN',
    'pharmacist',
    'pharma-049',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-050',
    '+22822270486',
    '$2b$12$tm0WVYN8zgPXInlPP.zc.etPFbJi8PPle5TooGvyQDgPOxFVuLXWW',
    'Pharmacie AVEPOZO',
    'pharmacist',
    'pharma-050',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-051',
    '+22890826767',
    '$2b$12$RWDY9wU/p1hynuaE9UTNE.goin8fM4D28C1ssrEW6f3VNBe8id2hq',
    'Pharmacie PRINCIPALE',
    'pharmacist',
    'pharma-051',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-052',
    '+22892620651',
    '$2b$12$oYlu/Z0sx/hbVenJyVLobe.OjfjgL7SWKrRgX/EmycJFAxZ/N2avq',
    'Pharmacie SIKA',
    'pharmacist',
    'pharma-052',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-053',
    '+22890413402',
    '$2b$12$uMcUxxWp4s0jf4LvKOv49e/IF5Dg/Fc.bvK4mvpZus3cHXjTnCztm',
    'Pharmacie AJP-ABOLAVE',
    'pharmacist',
    'pharma-053',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-054',
    '+22822210321',
    '$2b$12$8qTCu.N/etYd50RR3wx8U.jLRr5sSudf2aJJBH5z6CVEBhcARTwQ.',
    'Pharmacie BEL AIR',
    'pharmacist',
    'pharma-054',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-055',
    '+22822212964',
    '$2b$12$untKVZD/S9nk7TAkPHVlwe6Ob23nFiqZH1MP7fC7rLjLcFZYMDwpi',
    'Pharmacie MATTHIA',
    'pharmacist',
    'pharma-055',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-056',
    '+22896800970',
    '$2b$12$UWw9I39zB9OOP7FzOYWLs.RlC7Cyu0gg6gIGjcN2YJ3bI3kYgoek6',
    'Pharmacie STE RITA',
    'pharmacist',
    'pharma-056',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-057',
    '+22871338888',
    '$2b$12$3ZO5portGOF0ZbFMxWm/Ou6fIx2Aj9bjBW/5mtd./gpIi2SITT/b2',
    'Pharmacie CHÂTEAU-D''EAU',
    'pharmacist',
    'pharma-057',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-058',
    '+22822270434',
    '$2b$12$f9jw1UfOnNfXzeSl9Bhc3uhMdQOPaqFbwXqAG7hCIExWQsnYWGMAC',
    'Pharmacie OLIVIERS',
    'pharmacist',
    'pharma-058',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-059',
    '+22822213098',
    '$2b$12$tJqzy66wV/jaV7sFzvMxaOBM5GNSDuvDoWPfe5gSRVu8ccISQAvvm',
    'Pharmacie EMMANUEL',
    'pharmacist',
    'pharma-059',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-060',
    '+22822202759',
    '$2b$12$0tQeANyKcaykD4vtDjxEiuuGcm4K7OvdC7N48CYpPNeTXDkwFzXeO',
    'Pharmacie SOURCE DE VIE',
    'pharmacist',
    'pharma-060',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-061',
    '+22822219963',
    '$2b$12$xQHmqi9hEhRTi60NAEvrw.vW6scH1AuWGzIxc18aKolHtFoaaCRiC',
    'Pharmacie ST KISITO',
    'pharmacist',
    'pharma-061',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-062',
    '+22870448177',
    '$2b$12$Yziotd21zVCMuUHERYSfcusAdRCgBmI.QsBAq.N0GeZeTXk7/AyVS',
    'Pharmacie THERYA',
    'pharmacist',
    'pharma-062',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-063',
    '+22896800967',
    '$2b$12$Qx8TRzniH3b8aPtVMAAqcuvNDzg70oej/fSYe1It98rzGsDz0gA8y',
    'Pharmacie ST PAUL',
    'pharmacist',
    'pharma-063',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-064',
    '+22822615614',
    '$2b$12$fDCtza8YH.f1r9x6k0cnSuFT8awA710KHQvrJxUZULjDiK0.C35mG',
    'Pharmacie LE JOURDAIN',
    'pharmacist',
    'pharma-064',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-065',
    '+22896800927',
    '$2b$12$g6NIR.vQ2ar/CObxT5o4UOoOUinDhB2jhCTgwHpAGN78HrbeA0WtC',
    'Pharmacie HEDZRANAWE',
    'pharmacist',
    'pharma-065',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-066',
    '+22896801001',
    '$2b$12$AuNRYPPBY3jjl8acbNikjeolZeH1rsWh4wtQZFL/hYuSCt1gew452',
    'Pharmacie KOUESSAN',
    'pharmacist',
    'pharma-066',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-067',
    '+22896443108',
    '$2b$12$CtSqkUVEJS4IqcjO6n6mlepFs07/Rq8f8znya3ZJAyqQ78TcAauk.',
    'Pharmacie J-MIMSHAK',
    'pharmacist',
    'pharma-067',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-068',
    '+22822277164',
    '$2b$12$clSW4wmu7h.347iuxix3x.P4LcgX8x3HNghVEOjpem4/xO7UDlvmG',
    'Pharmacie UNION',
    'pharmacist',
    'pharma-068',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-069',
    '+22870458655',
    '$2b$12$WdbJSNb78I1BdQEs33.RSuKM8OXnGhwiKwENz4XX7HLfio49vRCtC',
    'Pharmacie LE PROGRES',
    'pharmacist',
    'pharma-069',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-070',
    '+22822511891',
    '$2b$12$OceriaDXxTPnhhm13TLGWOj4fbwKb49xFb7pQ4B5uIJPVTXLH8ykq',
    'Pharmacie ADIDOGOME',
    'pharmacist',
    'pharma-070',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-071',
    '+22890802639',
    '$2b$12$0Cp.1faNzXHzmkVlegyClOTCxnMtb1LR5lgv122LC3YOwXMgw1cfW',
    'Pharmacie SILOE',
    'pharmacist',
    'pharma-071',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-072',
    '+22890614644',
    '$2b$12$ZE946B837Funi5z0.XNBnOZoE.clL4TV89mgbSH2eys5WebRROmrO',
    'Pharmacie ACTUELLE',
    'pharmacist',
    'pharma-072',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-073',
    '+22892594935',
    '$2b$12$b/7J9VoxcAbLWuB5azsgQ./oLBPd7orGem6GbzNXDKNGq4BqbkTGW',
    'Pharmacie SEGBE',
    'pharmacist',
    'pharma-073',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-074',
    '+22892611700',
    '$2b$12$NhIUh99SGCMa7yvmkx69Mesvb9wOX.HOp3967bpgIUMmLocvcVoCG',
    'Pharmacie WASTINE',
    'pharmacist',
    'pharma-074',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-075',
    '+22822256512',
    '$2b$12$yAab3EpR5/QWYXpnKb7CM.9nwBl7A9cO2UgvS0r9jW63Hwvvl/zXS',
    'Pharmacie DJIDJOLE',
    'pharmacist',
    'pharma-075',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-076',
    '+22822257465',
    '$2b$12$Yk..j4MnzsVHhr4sS5LRgeg6xWwgTOqUeR2bbfsge98w4JyOoVJS.',
    'Pharmacie ST JOSEPH',
    'pharmacist',
    'pharma-076',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-077',
    '+22822516330',
    '$2b$12$s/5LQnfayp2gyqBNgRyI3uSjxoEboWU7MgoyqPoEDu3K02Tfw4tKK',
    'Pharmacie VIGUEUR',
    'pharmacist',
    'pharma-077',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-078',
    '+22870213197',
    '$2b$12$Jm5N0BxVwpbdE/EfMn1JbON5aG9DvTIZS.X.bbW4z2n/e6aIl6lVu',
    'Pharmacie MILLENAIRE',
    'pharmacist',
    'pharma-078',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-079',
    '+22870448459',
    '$2b$12$sJceC.Iz6127bseX.9JH0uz7xrPLuagIxUBssk9WBNZxOWNC7uvTO',
    'Pharmacie DIEUDONNE',
    'pharmacist',
    'pharma-079',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-080',
    '+22870404425',
    '$2b$12$UMYRHcl8vI2B2cIl0X/JXuu6Z3KtT7U84kJLGEnZokp5KqVUlF5Zm',
    'Pharmacie OSSAN',
    'pharmacist',
    'pharma-080',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-081',
    '+22893504255',
    '$2b$12$inSzuAT5rgW69Fsy303K/.zOwCV/wL4wkoiLTtMyXW1C2Wd16/iG2',
    'Pharmacie APOLLON',
    'pharmacist',
    'pharma-081',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-082',
    '+22898772153',
    '$2b$12$QfEuBQ6FjWmy5GIhD9uDye5L/aM9tvJMhXq1d7A5sVGtCyHYPFErK',
    'Pharmacie YESHUA',
    'pharmacist',
    'pharma-082',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-083',
    '+22870193535',
    '$2b$12$aV7bmmeGFiapb/uoF9LIneiQT1UDlX4zs8zWO0m8jEyk4nJ9Q9y66',
    'Pharmacie CLEMENCE',
    'pharmacist',
    'pharma-083',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-084',
    '+22822517022',
    '$2b$12$TKAgC75sq9WdooNqYTVu/.H90.su0sVWu9UZiLaLkIRtOt75P28BS',
    'Pharmacie ST MICHEL',
    'pharmacist',
    'pharma-084',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-085',
    '+22892300656',
    '$2b$12$WMiaRISQ4Duu9F4R0rAefeyKe17mc/UddS6cisr8lA6gSFmPHggPi',
    'Pharmacie LE ROCHER',
    'pharmacist',
    'pharma-085',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-086',
    '+22892616608',
    '$2b$12$MvreezzXXUaqH1aBLmQxW.GzowvfXEJgjwikGkqTV0RahKCcL2b/q',
    'Pharmacie ZILIDJI',
    'pharmacist',
    'pharma-086',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-087',
    '+22897799374',
    '$2b$12$FPDEKIMjygYQUWldYwJWPehOTywQhRJxXJCEK7J6geLU1HlNDsNX.',
    'Pharmacie EL NOUR',
    'pharmacist',
    'pharma-087',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-088',
    '+22893087676',
    '$2b$12$aC/AIWbk/ErBwttDv3b6QebNbWDGY37n4JTmCHgE7Ynt/D7S3Cq0y',
    'Pharmacie ASSURANCE',
    'pharmacist',
    'pharma-088',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-089',
    '+22893704812',
    '$2b$12$7X.Bn6dUc6S0mmlpvRqMD.NQslj6OsWCNATnc9Py63lYIT9w6IL1u',
    'Pharmacie KOBOYO',
    'pharmacist',
    'pharma-089',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-090',
    '+22893084640',
    '$2b$12$P0eAVwZCKmCTSo/cvgyfp.2WwnwQlK..EmMACDfpc8ESoVCifkcBW',
    'Pharmacie DENIS',
    'pharmacist',
    'pharma-090',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-091',
    '+22822501000',
    '$2b$12$090pCZGoJH9WWqJm0W.sD.55wiqhYbz3H7YjIBKJzae9B0Dy4hoOm',
    'Pharmacie ABRAHAM',
    'pharmacist',
    'pharma-091',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-092',
    '+22822259447',
    '$2b$12$Gkbild6asB02Y6Ei7I69delpzKCkO4o6HTae3S.Qz.Q0DoMKLF.2i',
    'Pharmacie ALTA',
    'pharmacist',
    'pharma-092',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-093',
    '+22893402121',
    '$2b$12$0cZKCKIP97mBhDrGllASD.ZMz2dAXrDi1WivpZ6eTBUZD9f3P4qbS',
    'Pharmacie LA MAIN DE DIEU',
    'pharmacist',
    'pharma-093',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-094',
    '+22822550815',
    '$2b$12$S/IPmWDZgNy3oRgDPylIsOe3husbgiWLnovI4bnieh2Y1cvVfKN/a',
    'Pharmacie GANFAT',
    'pharmacist',
    'pharma-094',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-095',
    '+22896283410',
    '$2b$12$xQcU0bw99L8ignUOqOu/pePCZbpxketxBevy5fDzAtDhCqxmF.Ozu',
    'Pharmacie ZOPOMAHE',
    'pharmacist',
    'pharma-095',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-096',
    '+22897534444',
    '$2b$12$QmtqQMLFtITzbhJVJFu7juOS3hGCJ3DcvCUoxkws86sK/Iae6UmA2',
    'Pharmacie EL-SALI',
    'pharmacist',
    'pharma-096',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-097',
    '+22899349797',
    '$2b$12$BLf1jgXaeelhkiy8g6y6veHwQ2j9t.o7oG16xDEAZyrh7ahgCQqpa',
    'Pharmacie MAWULOM',
    'pharmacist',
    'pharma-097',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-098',
    '+22893263600',
    '$2b$12$B8kHRG5rgT1F411vPDidnuFWTwJyBKIsfdG661/gxhwkoV.9hG3zW',
    'Pharmacie A DIEU LA GLOIRE',
    'pharmacist',
    'pharma-098',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-099',
    '+22822504860',
    '$2b$12$5XOqmCJVuQPESM2AWK/mb.4PxluZ.R8dQbRa1MCRSnAJzI8xsJA3.',
    'Pharmacie OBSERVANCE',
    'pharmacist',
    'pharma-099',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-100',
    '+22899273636',
    '$2b$12$QC8yelCHa0o2pyNC.yD0Oekw/qQoFIFXQOtpXJNK9WzSLNWXMK1yO',
    'Pharmacie HYGEA',
    'pharmacist',
    'pharma-100',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-101',
    '+22890019029',
    '$2b$12$IRIioU/JhB34MgEP6gLXl.YVxdzX6jCJHRoL9fErkGMybERbbJJ0a',
    'Pharmacie VERSEAU',
    'pharmacist',
    'pharma-101',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-102',
    '+22896981515',
    '$2b$12$akMrap4J4V3GWWJYWjLLguytU2FgkYKj9Ab/LLIp6qEe1QTohJFMK',
    'Pharmacie HELENE',
    'pharmacist',
    'pharma-102',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-103',
    '+22870416836',
    '$2b$12$.uSepRXAWm3n/OoY08j2u.EycJ8anPSY91glM.AXG4f0JUImWIjVu',
    'Pharmacie LUMEN',
    'pharmacist',
    'pharma-103',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-104',
    '+22822220801',
    '$2b$12$2aEjbJp9CCXCmD/Xj9lx3OeQyqRTpBQOatEVB7gN7D3wPle20jKeG',
    'Pharmacie JEANNE D''ARC',
    'pharmacist',
    'pharma-104',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-105',
    '+22822218847',
    '$2b$12$7ONIH4vcwqZnuO4uJLqlAuyMZY0/UVHXao.1UbcKehyY.fFzi7K96',
    'Pharmacie ETOILES',
    'pharmacist',
    'pharma-105',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-106',
    '+22896329760',
    '$2b$12$tFwZspnS/AKULcWscePCpeNJHKTvAyWVz3LPlhnh.Ejt6gdmk14d2',
    'Pharmacie AMESSIAME-BE',
    'pharmacist',
    'pharma-106',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-107',
    '+22870453805',
    '$2b$12$4DTKF.4O4r8b8XdLyUXkB.QqvAS/kQHCtuhcQfqTKqPlkOeE72oam',
    'Pharmacie DES APÔTRES',
    'pharmacist',
    'pharma-107',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-108',
    '+22822226277',
    '$2b$12$wn2t1gW0W9LNFyKgtIFek.NojAWcwIRNlZXlpCOx3bneIyBIb2uzO',
    'Pharmacie OCEANE',
    'pharmacist',
    'pharma-108',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-109',
    '+22870499500',
    '$2b$12$aNGtrnkBH7RvBadj/90yvesGqESaXfkQQuFX9v6hGMTI5mBmVu4ha',
    'Pharmacie ADJOLOLO',
    'pharmacist',
    'pharma-109',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-110',
    '+22822200808',
    '$2b$12$HBVTpZw5x2rGRsIIHJUM/OVIwQD0Gf.TrSt39rgxZxI7ZuK3zHFSe',
    'Pharmacie HOPITAL',
    'pharmacist',
    'pharma-110',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-111',
    '+22822217447',
    '$2b$12$zKgGvQXGDC7ljnA.PhUMV.BiYqzlWNbbPm5qX4.INZSFzymv0NPs.',
    'Pharmacie AMITIE',
    'pharmacist',
    'pharma-111',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-112',
    '+22896800885',
    '$2b$12$leSqMqjwMwSP84n1pcrdEuT2O..7yxtGDEcvRS5AxxRmgEpRfEgSa',
    'Pharmacie CAMPUS',
    'pharmacist',
    'pharma-112',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-113',
    '+22822260320',
    '$2b$12$gySqE60sy1ZCoNQa2dXADudY40GG8Cv/wkFBYcD79oc9VrKIgEha6',
    'Pharmacie BAH',
    'pharmacist',
    'pharma-113',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-114',
    '+22870445924',
    '$2b$12$W1ZEZlEJBBzdspMLCelNeefyeTvF.Id07AXmZPuw6vKQR/mQqZbQ.',
    'Pharmacie CITRUS',
    'pharmacist',
    'pharma-114',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-115',
    '+22870448387',
    '$2b$12$XaZ2.jK12TAQ7gvT7Yyf3OL0sfY8wsVXfC257HAR5r16JDm1TSIyC',
    'Pharmacie ISIS',
    'pharmacist',
    'pharma-115',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-116',
    '+22822267651',
    '$2b$12$foRTrYIaXdm7FWS8ehAKruaZfyBqi6ai/h5F1YfxBkMiCNY7eRUoq',
    'Pharmacie YEM-BLA',
    'pharmacist',
    'pharma-116',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-117',
    '+22822268155',
    '$2b$12$4K0ovHG0tUxL2g2PZj55yefMyHHdOw3gOOEUkLFNTA6b/oHJoMz7G',
    'Pharmacie FRATERNITE',
    'pharmacist',
    'pharma-117',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-118',
    '+22822615775',
    '$2b$12$kDfucKKNSL2LA6uNVtvAMeUqJrBuBsReDvtXlauzx2vVDXooLGuou',
    'Pharmacie APOTHEKA',
    'pharmacist',
    'pharma-118',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-119',
    '+22870459186',
    '$2b$12$d1C12rHeNDbAe4E2.8maEu9Gn.of1Yo8mHVwiX8nX9M/vA1XuDMVK',
    'Pharmacie MAWULE',
    'pharmacist',
    'pharma-119',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-120',
    '+22822719595',
    '$2b$12$Z9aPmjOaWtDcdTCHKOayVOV2wfU/n56oE7LGFojEjZoK1a8V.p3ba',
    'Pharmacie FIDELIA',
    'pharmacist',
    'pharma-120',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-121',
    '+22870426902',
    '$2b$12$7QGYMw8o0JGZlZX.29te8OCuSVegNG2CvJ/d3gIZ3QzUAda7BBOx6',
    'Pharmacie SARAH',
    'pharmacist',
    'pharma-121',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-122',
    '+22899911342',
    '$2b$12$.QVdYCQL8ubgdxvd0Aieu.ZqDVynbZzHGu0.nRTa0qTzjjus1h2eK',
    'Pharmacie ELI-BERACA',
    'pharmacist',
    'pharma-122',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-123',
    '+22896800996',
    '$2b$12$wUEIJqDbOO3aUODbFtjdj.jlhCh3zgeEUhhNif.l18Ce72wy8QOua',
    'Pharmacie LA REFERENCE',
    'pharmacist',
    'pharma-123',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-124',
    '+22822507431',
    '$2b$12$LwtpImkFlcXndSFYlcmSkeGcPOZRuDARMQRyHmAbaksFdI5wxfhNq',
    'Pharmacie BONTE',
    'pharmacist',
    'pharma-124',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-125',
    '+22890494456',
    '$2b$12$XQR8MrF8il3XAKuQKm1JHu909aHMtnGE.LYLR8Gii8uMfYXn7EmNi',
    'Pharmacie AZUR',
    'pharmacist',
    'pharma-125',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-126',
    '+22892531293',
    '$2b$12$toVerFgoItKYVODQczceh.nEN3ZChR7L1SdOuELMOnoMLbiFLO0Fq',
    'Pharmacie AURORE',
    'pharmacist',
    'pharma-126',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-127',
    '+22822512286',
    '$2b$12$B05gheXo6M51Okh42kwvsOrJXdIO9R8BpDcQxHAKHv0.LuV7EHtVu',
    'Pharmacie JAHNAP',
    'pharmacist',
    'pharma-127',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-128',
    '+22870157846',
    '$2b$12$X6.p8bP1VmonGVWCwe2LdOdO5qU9H/objO5y7OvHvUFg.wGBgdPza',
    'Pharmacie CONFIANCE',
    'pharmacist',
    'pharma-128',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-129',
    '+22870431549',
    '$2b$12$6gu2kIstrmi5vj/ygAqELuzEyrdmEV1L4oA.M4juvOkA3JbOxoVxm',
    'Pharmacie LUMIERE',
    'pharmacist',
    'pharma-129',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-130',
    '+22899982087',
    '$2b$12$J5..6TujbuRc2tEpMmh0S.qWGLWPrHf.SIBV5pEJrj83LAt158vXa',
    'Pharmacie GROUPE C',
    'pharmacist',
    'pharma-130',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-131',
    '+22893431049',
    '$2b$12$4zI8/TAWVEOHWFaXbaMSd.mbQW0Ncd5o.V9KhzaoE59dSfIfsLaE.',
    'Pharmacie DES ORCHIDEES',
    'pharmacist',
    'pharma-131',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-132',
    '+22870457492',
    '$2b$12$HszZeubkVxkdWuSzcQsReeUim/yMjL0yKpaEulMSdnjgf40YNpJiW',
    'Pharmacie DE LA VICTOIRE',
    'pharmacist',
    'pharma-132',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-133',
    '+22822503707',
    '$2b$12$aPwi8otnjXeOePI2DAvbrO./8BD/zSQ1LERjc1xOPQWAtNjth5vt2',
    'Pharmacie SOLIDARITE',
    'pharmacist',
    'pharma-133',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-134',
    '+22870425000',
    '$2b$12$EW6.w/PSayfcAY5d98VKbOGvcA6DObPJq9GHzk7qsOJxLx0.Rr0Ea',
    'Pharmacie ARC-EN-CIEL',
    'pharmacist',
    'pharma-134',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-135',
    '+22893587823',
    '$2b$12$Xr06IJCrvtBG5xF18R0n4.4WthTZy9LzSN2buUaADVmALdlTwgvH2',
    'Pharmacie SHALOM',
    'pharmacist',
    'pharma-135',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-136',
    '+22822258338',
    '$2b$12$Iv9GWY/XOHcVG8U7m1S6Y.zQs5hacTEbgpORpBP4sGDAJ.qtNlh2W',
    'Pharmacie AGOE-NYIVE',
    'pharmacist',
    'pharma-136',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-137',
    '+22891911535',
    '$2b$12$OrWqwonguAIg/kEudCUWSOu45eFNjUlBXHrwDz5eBFz9DMdsgS4dW',
    'Pharmacie SALA HOUBEIDA',
    'pharmacist',
    'pharma-137',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-138',
    '+22891551804',
    '$2b$12$T62hxxtfPyKnP2nrhGO3X.bTcwN5aAN3bgprh1f16aGq8aavNZhH2',
    'Pharmacie TAKOE',
    'pharmacist',
    'pharma-138',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-139',
    '+22870499655',
    '$2b$12$/DoD78qS1NfC4Ox6JhlutOKxId403axdS758VgBoLixCLw0IWo9P.',
    'Pharmacie ZONGO',
    'pharmacist',
    'pharma-139',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-140',
    '+22892340680',
    '$2b$12$UMPIFOWJka.Knzp1.F5B1eghoCFMepgBjnVRI3t18ZV63k8mUDNxu',
    'Pharmacie ELEMAWUSSI',
    'pharmacist',
    'pharma-140',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-141',
    '+22870448517',
    '$2b$12$763iUR4ldKCgyoz1tSBX2u1gcdK8.2xI472EF1oHxdontrc9tcSqK',
    'Pharmacie SATIS',
    'pharmacist',
    'pharma-141',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-142',
    '+22870776942',
    '$2b$12$qTMgXeTg601fFsoNaryrDeD8VgoUv1PubehQhf6BymCOVLxulva5W',
    'Pharmacie DAFEANNE',
    'pharmacist',
    'pharma-142',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-143',
    '+22822251260',
    '$2b$12$HI8QuUP59DkVZ//xovYZBeauqQH/EKbhpne3wzVrLHIFl0twSQJiW',
    'Pharmacie CHARITE',
    'pharmacist',
    'pharma-143',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-144',
    '+22890106092',
    '$2b$12$wOXjdcJ7.0P73UOOAb65T.cweXGhnThv.gs8YYIqhrR.Vi06av0IS',
    'Pharmacie MAA-LA',
    'pharmacist',
    'pharma-144',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-145',
    '+22870428080',
    '$2b$12$fuCGXHcQpqwQBu5h6/WPjOsEBITnAZ9uOMeKBmTmFpltQonZ3YtWm',
    'Pharmacie SANGUERA',
    'pharmacist',
    'pharma-145',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-146',
    '+22891838783',
    '$2b$12$B.EWUx80Zh1q1x47VzQW1erPNK6DJSberq3Ma9v54r96s1VXbCeyy',
    'Pharmacie SAG''BIBA',
    'pharmacist',
    'pharma-146',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-147',
    '+22893339205',
    '$2b$12$KWE6Sv7DE.hmtr8LGqVm2OVQRKa/NYyFKi77FcOa/u1hTsm6H1b0.',
    'Pharmacie LA SHEKINAH',
    'pharmacist',
    'pharma-147',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-148',
    '+22892011100',
    '$2b$12$wNm9NlodYBRLDSeK3NKOJeD1LeNTMRbZzDjeXn5TY8vTaP0TGZ0QK',
    'Pharmacie NELLY''S',
    'pharmacist',
    'pharma-148',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-149',
    '+22870423464',
    '$2b$12$EOe0Rk2vNebpc1PshvKi7efYYs13GKSZwIeY7v8XtiDr29l8kRMFq',
    'Pharmacie MAWUNYO',
    'pharmacist',
    'pharma-149',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-150',
    '+22870278181',
    '$2b$12$iqOqOFbIZp.s.wPVVCvAl.fVjf9PkcTfn3w0ogHOGGeW2CD8xBEaO',
    'Pharmacie M''BA',
    'pharmacist',
    'pharma-150',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-151',
    '+22893258036',
    '$2b$12$wMqSrqYgvNqRRyMRoS8ahutR7QJ4ksuOGL5PkMzmsA7UNh/2ZeIYW',
    'Pharmacie TRIOMPHE',
    'pharmacist',
    'pharma-151',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-152',
    '+22892034040',
    '$2b$12$hu6CdoKbgVVnJ1tnNyVOMOt8YtWQGKYlnkLKyC4tIHIXyENhA2656',
    'Pharmacie VERONIQUE',
    'pharmacist',
    'pharma-152',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-153',
    '+22870411541',
    '$2b$12$cbVqxd6nvIHsYgUBHxY79eueERmyeqdZ32UJjPgN2r1JZR/qH2Key',
    'Pharmacie LE DESTIN',
    'pharmacist',
    'pharma-153',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-154',
    '+22892859794',
    '$2b$12$xxKpevw1npE6Jl/v3FmP.OyRiqpMDKevjGm5WEf3CvojExD5QfFWa',
    'Pharmacie SAINTE MARIE',
    'pharmacist',
    'pharma-154',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-155',
    '+22893404040',
    '$2b$12$XzB51/ryRmadpsB8xIWWZ.xd7QSMru5DkY4AFIrThfHZJN2A4EMXu',
    'Pharmacie SAINT PIO',
    'pharmacist',
    'pharma-155',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-156',
    '+22822211367',
    '$2b$12$jkiMmoc71Ele8v7z1K6RauFjhy9V4tbgmVvpkVFcXBc1V0eSLx5Jy',
    'Pharmacie BON PASTEUR',
    'pharmacist',
    'pharma-156',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-157',
    '+22822215227',
    '$2b$12$2PmUH6vdRf6BnSMPqb0OVOYJLmfNpE/9QY/1TdLAv4pcC9kfSD4/G',
    'Pharmacie 3IEME ARRONDISSEMENT',
    'pharmacist',
    'pharma-157',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-158',
    '+22822345093',
    '$2b$12$D5NtvxZ.M/szkxGafqhHvegkjZ3jqsraWVpHHdaxdzNLW4lkUDHzq',
    'Pharmacie BIOVA',
    'pharmacist',
    'pharma-158',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-159',
    '+22822276188',
    '$2b$12$waj0DOOpiwnjEJWrJibw7e0xiaij8VUnOLQ8RM1V89VlQ7wizqARO',
    'Pharmacie PORT',
    'pharmacist',
    'pharma-159',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-160',
    '+22822216205',
    '$2b$12$Fe09IuLP4zcMDCj5MFK40.VJyukdx3RW/OtXKrkvXX4FQaeTzMBAy',
    'Pharmacie OCAM',
    'pharmacist',
    'pharma-160',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-161',
    '+22822204242',
    '$2b$12$cOwcprEPaUtZRurbQNp1U.KHqdDg.q/hqLqTKUUO9PzRMhOJbG1By',
    'Pharmacie HORIZON',
    'pharmacist',
    'pharma-161',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-162',
    '+22896800931',
    '$2b$12$LadMfMWy4GS78X6AB.YlQObBEnHO2JmlNId68P9S09D/FmIcifDHy',
    'Pharmacie JUSTINE',
    'pharmacist',
    'pharma-162',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-163',
    '+22870200000',
    '$2b$12$V32Pf4zmphB.zA0M58om9OnDSh8H574DzQfpu7uSUNG6jph1G2KMe',
    'Pharmacie AGBEGNIGAN',
    'pharmacist',
    'pharma-163',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-164',
    '+22870457674',
    '$2b$12$VF9MUIJppvNyTDG.zkRpKe6TpMNi6Je6SIUtrHo1yqs0KsIL9Ic.G',
    'Pharmacie BON SECOURS',
    'pharmacist',
    'pharma-164',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-165',
    '+22896801012',
    '$2b$12$xWQLbex92/mTFWr0/CbnqO0v/6voEq55UeVF3sPtYB9zblhwif2Ua',
    'Pharmacie NOTRE DAME',
    'pharmacist',
    'pharma-165',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-166',
    '+22896800991',
    '$2b$12$C8hDTmksol95uEnwWcsx1O3m.72HBuXVJDFkxYnZX5ZzXr0uWAFFa',
    'Pharmacie LA PROSPERITE',
    'pharmacist',
    'pharma-166',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-167',
    '+22891183333',
    '$2b$12$2iLJdK2RYvhzqljOugEcQuYhnjTtH5wI3ndIp1tsydcMfsOfVGRxi',
    'Pharmacie MADINA',
    'pharmacist',
    'pharma-167',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-168',
    '+22822261973',
    '$2b$12$XcpmtgemnVWNvuUcFMqAtuFfgJefqj/Sf0FkRn9uHjH/C0tH3NJDW',
    'Pharmacie ST PIERRE',
    'pharmacist',
    'pharma-168',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-169',
    '+22896285713',
    '$2b$12$uQZtiqeKhBuwxP3pi98vc.m5SbpftvI.4urU80ZPh/KG2ICnu/Jti',
    'Pharmacie DEO GRATIAS',
    'pharmacist',
    'pharma-169',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-170',
    '+22822613729',
    '$2b$12$QTjv2J7a2fYlu2NdSTIvgukJum9Rg.mLVTLWTcWDrQOIf5JCcRD3G',
    'Pharmacie PEUPLE',
    'pharmacist',
    'pharma-170',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-171',
    '+22897726969',
    '$2b$12$7OxGAfOnzod7rf0MjVI6D.1bjPWmjautEFyH5JxQdHX8BabXPrDbS',
    'Pharmacie BA-AYETA',
    'pharmacist',
    'pharma-171',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-172',
    '+22871901166',
    '$2b$12$TEagtglxdhUeHpMWEPR/7ukfGaeBNDtke53mGMknFe9kjzpDjgkf6',
    'Pharmacie O GRAIN D''OR',
    'pharmacist',
    'pharma-172',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-173',
    '+22870346565',
    '$2b$12$5H8V70Gb.lH3Hqv51H64DubYwO9ICA0GdqKgNKTNIG6vWn1ElWafS',
    'Pharmacie SEPOPO',
    'pharmacist',
    'pharma-173',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-174',
    '+22896379425',
    '$2b$12$.f4NP41YdnOeFb/zhWoluuVOI0CwORYP9ijOAvInsQgakOfewhaAe',
    'Pharmacie 2000',
    'pharmacist',
    'pharma-174',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-175',
    '+22822252370',
    '$2b$12$QzTwnZvRcOO5hUQgcJn0feS65CFwyGJrqXVxPNmWz5Q5Ziz57S6hu',
    'Pharmacie BETHEL',
    'pharmacist',
    'pharma-175',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-176',
    '+22822517575',
    '$2b$12$0X6uUiIAfp4bdUJuJD.DM.Vc4qHGTuE7ZFRHr1cn9FXqHEjiYZBIW',
    'Pharmacie DES ECOLES',
    'pharmacist',
    'pharma-176',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-177',
    '+22899733932',
    '$2b$12$c8OCEuwymgEJJwMDJRW2MuVXQwoI6ezFtv/aRgNc5ar/KEQ.XUPOq',
    'Pharmacie EL-NISSI',
    'pharmacist',
    'pharma-177',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-178',
    '+22897776959',
    '$2b$12$hvq04Q40LYFp1dimS4ocfeQE79QSxKHY9FQK5f2sVrZTGiCJ6bZ4e',
    'Pharmacie HOSANNA',
    'pharmacist',
    'pharma-178',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-179',
    '+22870445159',
    '$2b$12$lO5YBif7rj748KzzUiO.NORi2Bsa2iLy0wiKzTfg7h1EY8ow7wcSS',
    'Pharmacie MAGNIFICAT',
    'pharmacist',
    'pharma-179',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-180',
    '+22892961919',
    '$2b$12$2KgQejeLgh0ahtA/9NIfN.03vkFYMdadFIvvVnQJZoxwzlVXoouIm',
    'Pharmacie GREENRX',
    'pharmacist',
    'pharma-180',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-181',
    '+22893025212',
    '$2b$12$p4W4IfI.1P.GIxmLGYLPa.uK5c8wq75gd0iVjlBkPQ1pqrEraNDJS',
    'Pharmacie MATHILDA',
    'pharmacist',
    'pharma-181',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-182',
    '+22822514425',
    '$2b$12$g0qyokmCDXcvEb/4fHl9cOhTvmqq7gG2TWtNDoDVBActzG8Y0ea2e',
    'Pharmacie EL-SHADAI',
    'pharmacist',
    'pharma-182',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-183',
    '+22822558646',
    '$2b$12$9e8yA5DGT6c9qSeK.I.ayO3rlmaRe.kQcCGsU1ONUBGOayK/jJVtu',
    'Pharmacie ENOULI',
    'pharmacist',
    'pharma-183',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-184',
    '+22822517171',
    '$2b$12$AafpkbSCqoYXH7/Lucmpm.AGxwzdVzJWnFmfTrj.GfFGwPGEpQAR6',
    'Pharmacie LE GALIEN',
    'pharmacist',
    'pharma-184',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-185',
    '+22870423772',
    '$2b$12$QCCNqjWypwqlXJ7P1W9.k.x4C6d6x99CFdw4AkaeV6ZyxSwgdnPWq',
    'Pharmacie DES ROSES',
    'pharmacist',
    'pharma-185',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-186',
    '+22896801011',
    '$2b$12$DMAVEJEymIQKjXeBWPCmuemcx6PLtX/AkaaCs1FwDzyidtSHuqasO',
    'Pharmacie BETANIA',
    'pharmacist',
    'pharma-186',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-187',
    '+22870422360',
    '$2b$12$8fymlfeWdwJZqWdlkSbDPueMp4XKzTcjjaF2B.VhrOcfR45IFBfze',
    'Pharmacie VOLONTAS DEI',
    'pharmacist',
    'pharma-187',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-188',
    '+22870432585',
    '$2b$12$RZZQZfdK.E1OaFIdWjQrye0SBPW1gs1f/8SBDFGA6IesyAcZGCC7.',
    'Pharmacie EL-SHAMMAH',
    'pharmacist',
    'pharma-188',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-189',
    '+22870440101',
    '$2b$12$nDMIxgCmeTWifmHrL9We2.Q7u4a6cTYILB/dJgCCSlUqzdyELVb0i',
    'Pharmacie NOTRE DAME DE LOURDES',
    'pharmacist',
    'pharma-189',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-190',
    '+22822259165',
    '$2b$12$eWRmhCA2697GxWBYdVswSu8.LEqrJ3o63a3Prbd3V9OQxw8RJEspW',
    'Pharmacie LA GRÂCE',
    'pharmacist',
    'pharma-190',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-191',
    '+22870459858',
    '$2b$12$xfZPt40Bvr9FjeAy29/9/uvN86Yp39roXaZvaizttEBFRD8sJfXIO',
    'Pharmacie REGINA PACIS',
    'pharmacist',
    'pharma-191',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-192',
    '+22899858907',
    '$2b$12$bpe3KYV8BM/wSpGaFbk8LerzftS2eoZ8jPSIg.T7qXyPNdgUr5Kti',
    'Pharmacie ESPACE VIE',
    'pharmacist',
    'pharma-192',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-193',
    '+22870709898',
    '$2b$12$SQtMn8bRyclHbK6D5bZH4eRlDWh8s8j/nrKm/mKLHOrjBE8op7fmO',
    'Pharmacie AUREOLE',
    'pharmacist',
    'pharma-193',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-194',
    '+22870402540',
    '$2b$12$RGRGB48nDeXt5BYTey6zZu3YKLBO1cc1lB8wFqNXq1VpmQRTPxzyK',
    'Pharmacie EMMAÜS',
    'pharmacist',
    'pharma-194',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-195',
    '+22870424777',
    '$2b$12$w0tRIp.epj6rwzmEgrdgpOBm/e2bs4VtNFRnRF5FO6KtWn3m0UJWu',
    'Pharmacie BAGUIDA',
    'pharmacist',
    'pharma-195',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-196',
    '+22870457014',
    '$2b$12$ym7DdW/o.onrGSdUDBO0S.UrCfCWLroqNUdFFUc1fQ82VU9VwrDq2',
    'Pharmacie LA FLAMME D''AMOUR',
    'pharmacist',
    'pharma-196',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-197',
    '+22870052339',
    '$2b$12$C5dxDzyFcB4HjZGEWKVswOT9UwNatnUYbSbwvOJdt0.53ef1apEGS',
    'Pharmacie LA PATIENCE',
    'pharmacist',
    'pharma-197',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-198',
    '+22822209091',
    '$2b$12$atUCAXvoy5GYpV05yw9s0OvUVczg8Wsss5fmusKPqvJTiv/nOazBK',
    'Pharmacie CRISTAL',
    'pharmacist',
    'pharma-198',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-199',
    '+22870442503',
    '$2b$12$kEScFFnNjJRtJnrWmVoVg.djRLfz51jbJ20j2tCzC.A7fyI4PcXna',
    'Pharmacie BE-KPEHENOU',
    'pharmacist',
    'pharma-199',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-200',
    '+22822210128',
    '$2b$12$DTLo7aqS57Nf9E2KEyWDneddGmXW.84CYPpUGYpwTk01Wt/QiwXYq',
    'Pharmacie ESPERANCE',
    'pharmacist',
    'pharma-200',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-201',
    '+22822222841',
    '$2b$12$IGvMt8DD2s9N1KsPWK5zCO48zwQamZ.LINNmG5AHIDEELwNlzpe5.',
    'Pharmacie ROBERTSON',
    'pharmacist',
    'pharma-201',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-202',
    '+22891613332',
    '$2b$12$LduAjn/Fy.kZbRuLHa/rJOnYGa3.sZy5yss1104cA/zOixRJfogLq',
    'Pharmacie RAOUDHA',
    'pharmacist',
    'pharma-202',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-203',
    '+22898465088',
    '$2b$12$AbkKmmuDRFy7bT4fK/J58ul.V4ce8JgrpHgnr31RAk1pyNo6SI5Ha',
    'Pharmacie N.D. DE LA TRINITE',
    'pharmacist',
    'pharma-203',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-204',
    '+22822261177',
    '$2b$12$eWkOd1EH8FuNA6Xq8MIqf.ak5VneFoxZW0HauTpRs3eBuWZrcvYZe',
    'Pharmacie FOREVER',
    'pharmacist',
    'pharma-204',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-205',
    '+22870010303',
    '$2b$12$RnK6vuEDZYK0bB7ZVOWU6eHZBulXxSRCzNcDBTjUxz5MpgZvENV12',
    'Pharmacie SANTA MADONNA',
    'pharmacist',
    'pharma-205',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-206',
    '+22822264516',
    '$2b$12$JdqMphf1LPH5eaOanpl6NOZ1GzYDQAT8YQiNSNc4Mw.s4lbMhWr6W',
    'Pharmacie BIEN ETRE',
    'pharmacist',
    'pharma-206',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-207',
    '+22892953838',
    '$2b$12$ST0YIetyq5A34rWrXxcLFeVYNm5pyY5yrpskBcl0BAzw43NhZOTIW',
    'Pharmacie KELEGOUGAN',
    'pharmacist',
    'pharma-207',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-208',
    '+22891541616',
    '$2b$12$W41PwpkFrsMf21PzZxKAleWOe5M/ZBXpth7M8Gi5OfJKtqTBTxryu',
    'Pharmacie LA RUCHE',
    'pharmacist',
    'pharma-208',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-209',
    '+22822216549',
    '$2b$12$/gzIiaC4UIxmuzS2zKWb3e5g3GwmEn1hEz323AyjIBrpr4HWYpcS6',
    'Pharmacie BOULEVARD',
    'pharmacist',
    'pharma-209',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-210',
    '+22870499663',
    '$2b$12$ORy6PCI2I2GscpFDcRJbreKyFwihi0RmIReayEVdzF/I501H7rVmK',
    'Pharmacie HANOUKOPE',
    'pharmacist',
    'pharma-210',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-211',
    '+22822218990',
    '$2b$12$PazazMvCPIF7m4FGh/KpauJyYMZxE/uiDcq0y/09FmJVyOLwM0lyy',
    'Pharmacie KODJOVIAKOPE',
    'pharmacist',
    'pharma-211',
    TRUE,
    now(),
    now()
  ),
  (
    'pharma-user-212',
    '+22870402906',
    '$2b$12$hiXfPgpA9SmTsWBu/rodkeWV0v4vRyXkpXiHkec1f6h4Qnb7YywX2',
    'Pharmacie ST ESPRIT',
    'pharmacist',
    'pharma-212',
    TRUE,
    now(),
    now()
  )
ON CONFLICT (phone) DO NOTHING;

COMMIT;

-- ─── VÉRIFICATION ──────────────────────────────────────────────
SELECT 'Pharmacies créées' AS info, COUNT(*) AS total FROM "Pharmacy" WHERE id LIKE 'pharma-%';
SELECT 'Comptes pharmaciens' AS info, COUNT(*) AS total FROM "User" WHERE role = 'pharmacist' AND id LIKE 'pharma-user-%';
