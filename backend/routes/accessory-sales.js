const express = require('express');
const router = express.Router();
const AccessorySale = require('../models/AccessorySale');
const Accessory = require('../models/Accessory');

// @route   POST /api/accessory-sales
// @desc    Créer une nouvelle vente d'accessoire
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { accessory_id, quantity, total_amount, user_id } = req.body;

    // Vérifier si l'accessoire existe
    const accessory = await Accessory.findById(accessory_id);
    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessoire non trouvé'
      });
    }

    // Vérifier si le stock est suffisant
    if (accessory.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuffisant pour cette vente'
      });
    }

    const accessorySale = new AccessorySale({
      accessory_id,
      quantity,
      total_amount,
      user_id
    });

    const savedSale = await accessorySale.save();

    // Mettre à jour le stock de l'accessoire
    await Accessory.findByIdAndUpdate(accessory_id, {
      $inc: { stock_quantity: -quantity }
    });

    // Populate les références pour la réponse
    await savedSale.populate('accessory_id', 'name sku');
    await savedSale.populate('user_id', 'username email');

    res.status(201).json({
      success: true,
      message: 'Vente d\'accessoire créée avec succès',
      data: savedSale
    });
  } catch (error) {
    console.error('Erreur lors de la création de la vente d\'accessoire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la vente d\'accessoire',
      error: error.message
    });
  }
});

// @route   GET /api/accessory-sales
// @desc    Obtenir toutes les ventes d'accessoires
// @access  Private
router.get('/', async (req, res) => {
  try {
    const sales = await AccessorySale.find()
      .populate('accessory_id', 'name sku')
      .populate('user_id', 'username email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes d\'accessoires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des ventes d\'accessoires',
      error: error.message
    });
  }
});

// @route   GET /api/accessory-sales/:id
// @desc    Obtenir une vente d'accessoire par ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const sale = await AccessorySale.findById(req.params.id)
      .populate('accessory_id', 'name sku')
      .populate('user_id', 'username email');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Vente d\'accessoire non trouvée'
      });
    }

    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la vente d\'accessoire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la vente d\'accessoire',
      error: error.message
    });
  }
});

// @route   PUT /api/accessory-sales/:id
// @desc    Mettre à jour une vente d'accessoire
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { accessory_id, quantity, total_amount, user_id } = req.body;

    // Vérifier si la vente existe
    const sale = await AccessorySale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Vente d\'accessoire non trouvée'
      });
    }

    // Si la quantité change, ajuster le stock
    if (quantity !== sale.quantity) {
      const accessory = await Accessory.findById(accessory_id || sale.accessory_id);
      if (!accessory) {
        return res.status(404).json({
          success: false,
          message: 'Accessoire non trouvé'
        });
      }

      // Restaurer l'ancienne quantité et vérifier la nouvelle
      const stockAdjustment = sale.quantity - quantity;
      const newStock = accessory.stock_quantity + stockAdjustment;

      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock insuffisant pour cette modification'
        });
      }

      // Mettre à jour le stock
      await Accessory.findByIdAndUpdate(accessory_id || sale.accessory_id, {
        stock_quantity: newStock
      });
    }

    const updatedSale = await AccessorySale.findByIdAndUpdate(
      req.params.id,
      {
        accessory_id: accessory_id || sale.accessory_id,
        quantity,
        total_amount,
        user_id: user_id || sale.user_id
      },
      { new: true, runValidators: true }
    ).populate('accessory_id', 'name sku')
     .populate('user_id', 'username email');

    res.json({
      success: true,
      message: 'Vente d\'accessoire mise à jour avec succès',
      data: updatedSale
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la vente d\'accessoire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de la vente d\'accessoire',
      error: error.message
    });
  }
});

// @route   DELETE /api/accessory-sales/:id
// @desc    Supprimer une vente d'accessoire
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const sale = await AccessorySale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Vente d\'accessoire non trouvée'
      });
    }

    // Restaurer le stock
    await Accessory.findByIdAndUpdate(sale.accessory_id, {
      $inc: { stock_quantity: sale.quantity }
    });

    await AccessorySale.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vente d\'accessoire supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vente d\'accessoire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la vente d\'accessoire',
      error: error.message
    });
  }
});

module.exports = router; 