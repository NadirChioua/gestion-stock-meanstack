const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  produitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'L\'ID du produit est requis']
  },
  typeMouvement: {
    type: String,
    required: [true, 'Le type de mouvement est requis'],
    enum: ['entrée', 'sortie', 'ajustement', 'retour'],
    lowercase: true
  },
  quantiteMouvement: {
    type: Number,
    required: [true, 'La quantité du mouvement est requise'],
    validate: {
      validator: function(value) {
        return value !== 0;
      },
      message: 'La quantité du mouvement ne peut pas être zéro'
    }
  },
  quantiteAvant: {
    type: Number,
    required: true,
    min: [0, 'La quantité avant ne peut pas être négative']
  },
  quantiteApres: {
    type: Number,
    required: true,
    min: [0, 'La quantité après ne peut pas être négative']
  },
  motif: {
    type: String,
    trim: true
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  numeroCommande: {
    type: String,
    trim: true
  },
  fournisseur: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
stockSchema.index({ produitId: 1, createdAt: -1 });
stockSchema.index({ typeMouvement: 1 });
stockSchema.index({ utilisateur: 1 });

// Méthode statique pour obtenir l'historique d'un produit
stockSchema.statics.getHistoriqueProduit = function(produitId, limit = 50) {
  return this.find({ produitId })
    .populate('utilisateur', 'nom email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Méthode statique pour obtenir les statistiques de mouvement
stockSchema.statics.getStatistiquesMouvements = function(dateDebut, dateFin) {
  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: dateDebut,
          $lte: dateFin
        }
      }
    },
    {
      $group: {
        _id: '$typeMouvement',
        totalMouvements: { $sum: 1 },
        quantiteTotale: { $sum: { $abs: '$quantiteMouvement' } }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

module.exports = mongoose.model('Stock', stockSchema);

