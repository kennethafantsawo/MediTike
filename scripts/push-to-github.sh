#!/usr/bin/env bash
# ============================================================
# MediTike — Push vers GitHub
# ============================================================
# Le commit est déjà prêt dans le sandbox. Pour pousser vers
# https://github.com/kenk4585-ops/MediTike.git, vous avez 2 options:
#
# ─── OPTION 1: GitHub Personal Access Token (recommandé) ──────
# 1. Créez un token sur https://github.com/settings/tokens
#    (Classic token, scope "repo" suffisant)
# 2. Exportez-le en variable d'environnement:
#    export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
# 3. Exécutez ce script:
#    bash scripts/push-to-github.sh
#
# ─── OPTION 2: SSH (si vous avez une clé SSH configurée) ──────
# 1. Changez l'URL remote en SSH:
#    git remote set-url origin git@github.com:kenk4585-ops/MediTike.git
# 2. Poussez:
#    git push -u origin main
# ============================================================

set -e

cd /home/z/my-project

echo "📦 État du dépôt local :"
git log --oneline -3
echo ""
echo "_remote configuré :"
git remote -v
echo ""

# ─── OPTION 1: Token ───
if [ -n "$GH_TOKEN" ]; then
  echo "🔑 Token GitHub détecté, configuration de l'URL remote..."
  git remote set-url origin "https://x-access-token:${GH_TOKEN}@github.com/kenk4585-ops/MediTike.git"
  echo "🚀 Push en cours..."
  git push -u origin main
  echo ""
  echo "✅ Push réussi !"
  echo "🔗 https://github.com/kenk4585-ops/MediTike"
  # Nettoyer le token de l'URL pour sécurité
  git remote set-url origin "https://github.com/kenk4585-ops/MediTike.git"
  exit 0
fi

# ─── OPTION 2: SSH ───
if git remote get-url origin | grep -q "git@github.com"; then
  echo "🚀 Push en cours via SSH..."
  git push -u origin main
  echo "✅ Push réussi !"
  exit 0
fi

echo "❌ Aucune authentification configurée."
echo ""
echo "Pour pousser, faites l'une des opérations suivantes :"
echo ""
echo "  Option A (token):"
echo "    export GH_TOKEN=\"ghp_votre_token_ici\""
echo "    bash scripts/push-to-github.sh"
echo ""
echo "  Option B (SSH):"
echo "    git remote set-url origin git@github.com:kenk4585-ops/MediTike.git"
echo "    bash scripts/push-to-github.sh"
echo ""
echo "  Option C (depuis votre machine locale):"
echo "    # Téléchargez le bundle MediTike.bundle depuis le panneau de fichiers"
echo "    git clone MediTike.bundle MediTike"
echo "    cd MediTike"
echo "    git remote set-url origin https://github.com/kenk4585-ops/MediTike.git"
echo "    git push -u origin main"
exit 1
