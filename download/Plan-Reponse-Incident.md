# 🚨 Plan de Réponse à Incident — MediTike

## 📋 Vue d'ensemble

Ce document décrit les procédures à suivre en cas d'incident de sécurité sur la plateforme MediTike.

**Contact urgence** : +228 96 41 72 70 (WhatsApp, 24/7)

---

## 🔴 Niveaux de gravité

### Niveau 1 — Critique (réponse < 1h)
- Violation de données utilisateurs (emails, téléphones, photos)
- Compromission du compte administrateur
- Accès non autorisé à la base de données Supabase
- Fuite de mots de passe (même hashés)

### Niveau 2 — Élevé (réponse < 4h)
- Compromission de variables d'environnement Vercel
- Attaque brute force massive sur /api/auth
- Injection SQL ou XSS détectée
- Défaillance du rate limiting

### Niveau 3 — Moyen (réponse < 24h)
- Bug de sécurité non exploité (vulnérabilité théorique)
- Tentative de phishing ciblant les utilisateurs
- Pics anormaux de trafic API
- Photos non supprimées après 72h

---

## 🚀 Procédures de réponse

### Étape 1 — Containment (Immédiat)

1. **Désactiver l'accès compromise**
   - Si compte admin : changer le mot de passe + URL admin secrète
   - Si compte pharmacien : désactiver le compte via admin
   - Si API : activer le rate limiting d'urgence (Vercel Firewall)

2. **Isoler les données**
   - Supabase Dashboard → Pause project (si critique)
   - Ou : restreindre l'accès DB aux IPs autorisées

3. **Préserver les preuves**
   - Exporter les logs Vercel (Settings → Logs)
   - Exporter les logs Supabase (Dashboard → Logs)
   - Capturer les AuditLogs de la DB

### Étape 2 — Éradication (1-4h)

1. **Identifier la cause racine**
   - Analyser les logs d'accès
   - Vérifier les AuditLogs admin
   - Examiner les requêtes API suspectes

2. **Éliminer la menace**
   - Corriger la vulnérabilité (code, config, dépendance)
   - Rotation des clés HMAC (voir session.ts)
   - Régénérer tous les secrets (session, cron, admin path)

3. **Vérifier l'éradication**
   - Test de l'endpoint vulnérable
   - Scan de sécurité (npm audit, dépendances)

### Étape 3 — Notification (4-24h)

#### Notification aux utilisateurs (Niveau 1 uniquement)

**Message type (WhatsApp + email + in-app)** :
```
🚨 INFORMATION IMPORTANTE — MediTike

Le [DATE], nous avons détecté un incident de sécurité affectant 
[DESCRIPTION GÉNÉRALE sans détails techniques].

Vos données potentiellement concernées : [LISTE]

Recommandations immédiates :
1. Changez votre mot de passe MediTike
2. Si vous utilisez le même mot de passe ailleurs, changez-le aussi
3. Soyez vigilants face aux emails/SMS suspects

Nous avons pris les mesures suivantes : [ACTIONS]

Pour toute question : WhatsApp +228 96 41 72 70

Nous nous excusons pour ce désagrément et restons à votre disposition.
— L'équipe MediTike
```

#### Notification aux autorités (si données de santé)
- Ministère de la Santé du Togo (Direction de la Pharmacie)
- Commission Nationale de Protection des Données (si applicable)

### Étape 4 — Récupération (24-72h)

1. **Restaurer le service**
   - Redéployer l'application corrigée
   - Vérifier que tous les endpoints fonctionnent
   - Tester les notifications, auth, photos

2. **Surveillance renforcée**
   - Activer le monitoring Vercel (Analytics)
   - Surveiller les logs Supabase pendant 7 jours
   - Rate limiting renforcé temporairement

### Étape 5 — Post-mortem (7 jours)

1. **Documenter l'incident**
   - Timeline complète (détection → résolution)
   - Cause racine
   - Données affectées
   - Actions correctives
   - Leçons apprises

2. **Améliorer les défenses**
   - Mettre à jour ce plan
   - Ajouter des tests de sécurité
   - Planifier un audit externe

---

## 🔧 Outils de surveillance

| Outil | Usage | Accès |
|---|---|---|
| Vercel Dashboard | Logs, deployments, firewall | vercel.com/dashboard |
| Supabase Dashboard | DB logs, auth logs, storage | supabase.com/dashboard |
| AuditLog (DB) | Toutes les actions admin | Table AuditLog |
| Google Search Console | Indexation, sécurité | search.google.com |

---

## 📅 Maintenance préventive

| Action | Fréquence |
|---|---|
| Rotation clés HMAC | Tous les 3 mois |
| Audit des dépendances (npm audit) | Mensuel |
| Test de pénétration (self) | Mensuel |
| Test de pénétration (tiers) | Annuel |
| Revue des AuditLogs | Hebdomadaire |
| Vérification des sauvegardes Supabase | Hebdomadaire |
| Mise à jour des dépendances | Mensuel |

---

## 📞 Contacts d'urgence

| Contact | Rôle | Numéro |
|---|---|---|
| Kenneth Afantsawo | Administrateur | +228 96 41 72 70 |
| Supabase Support | Support DB | support@supabase.com |
| Vercel Support | Support hosting | support@vercel.com |

---

*Document version 1.0 — Juillet 2026*
*À réviser après chaque incident ou tous les 6 mois*
