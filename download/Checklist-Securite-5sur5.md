# 🛡️ MediTike — Checklist Sécurité 5/5

## Score actuel : 🟢🟢🟢🟢🟢 5/5 — Excellence

---

## ✅ P1 — Priorité 1 (Immédiat)

| # | Mesure | Statut | Fichier |
|---|---|---|---|
| 1 | Headers CSP strict | ✅ | next.config.ts |
| 2 | X-Frame-Options: DENY | ✅ | next.config.ts |
| 3 | X-Content-Type-Options: nosniff | ✅ | next.config.ts |
| 4 | Referrer-Policy | ✅ | next.config.ts |
| 5 | Permissions-Policy | ✅ | next.config.ts |
| 6 | HSTS (2 ans + preload) | ✅ | next.config.ts |
| 7 | CORP same-origin | ✅ | next.config.ts |
| 8 | COEP require-corp | ✅ | next.config.ts |
| 9 | COOP same-origin | ✅ | next.config.ts |
| 10 | Rate limiting /api/auth (5/min) | ✅ | rate-limit.ts |
| 11 | Politique de confidentialité RGPD | ✅ | /confidentialite |
| 12 | Conditions d'utilisation | ✅ | /conditions |

## ✅ P2 — Priorité 2 (Court terme)

| # | Mesure | Statut | Fichier |
|---|---|---|---|
| 13 | WAF Vercel (firewall rules) | ✅ | vercel.json |
| 14 | Block bots/crawlers | ✅ | vercel.json |
| 15 | Rate limit API photos (20/min) | ✅ | vercel.json |
| 16 | Rate limit API requests (30/min) | ✅ | vercel.json |
| 17 | Rotation clés HMAC (grace period) | ✅ | session.ts |
| 18 | Tokens avec TTL 24h | ✅ | session.ts |
| 19 | Auto-refresh tokens | ✅ | session.ts |
| 20 | Dépendances à jour | ✅ | bun update |

## ✅ P3 — Priorité 3 (Moyen terme)

| # | Mesure | Statut | Fichier |
|---|---|---|---|
| 21 | Plan de réponse à incident | ✅ | Plan-Reponse-Incident.md |
| 22 | 3 niveaux de gravité | ✅ | Plan-Reponse-Incident.md |
| 23 | 5 étapes (containment → post-mortem) | ✅ | Plan-Reponse-Incident.md |
| 24 | Sensibilisation utilisateurs | ✅ | /conditions section 7 |

## ✅ P4 — Niveau 5/5 (Pratiques 2025-2026)

| # | Mesure | Statut | Fichier |
|---|---|---|---|
| 25 | CSP nonce-based (sans unsafe-eval) | ✅ | next.config.ts |
| 26 | Trusted Types for scripts | ✅ | next.config.ts |
| 27 | Strict-dynamic CSP | ✅ | next.config.ts |
| 28 | Supabase RLS sur 8 tables | ✅ | 05-rls-policies.sql |
| 29 | RLS: service_role uniquement (User, Photo, AuditLog) | ✅ | 05-rls-policies.sql |
| 30 | RLS: lecture publique limitée (Pharmacy, Duty, AppStat) | ✅ | 05-rls-policies.sql |
| 31 | Sanitizer anti-XSS (XSS patterns) | ✅ | sanitizer.ts |
| 32 | Sanitizer anti-SQL injection | ✅ | sanitizer.ts |
| 33 | Sanitizer anti-path traversal | ✅ | sanitizer.ts |
| 34 | Sanitizer anti-NoSQL injection | ✅ | sanitizer.ts |
| 35 | Sanitizer intégré /api/auth | ✅ | auth/route.ts |
| 36 | Sanitizer intégré /api/requests | ✅ | requests/route.ts |
| 37 | Rate limiting /api/requests (10/min) | ✅ | requests/route.ts |
| 38 | X-DNS-Prefetch-Control: off | ✅ | next.config.ts |
| 39 | X-Download-Options: noopen | ✅ | next.config.ts |
| 40 | X-Permitted-Cross-Domain-Policies: none | ✅ | next.config.ts |
| 41 | Audit access control (session check sur toutes routes) | ✅ | Toutes routes API |
| 42 | bcrypt 12 rounds | ✅ | auth/route.ts |
| 43 | Photos auto-supprimées 72h/7j | ✅ | cron/cleanup |
| 44 | URL admin secrète (middleware) | ✅ | middleware.ts |
| 45 | Audit log admin | ✅ | admin-guard.ts |
| 46 | Validation mots de passe forts | ✅ | helpers.ts |
| 47 | HTTPS forcé (cookies Secure) | ✅ | session.ts |
| 48 | Cookies httpOnly + SameSite=Lax | ✅ | session.ts |

---

## 📊 OWASP Top 10 2025 — Conformité

| Risque OWASP | Statut | Mesure |
|---|---|---|
| A01: Broken Access Control | ✅ | Session check sur toutes routes + RLS |
| A02: Cryptographic Failures | ✅ | bcrypt 12 rounds + HMAC-SHA256 + HTTPS |
| A03: Injection | ✅ | Sanitizer XSS/SQL/NoSQL/Path traversal |
| A04: Insecure Design | ✅ | URL admin secrète + rate limiting |
| A05: Security Misconfiguration | ✅ | Headers complets + WAF Vercel |
| A06: Vulnerable Components | ✅ | bun update + bun audit |
| A07: Auth Failures | ✅ | Rate limiting + mots de passe forts |
| A08: Data Integrity Failures | ✅ | CSP strict + Trusted Types |
| A09: Logging Failures | ✅ | Audit log complet + console.warn sécurité |
| A10: SSRF | ✅ | Pas de requêtes serveur vers URL externe |

---

## 📋 Maintenance

| Action | Fréquence |
|---|---|
| Rotation clés HMAC | 3 mois |
| bun audit | Mensuel |
| Revue AuditLogs | Hebdomadaire |
| Test de pénétration (tiers) | Annuel |
| Revue des dépendances | Mensuel |

---

*Score atteint : 5/5 — Excellence*
*Dernière évaluation : juillet 2026*
