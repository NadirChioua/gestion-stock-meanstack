#!/bin/bash

# Script de démarrage rapide pour l'application de gestion de stock
echo "🚀 Démarrage de l'application de gestion de stock MEAN Stack"
echo "============================================================"

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ avant de continuer."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requis. Version actuelle: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ npm $(npm --version) détecté"

# Vérifier MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB n'est pas détecté localement. Assurez-vous qu'une instance MongoDB est accessible."
else
    echo "✅ MongoDB détecté"
fi

echo ""
echo "📦 Installation des dépendances..."

# Installation des dépendances backend
echo "🔧 Installation des dépendances backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances backend"
        exit 1
    fi
else
    echo "✅ Dépendances backend déjà installées"
fi

# Installation des dépendances frontend
echo "🔧 Installation des dépendances frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances frontend"
        exit 1
    fi
else
    echo "✅ Dépendances frontend déjà installées"
fi

cd ..

echo ""
echo "⚙️  Configuration..."

# Vérifier le fichier .env
if [ ! -f "backend/.env" ]; then
    echo "📝 Création du fichier de configuration .env..."
    cat > backend/.env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gestion-stock
JWT_SECRET=votre_secret_jwt_super_securise_$(date +%s)
JWT_EXPIRE=7d
EOL
    echo "✅ Fichier .env créé avec des valeurs par défaut"
else
    echo "✅ Fichier .env existant"
fi

echo ""
echo "🎯 Instructions de démarrage:"
echo ""
echo "1. Démarrer MongoDB (si local):"
echo "   mongod"
echo ""
echo "2. Démarrer le backend (dans un terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Démarrer le frontend (dans un autre terminal):"
echo "   cd frontend"
echo "   ng serve"
echo ""
echo "4. Accéder à l'application:"
echo "   Frontend: http://localhost:4200"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📚 Documentation disponible:"
echo "   - README.md : Guide d'utilisation"
echo "   - DOCUMENTATION_TECHNIQUE.pdf : Documentation technique complète"
echo "   - RAPPORT_PROJET.pdf : Rapport de projet"
echo ""
echo "✨ Application prête à être démarrée!"
echo "============================================================"

