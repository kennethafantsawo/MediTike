# 🚀 Déploiement MediTike — Vercel + Supabase

Guide complet pour déployer MediTike en production.

---

## 📋 Prérequis

- Compte [Vercel](https://vercel.com) (gratuit)
- Compte [Supabase](https://supabase.com) (free tier OK)
- Node.js 18+ / Bun installé localement
- Git

---

## 1️⃣ Configuration Supabase

### 1.1 Créer le projet
1. Allez sur https://supabase.com → New Project
2. Name: `meditike-prod`
3. Database Password: **gardez-le précieusement**
4. Region: `Frankfurt` (le plus proche du Togo en Europe)
5. Plan: Free (suffisant pour démarrer)

### 1.2 Récupérer les credentials
Dans Supabase Dashboard → Settings → API:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

Dans Settings → Database → Connection string (Session pooler):
- URL format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
- → `DATABASE_URL`

Connection string (Direct connection):
- URL format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
- → `DIRECT_URL`

### 1.3 Créer le bucket Storage pour les photos
Dans Supabase Dashboard → SQL Editor, collez et exécutez le contenu de `scripts/supabase-storage.sql`.

Cela crée:
- Un bucket privé `meditike-photos`
- Des politiques RLS qui n'autorisent que la `service_role` (votre serveur)

### 1.4 Backup automatique
Supabase gère les backups automatiquement:
- **Free tier**: backup quotidien, rétention 7 jours
- **Pro tier** ($25/mois): PITR (Point-in-Time Recovery), rétention 30 jours

Aucune action de votre côté — c'est inclus.

---

## 2️⃣ Configuration locale

### 2.1 Cloner et installer
```bash
git clone <votre-repo>
cd meditike
bun install
```

### 2.2 Variables d'environnement
Copiez `.env.example` en `.env.local` et remplissez:

```bash
cp .env.example .env.local
```

Générez les secrets aléatoires:
```bash
# Secret de session (64 caractères)
openssl rand -hex 32

# URL admin secrète (24 caractères = 48 hex)
openssl rand -hex 24

# Secret cron (64 caractères)
openssl rand -hex 32
```

### 2.3 Switch Prisma vers PostgreSQL

Remplacez le schéma SQLite par le schéma PostgreSQL:
```bash
cp prisma/schema.supabase.prisma prisma/schema.prisma
```

Poussez le schéma vers Supabase:
```bash
bun run db:push
```

### 2.4 Seed initial (crée admin + pharmacies démo + importe le xlsx)
```bash
bun scripts/seed.ts
```

### 2.5 Test local
```bash
bun run dev
```
Ouvrez http://localhost:3000

---

## 3️⃣ Déploiement Vercel

### 3.1 Connecter le repo
1. https://vercel.com → New Project
2. Importez votre repo Git
3. Framework: **Next.js** (auto-détecté)
4. Root Directory: `./`
5. Build Command: `bun run db:generate && next build`
6. Install Command: `bun install`

### 3.2 Variables d'environnement Vercel
Dans Project Settings → Environment Variables, ajoutez TOUTES les variables du `.env.example`:

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.[ref]:...pooler.supabase.com:6543/postgres` |
| `DIRECT_URL` | `postgresql://postgres.[ref]:...pooler.supabase.com:5432/postgres` |
| `MEDITIKE_SESSION_SECRET` | (valeur générée par `openssl rand -hex 32`) |
| `MEDITIKE_ADMIN_PATH` | (valeur générée par `openssl rand -hex 24`) |
| `CRON_SECRET` | (valeur générée par `openssl rand -hex 32`) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[ref].supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (service_role key) |
| `SUPABASE_PHOTOS_BUCKET` | `meditike-photos` |
| `MEDITIKE_ADMIN_PHONE` | `+22890000001` |
| `MEDITIKE_ADMIN_PASSWORD` | (votre mot de passe admin fort) |
| `NEXT_PUBLIC_ADMIN_PATH` | (même valeur que `MEDITIKE_ADMIN_PATH`) |

⚠️ **Important**: `MEDITIKE_ADMIN_PATH` et `NEXT_PUBLIC_ADMIN_PATH` doivent avoir la **même valeur**.

### 3.3 Crons automatiques
Le fichier `vercel.json` configure déjà:
- **Chaque jour à 3h00 UTC** : `/api/cron/cleanup` (suppression photos expirées + cleanup demandes)
- **Chaque lundi à 7h00 UTC** : `/api/cron/refresh-duty` (vérif semaine de garde)

Vercel exécutera ces routes automatiquement avec le header `Authorization: Bearer <CRON_SECRET>`.

⚠️ **Important — Plan Hobby (gratuit)**: Vercel limite les crons à **1 fois par jour maximum**. Les schedules ci-dessus (quotidien + hebdomadaire) sont compatibles Hobby.

#### 🚀 Pour un nettoyage horaire (recommandé en production)

Si vous voulez que les photos expirées soient supprimées dans l'heure qui suit (au lieu d'attendre le passage quotidien à 3h UTC), utilisez un service de cron externe **gratuit** :

**Option A — cron-job.org (recommandé, gratuit, sans limite)** :
1. Créez un compte gratuit sur https://cron-job.org
2. New cron job → configurez :
   - **URL** : `https://votre-domaine.vercel.app/api/cron/cleanup`
   - **Method** : GET
   - **Headers** : `Authorization: Bearer <votre_CRON_SECRET>`
   - **Schedule** : `0 * * * *` (chaque heure)
3. Save — c'est tout, cron-job.org appellera votre API chaque heure

**Option B — UptimeRobot (gratuit, 5 min intervals)** :
1. https://uptimerobot.com → New monitor
2. Monitor type : HTTP(s)
3. URL : `https://votre-domaine.vercel.app/api/cron/cleanup` (attention : ne permet pas de header Authorization en gratuit — à utiliser seulement en test)

**Option C — Upgrade Vercel Pro ($20/mois)** :
- Active les crons natifs jusqu'à 1 minute d'intervalle
- Pas besoin de service externe
- À envisager si le traffic monte

#### 📊 Impact du nettoyage quotidien (vs horaire)
- Photos : supprimées dans un délai max de ~24h après leur date d'expiration (au lieu de ~1h)
- Demandes expirées : marquées dans les 24h
- Brouillons orphelins : supprimés dans les 24h
- **Aucune perte de données** — juste un délai de nettoyage plus long
- **Recommandation** : le nettoyage quotidien est amplement suffisant pour le MVP. Passez à l'horaire uniquement si le volume de photos devient important.

### 3.4 Deploy
Cliquez "Deploy". Vercel build et déploie automatiquement.

### 3.5 HTTPS
Vercel fournit automatiquement:
- Certificat HTTPS (renouvelé auto)
- Domaine `*.vercel.app`
- Possibilité d'ajouter un domaine custom (`meditike.tg`)

Les cookies `Secure` fonctionneront donc naturellement.

---

## 4️⃣ Build APK Android et IPA iOS

### 4.1 Installer Capacitor
```bash
bun add @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

### 4.2 Configurer `next.config.ts` pour export statique
Modifiez `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: "export",  // ⚠️ changez "standalone" par "export"
  images: { unoptimized: true },
};
```

### 4.3 Build et sync
```bash
# Build le web statique
bun run build

