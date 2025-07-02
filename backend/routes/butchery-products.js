const express = require('express');
const router = express.Router();
const ButcheryProduct = require('../models/ButcheryProduct');

// @route   POST /api/butchery-products
// @desc    Créer un nouveau produit de boucherie
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, price_per_kg, stock_quantity_kg, category } = req.body;

    const butcheryProduct = new ButcheryProduct({
      name,
      price_per_kg,
      stock_quantity_kg: stock_quantity_kg || 0,
      category
    });

    const savedProduct = await butcheryProduct.save();

    res.status(201).json({
      success: true,
      message: 'Produit de boucherie créé avec succès',
      data: savedProduct
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du produit de boucherie',
      error: error.message
    });
  }
});

// @route   GET /api/butchery-products
// @desc    Obtenir tous les produits de boucherie
// @access  Private
router.get('/', async (req, res) => {
  try {
    const products = await ButcheryProduct.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits de boucherie',
      error: error.message
    });
  }
});

// @route   GET /api/butchery-products/:id
// @desc    Obtenir un produit de boucherie par ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const product = await ButcheryProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit de boucherie non trouvé'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du produit de boucherie',
      error: error.message
    });
  }
});

// @route   PUT /api/butchery-products/:id
// @desc    Mettre à jour un produit de boucherie
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, price_per_kg, stock_quantity_kg, category } = req.body;

    // Vérifier si le produit existe
    const product = await ButcheryProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit de boucherie non trouvé'
      });
    }

    const updatedProduct = await ButcheryProduct.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price_per_kg,
        stock_quantity_kg,
        category
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Produit de boucherie mis à jour avec succès',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du produit de boucherie',
      error: error.message
    });
  }
});

// @route   DELETE /api/butchery-products/:id
// @desc    Supprimer un produit de boucherie
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const product = await ButcheryProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit de boucherie non trouvé'
      });
    }

    await ButcheryProduct.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Produit de boucherie supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du produit de boucherie',
      error: error.message
    });
  }
});

module.exports = router; 