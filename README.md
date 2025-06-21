# Application de Gestion de Stock - MEAN Stack

## 📋 Description

Cette application web de gestion de stock a été développée en utilisant la stack MEAN (MongoDB, Express.js, Angular, Node.js) avec Mongoose pour la modélisation des données. Elle permet de gérer efficacement les produits, les niveaux de stock, les mouvements d'entrée et de sortie, ainsi que de générer des rapports sur l'état des stocks.

## 👥 Équipe de Développement

- **Nadir Chioua**
- **Mehdi Boukharie**

## 🚀 Fonctionnalités

### Gestion des Produits
- ✅ Création, modification et suppression de produits
- ✅ Recherche et filtrage par catégorie
- ✅ Gestion des seuils de stock minimum
- ✅ Alertes pour les stocks faibles

### Gestion des Stocks
- ✅ Enregistrement des mouvements de stock (entrée, sortie, ajustement, retour)
- ✅ Historique complet des mouvements
- ✅ Traçabilité des utilisateurs et des motifs
- ✅ Gestion des numéros de commande et fournisseurs

### Authentification et Sécurité
- ✅ Système d'authentification JWT
- ✅ Gestion des rôles (Admin, Gestionnaire, Utilisateur)
- ✅ Protection des routes sensibles
- ✅ Hachage sécurisé des mots de passe

### Interface Utilisateur
- ✅ Interface responsive et moderne
- ✅ Tableau de bord avec statistiques
- ✅ Navigation intuitive
- ✅ Formulaires de saisie optimisés

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web pour Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Hachage des mots de passe
- **CORS** - Gestion des requêtes cross-origin

### Frontend
- **Angular** - Framework frontend
- **TypeScript** - Langage de programmation
- **CSS3** - Styles et mise en page
- **RxJS** - Programmation réactive

## 📁 Structure du Projet

```
gestion-stock-meanstack/
├── backend/                 # API Node.js/Express
│   ├── models/             # Modèles Mongoose
│   ├── routes/             # Routes API
│   ├── middleware/         # Middlewares (auth, etc.)
│   ├── server.js           # Point d'entrée du serveur
│   └── package.json        # Dépendances backend
├── frontend/               # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Composants Angular
│   │   │   ├── services/   # Services Angular
│   │   │   ├── guards/     # Guards de navigation
│   │   │   └── interceptors/ # Intercepteurs HTTP
│   │   └── styles.css      # Styles globaux
│   └── package.json        # Dépendances frontend
└── README.md               # Documentation
```

## 🔧 Installation et Configuration

### Prérequis
- Node.js (version 18 ou supérieure)
- MongoDB (local ou cloud)
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone <url-du-repository>
cd gestion-stock-meanstack
```

2. **Configuration du Backend**
```bash
cd backend
npm install
```

3. **Configuration des variables d'environnement**
Créer un fichier `.env` dans le dossier `backend` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gestion-stock
JWT_SECRET=votre_secret_jwt_super_securise_ici
JWT_EXPIRE=7d
```

4. **Configuration du Frontend**
```bash
cd ../frontend
npm install
```

### Démarrage de l'Application

1. **Démarrer MongoDB**
```bash
# Si MongoDB est installé localement
mongod
```

2. **Démarrer le Backend**
```bash
cd backend
npm run dev
```
Le serveur backend sera accessible sur `http://localhost:5000`

3. **Démarrer le Frontend**
```bash
cd frontend
ng serve
```
L'application frontend sera accessible sur `http://localhost:4200`

## 📊 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription d'un utilisateur
- `POST /api/auth/login` - Connexion d'un utilisateur
- `GET /api/auth/me` - Profil de l'utilisateur connecté

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit
- `GET /api/products/stats/overview` - Statistiques des produits

### Stock
- `GET /api/stock` - Liste des mouvements
- `GET /api/stock/:id` - Détails d'un mouvement
- `POST /api/stock` - Créer un mouvement
- `PUT /api/stock/:id` - Modifier un mouvement
- `GET /api/stock/product/:productId` - Historique d'un produit
- `GET /api/stock/stats/movements` - Statistiques des mouvements

## 🔐 Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification. Les tokens sont stockés dans le localStorage du navigateur et automatiquement inclus dans les requêtes API via un intercepteur HTTP.

### Rôles Utilisateurs
- **Admin** : Accès complet à toutes les fonctionnalités
- **Gestionnaire** : Gestion des produits et des stocks
- **Utilisateur** : Consultation des données

## 🎨 Interface Utilisateur

L'interface utilisateur a été conçue pour être intuitive et responsive :

- **Tableau de bord** : Vue d'ensemble avec statistiques et graphiques
- **Gestion des produits** : Interface CRUD complète avec filtres
- **Gestion des stocks** : Enregistrement et suivi des mouvements
- **Navigation** : Menu de navigation fixe avec informations utilisateur

## 🧪 Tests

Pour tester l'application :

1. Créer un compte administrateur
2. Ajouter quelques produits de test
3. Effectuer des mouvements de stock
4. Vérifier les statistiques dans le tableau de bord

## 📈 Améliorations Futures

- Génération de rapports PDF
- Notifications en temps réel
- Import/Export de données
- Gestion des fournisseurs
- Codes-barres et QR codes
- Application mobile

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub ou contacter l'équipe de développement.

---

**Développé avec ❤️ par Nadir Chioua et Mehdi Boukharie**

