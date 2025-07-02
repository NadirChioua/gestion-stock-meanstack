const express = require('express');
const router = express.Router();
const ButcherySale = require('../models/ButcherySale');
const ButcheryProduct = require('../models/ButcheryProduct');

// @route   POST /api/butchery-sales
// @desc    Créer une nouvelle vente de boucherie
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity_kg, total_amount, user_id } = req.body;

    // Vérifier si le produit existe
    const product = await ButcheryProduct.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit de boucherie non trouvé'
      });
    }

    // Vérifier si le stock est suffisant
    if (product.stock_quantity_kg < quantity_kg) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuffisant pour cette vente'
      });
    }

    const butcherySale = new ButcherySale({
      product_id,
      quantity_kg,
      total_amount,
      user_id
    });

    const savedSale = await butcherySale.save();

    // Mettre à jour le stock du produit
    await ButcheryProduct.findByIdAndUpdate(product_id, {
      $inc: { stock_quantity_kg: -quantity_kg }
    });

    // Populate les références pour la réponse
    await savedSale.populate('product_id', 'name category');
    await savedSale.populate('user_id', 'username email');

    res.status(201).json({
      success: true,
      message: 'Vente de boucherie créée avec succès',
      data: savedSale
    });
  } catch (error) {
    console.error('Erreur lors de la création de la vente de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la vente de boucherie',
      error: error.message
    });
  }
});

// @route   GET /api/butchery-sales
// @desc    Obtenir toutes les ventes de boucherie
// @access  Private
router.get('/', async (req, res) => {
  try {
    const sales = await ButcherySale.find()
      .populate('product_id', 'name category')
      .populate('user_id', 'username email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des ventes de boucherie',
      error: error.message
    });
  }
});

// @route   GET /api/butchery-sales/:id
// @desc    Obtenir une vente de boucherie par ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const sale = await ButcherySale.findById(req.params.id)
      .populate('product_id', 'name category')
      .populate('user_id', 'username email');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Vente de boucherie non trouvée'
      });
    }

    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la vente de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la vente de boucherie',
      error: error.message
    });
  }
});

// @route   PUT /api/butchery-sales/:id
// @desc    Mettre à jour une vente de boucherie
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { product_id, quantity_kg, total_amount, user_id } = req.body;

    // Vérifier si la vente existe
    const sale = await ButcherySale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Vente de boucherie non trouvée'
      });
    }

    // Si la quantité change, ajuster le stock
    if (quantity_kg !== sale.quantity_kg) {
      const product = await ButcheryProduct.findById(product_id || sale.product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produit de boucherie non trouvé'
        });
      }

      // Restaurer l'ancienne quantité et vérifier la nouvelle
      const stockAdjustment = sale.quantity_kg - quantity_kg;
      const newStock = product.stock_quantity_kg + stockAdjustment;

      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock insuffisant pour cette modification'
        });
      }

      // Mettre à jour le stock
      await ButcheryProduct.findByIdAndUpdate(product_id || sale.product_id, {
        stock_quantity_kg: newStock
      });
    }

    const updatedSale = await ButcherySale.findByIdAndUpdate(
      req.params.id,
      {
        product_id: product_id || sale.product_id,
        quantity_kg,
        total_amount,
        user_id: user_id || sale.user_id
      },
      { new: true, runValidators: true }
    ).populate('product_id', 'name category')
     .populate('user_id', 'username email');

    res.json({
      success: true,
      message: 'Vente de boucherie mise à jour avec succès',
      data: updatedSale
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la vente de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de la vente de boucherie',
      error: error.message
    });
  }
});

// @route   DELETE /api/butchery-sales/:id
// @desc    Supprimer une vente de boucherie
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const sale = await ButcherySale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Vente de boucherie non trouvée'
      });
    }

    // Restaurer le stock
    await ButcheryProduct.findByIdAndUpdate(sale.product_id, {
      $inc: { stock_quantity_kg: sale.quantity_kg }
    });

    await ButcherySale.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vente de boucherie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vente de boucherie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la vente de boucherie',
      error: error.message
    });
  }
});

module.exports = router; 