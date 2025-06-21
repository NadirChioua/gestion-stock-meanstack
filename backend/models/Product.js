const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  quantite: {
    type: Number,
    required: [true, 'La quantité est requise'],
    min: [0, 'La quantité ne peut pas être négative'],
    default: 0
  },
  sku: {
    type: String,
    required: [true, 'Le SKU est requis'],
    unique: true,
    trim: true,
    uppercase: true
  },
  categorie: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['Électronique', 'Vêtements', 'Alimentaire', 'Mobilier', 'Livres', 'Autre'],
    default: 'Autre'
  },
  seuilMinimum: {
    type: Number,
    default: 10,
    min: [0, 'Le seuil minimum ne peut pas être négatif']
  },
  actif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
productSchema.index({ nom: 'text', description: 'text' });
productSchema.index({ categorie: 1 });
productSchema.index({ sku: 1 });

// Méthode virtuelle pour vérifier si le stock est faible
productSchema.virtual('stockFaible').get(function() {
  return this.quantite <= this.seuilMinimum;
});

// Inclure les propriétés virtuelles lors de la conversion en JSON
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);

