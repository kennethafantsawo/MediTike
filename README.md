<div align="center">

# 🏥 MediTike

### Connecter patients et pharmacies pour un meilleur accès aux médicaments au Togo

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

---

## 📖 Présentation

**MediTike** est une plateforme numérique togolaise qui met les patients en relation directe avec les pharmacies de garde. Lorsqu'un patient a besoin d'un médicament, il envoie une demande unique qui est transmise instantanément à toutes les pharmacies de garde de sa zone. Les pharmaciens répondent en temps réel avec la disponibilité et le prix, et le patient peut contacter directement la pharmacie qui a son traitement.

### 🎯 Le problème

Au Togo, trouver un médicament en urgence — la nuit, le week-end, ou dans un quartier qu'on ne connaît pas — est souvent un parcours du combattant. Il faut appeler une pharmacie après l'autre, tomber sur des répondeurs, faire des déplacements inutiles. Pendant ce temps, le traitement est retardé, parfois avec des conséquences graves pour les maladies chroniques (diabète, hypertension) ou les urgences (paludisme, infections).

### 💡 La solution

MediTike digitalise ce circuit :
1. Le patient décrit son médicament (avec photo optionnelle de l'ordonnance)
2. Sa demande part instantanément à toutes les pharmacies de garde
3. Les pharmaciens répondent : disponible ou non, prix en FCFA
4. Le patient contacte directement la pharmacie par WhatsApp ou téléphone

---

## ✨ Fonctionnalités

### 👤 Espace Patient (Client)

| Fonctionnalité | Description |
|---|---|
| 🔐 **Compte sécurisé** | Inscription par téléphone + mot de passe, 12 pays africains supportés |
| 💊 **Demande de médicament** | Champ unique + photo optionnelle (ordonnance, boîte) |
| 📸 **Photos auto-supprimées** | Suppression automatique 72h après réponse (7j sans réponse) |
| ⏱ **Réponses temps réel** | Polling toutes les 30s pour les nouvelles réponses |
| 📞 **Contact direct** | Boutons Appeler + WhatsApp + Itinéraire maps natif |
| ⭐ **Favoris** | Marquer ses pharmacies préférées, tri favoris en premier |
| 📍 **Géolocalisation** | Bouton "Près de moi" pour trier par distance |
| 🟢 **Statut d'ouverture** | Badge Ouvert/Fermé/De garde selon horaires (7h-20h + garde) |
| ⭐⭐⭐⭐⭐ **Évaluations** | Noter les pharmacies après une réponse |
| 💬 **Chat interne** | Messagerie directe client ↔ pharmacien |
| 📊 **Statistiques** | Demandes, délai moyen, taux de résolution, top pharmacies |
| 📅 **Pharmacies de garde** | Liste officielle du Ministère, navigation entre semaines |

### 🏪 Espace Pharmacien

| Fonctionnalité | Description |
|---|---|
| 🔔 **Notifications temps réel** | Polling 20s, badge nombre de nouvelles demandes |
| ✅ **Réponse en 1 clic** | Disponible/Indisponible + prix FCFA + note |
| 💬 **Demande de médicament** | Le pharmacien peut aussi chercher un médicament |
| 📊 **Tableau de bord** | Stats : réponses, délai moyen, taux disponibilité, top médicaments |
| 📅 **Liste de garde** | Consultation de la liste officielle (lecture seule) |

### 🛡️ Espace Admin (URL secrète)

| Fonctionnalité | Description |
|---|---|
| 🔒 **URL secrète** | 32 caractères aléatoires, invisible au public |
| 🏪 **Gestion pharmacies** | Créer/désactiver pharmacies + comptes pharmaciens |
| 📥 **Import liste de garde** | Upload xlsx ou json du Ministère de la Santé |
| 📊 **Tableau de bord** | Stats globales, demandes 7 jours, top pharmacies |
| 👥 **Gestion utilisateurs** | Activer/désactiver comptes |
| 📝 **Journal d'audit** | Toutes les actions admin sont tracées |

### 🌐 Page publique (sans connexion)

| Fonctionnalité | Description |
|---|---|
| 🏠 **Landing page** | Présentation, comment ça marche, sécurité |
| 📅 **Pharmacies de garde** | Modal avec liste complète + recherche |
| 📱 **Installation PWA** | Bannière "Installer sur votre téléphone" |

---

## 🏗️ Architecture technique

### Stack

| Couche | Technologie |
|---|---|
| **Frontend** | Next.js 16 (App Router) + TypeScript 5 + Tailwind CSS 4 |
| **UI** | shadcn/ui + Lucide Icons + Framer Motion |
| **Backend** | API Routes Next.js + Middleware |
| **Base de données** | PostgreSQL (Supabase) + Prisma ORM |
| **Stockage photos** | Supabase Storage (bucket privé, RLS) |
| **Auth** | bcrypt (12 rounds) + sessions HMAC-SHA256 |
| **Déploiement** | Vercel (web + API + cron jobs) |
| **Mobile** | Capacitor (APK Android hybride) |

### Modèles de données (8 tables)

```
User              → clients, pharmaciens, admin (3 rôles)
Pharmacy          → officines partenaires
PharmacyDuty      → garde hebdomadaire (import Ministère)
ProductRequest    → demandes de médicaments
ProductResponse   → réponses pharmaciens
Photo             → photos auto-supprimées (72h/7j)
AuditLog          → journal des actions admin
AppStat           → cache statistiques
```

### Sécurité

- ✅ Mots de passe hashés bcrypt (12 rounds)
- ✅ Sessions cookies HTTP-only signées HMAC-SHA256
- ✅ Photos auto-supprimées (72h après réponse, 7j sans réponse)
- ✅ Bucket Storage privé avec RLS policies
- ✅ URL admin secrète (32 caractères) via middleware
- ✅ Audit log de toutes les actions admin
- ✅ Validation stricte des entrées (taille, type MIME)
- ✅ HTTPS forcé en production (cookies Secure)

---

## 🚀 Installation et déploiement

### Prérequis

- [Node.js](https://nodejs.org/) 18+ ou [Bun](https://bun.sh/)
- [Git](https://git.com/)
- Compte [Vercel](https://vercel.com/) (gratuit)
- Compte [Supabase](https://supabase.com/) (gratuit)

### Développement local

```bash
# Cloner le dépôt
git clone https://github.com/kennethafantsawo/MediTike.git
cd MediTike

# Installer les dépendances
bun install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditez .env.local avec vos valeurs Supabase

# Générer le client Prisma
bun run db:generate

# Pousser le schéma vers Supabase
bun run db:push

# Lancer le serveur de développement
bun run dev
```

Ouvrez http://localhost:3000

### Déploiement production

Consultez le fichier **[DEPLOYMENT.md](./DEPLOYMENT.md)** pour le guide complet pas à pas (Vercel + Supabase + variables d'environnement + cron jobs).

---

## 📱 Application mobile (APK Android)

L'application est disponible en APK Android (mode hybride Capacitor).

👉 **Téléchargez l'APK** dans la section [Releases](../../releases) de ce dépôt.

### Installation

1. Téléchargez le fichier `MediTike-v1.0.apk`
2. Sur Android, autorisez les **sources inconnues** (Réglages → Sécurité)
3. Tapez sur le fichier APK → Installez
4. Ouvrez MediTike depuis votre écran d'accueil

---

## 📅 Liste des pharmacies de garde

La liste officielle du Ministère de la Santé du Togo est intégrée :
- **26 semaines** programmées (juillet 2026 — janvier 2027)
- **~100 pharmacies** qui se répartissent la garde à tour de rôle
- Actualisation automatique chaque **lundi à 7h00 UTC**
- Import via fichier xlsx ou json (depuis l'espace admin)

### Format JSON pour l'import

```json
{
  "version": "1.0",
  "source": "Ministère de la Santé Togo",
  "weeks": [
    {
      "weekStart": "2026-07-06",
      "weekEnd": "2026-07-13",
      "pharmacies": [
        {
          "name": "SANTE",
          "address": "Près de NOPATO",
          "phone1": "70 44 91 37",
          "phone2": null
        }
      ]
    }
  ]
}
```

---

## 📂 Structure du projet

```
MediTike/
├── src/
│   ├── app/                    # Routes Next.js (App Router)
│   │   ├── api/                # 14 routes API
│   │   │   ├── auth/           # Authentification
│   │   │   ├── requests/       # Demandes + réponses
│   │   │   ├── photos/         # Upload + service photos
│   │   │   ├── duty/           # Pharmacies de garde
│   │   │   ├── admin/          # Routes admin (protégées)
│   │   │   ├── cron/           # Cron jobs (cleanup + refresh)
│   │   │   └── notifications/  # Notifications WhatsApp
│   │   ├── a-propos/           # Page À propos académique
│   │   ├── page.tsx            # Route principale (routing par rôle)
│   │   └── layout.tsx          # Layout racine (fonts + metadata)
│   ├── components/
│   │   ├── brand/              # Logo + patterns africains
│   │   ├── meditike/
│   │   │   ├── shared/         # Composants partagés (auth, duty, chat, rating)
│   │   │   ├── client/         # App client (4 onglets)
│   │   │   ├── pharmacist/     # App pharmacien (4 onglets)
│   │   │   ├── admin/          # App admin (6 onglets)
│   │   │   └── landing/        # Landing page publique
│   │   └── ui/                 # shadcn/ui
│   └── lib/
│       ├── db.ts               # Prisma client
│       └── meditike/           # Helpers, session, config, storage
├── prisma/
│   ├── schema.prisma           # Schéma PostgreSQL (production)
│   └── schema.sqlite.prisma    # Schéma SQLite (dev local)
├── public/
│   ├── logo.svg                # Logo MediTike
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker (offline)
├── android/                    # Projet Capacitor Android
├── scripts/
│   ├── seed.ts                 # Seed initial
│   └── supabase-storage.sql    # Script SQL bucket Storage
├── download/                   # Fichiers à télécharger
│   ├── MediTike-v1.0.apk       # APK Android
│   ├── MediTike-Presentation.pptx  # Présentation PowerPoint
│   ├── env.production          # Template variables d'environnement
│   ├── 01-schema.sql           # Script schéma PostgreSQL
│   ├── 02-seed.sql             # Script seed initial
│   └── 03-pharmacy-duty.csv    # Pharmacies de garde (1348 entrées)
├── DEPLOYMENT.md               # Guide déploiement complet
├── vercel.json                 # Config Vercel + cron jobs
└── capacitor.config.ts         # Config Capacitor (APK)
```

---

## 🌍 Couverture

- **7 villes togolaises** : Lomé, Kara, Sokodé, Kpalimé, Atakpamé, Dapaong, Tsévié
- **~100 pharmacies** de garde répertoriées
- **26 semaines** de garde programmées

---

## 🛣️ Feuille de route

### Court terme (3 mois)
- [ ] Notifications WhatsApp Business API
- [ ] Application iOS (Capacitor)
- [ ] Carte interactive (Leaflet)

### Moyen terme (6-12 mois)
- [ ] Paiement Mobile Money (Moov / T-Money)
- [ ] Téléconsultation pharmaceutique
- [ ] Extension à la sous-région CEDEAO

### Long terme
- [ ] Historique médicaments patient
- [ ] IA recommandation génériques
- [ ] Partenariat ONP (Ordre National des Pharmaciens)

---

## 📞 Contact

- **Téléphone** : +228 96 41 72 70
- **Email** : contact@meditike.tg
- **Localisation** : Lomé, Togo

---

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés.

---

<div align="center">

**MediTike** — La santé à portée de main 🇹🇬

</div>
