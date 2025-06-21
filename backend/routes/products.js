const express = require('express');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Obtenir tous les produits
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, categorie, stockFaible } = req.query;
    
    // Construire le filtre de recherche
    let filter = { actif: true };
    
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (categorie) {
      filter.categorie = categorie;
    }
    
    if (stockFaible === 'true') {
      filter.$expr = { $lte: ['$quantite', '$seuilMinimum'] };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    const products = await Product.find(filter)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: options.page,
          totalPages: Math.ceil(total / options.limit),
          totalProducts: total,
          hasNext: options.page < Math.ceil(total / options.limit),
          hasPrev: options.page > 1
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits',
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Obtenir un produit par ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du produit',
      error: error.message
    });
  }
});

// @route   POST /api/products
// @desc    Créer un nouveau produit
// @access  Private (Admin/Gestionnaire)
router.post('/', auth, authorize('admin', 'gestionnaire'), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: { product }
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Un produit avec ce SKU existe déjà'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du produit',
      error: error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Mettre à jour un produit
// @access  Private (Admin/Gestionnaire)
router.put('/:id', auth, authorize('admin', 'gestionnaire'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: { product }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Un produit avec ce SKU existe déjà'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du produit',
      error: error.message
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Supprimer un produit (soft delete)
// @access  Private (Admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { actif: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Produit supprimé avec succès',
      data: { product }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du produit',
      error: error.message
    });
  }
});

// @route   GET /api/products/stats/overview
// @desc    Obtenir les statistiques générales des produits
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ actif: true });
    const lowStockProducts = await Product.countDocuments({
      actif: true,
      $expr: { $lte: ['$quantite', '$seuilMinimum'] }
    });
    
    const categoryStats = await Product.aggregate([
      { $match: { actif: true } },
      { $group: { _id: '$categorie', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const totalValue = await Product.aggregate([
      { $match: { actif: true } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$prix', '$quantite'] } } } }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        categoryStats,
        totalValue: totalValue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

module.exports = router;