# Initialiser Capacitor (une seule fois)
bunx cap init MediTike tg.meditike.app --web-dir=out

# Ajouter plateformes
bunx cap add android
bunx cap add ios  # ⚠️ nécessite macOS

# Sync le code web
bunx cap sync
```

### 4.4 Build APK Android
```bash
cd android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk

# Pour release signé:
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

Installer sur un téléphone:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 4.5 Build iOS (macOS uniquement)
```bash
cd ios
pod install
bunx cap open ios
# Xcode s'ouvre → Product > Archive → Distribute
```

### 4.6 Publier sur les stores
- **Google Play Store**: https://play.google.com/console (frais $25 unique)
- **Apple App Store**: https://appstoreconnect.apple.com (frais $99/an)

---

## 5️⃣ Post-déploiement

### 5.1 Changer le mot de passe admin par défaut
Connectez-vous à l'admin (`https://votre-domaine.com/[MEDITIKE_ADMIN_PATH]`) avec le compte par défaut, puis:
- Soit modifiez le mot de passe en base
- Soit supprimez la variable `MEDITIKE_ADMIN_PASSWORD` après la 1ère initialisation

### 5.2 Importer la liste des pharmacies de garde
1. Connectez-vous en admin
2. Onglet "Import garde"
3. Uploadez le fichier xlsx du Ministère de la Santé
4. Vérifiez que les 26 semaines sont importées

### 5.3 Créer les pharmacies partenaires
1. Onglet "Pharmacies"
2. Cliquez "Nouvelle pharmacie"
3. Remplissez les infos + créez le compte pharmacien
4. Communiquez les identifiants au pharmacien (via WhatsApp de préférence)

### 5.4 Monitoring
- **Vercel Analytics**: trafic et performances
- **Supabase Dashboard**: usage database + storage
- **Logs Vercel**: erreurs runtime
- **Audit log admin**: toutes les actions sensibles sont journalisées

---

## 🔒 Checklist sécurité production

- [ ] `MEDITIKE_SESSION_SECRET` est unique et aléatoire (64+ chars)
- [ ] `MEDITIKE_ADMIN_PATH` est unique et aléatoire (24+ chars)
- [ ] `CRON_SECRET` est unique et aléatoire (32+ chars)
- [ ] Mot de passe admin par défaut **changé**
- [ ] Variable `MEDITIKE_ADMIN_PASSWORD` **supprimée** après initialisation
- [ ] Bucket Supabase Storage **privé** (RLS activée)
- [ ] HTTPS forcé (automatique sur Vercel)
- [ ] Domaine custom configuré (optionnel mais recommandé)

---

## 🆘 Troubleshooting

### "Prisma ClientInitializationError"
→ Vérifiez `DATABASE_URL` et `DIRECT_URL` (bon pooler? bon mot de passe?)

### "Cannot read property 'storage' of undefined"
→ Vérifiez `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

### Photos ne s'affichent pas
→ Vérifiez que le bucket `meditike-photos` existe dans Supabase Storage (ré-exécutez `supabase-storage.sql`)

### Admin inaccessible
→ Vérifiez que `MEDITIKE_ADMIN_PATH` et `NEXT_PUBLIC_ADMIN_PATH` ont la **même valeur**

### Cron ne s'exécute pas
→ Vercel Free tier limite les crons. Vérifiez dans Vercel Dashboard → Cron Jobs

---

## 📞 Support

Pour toute question: `contact@meditike.tg`

---

**MediTike** — Santé pour tous au Togo 🇹🇬
