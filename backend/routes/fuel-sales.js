const express = require('express');
const router = express.Router();
const FuelSale = require('../models/FuelSale');
const Fuel = require('../models/Fuel');

// @route   POST /api/fuel-sales
// @desc    Créer une nouvelle vente de carburant
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { fuel_id, quantity, amount, pump_attendant_id, client_name } = req.body;

    // Vérifier si le carburant existe
    const fuel = await Fuel.findById(fuel_id);
    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Carburant non trouvé'
      });
    }

    // Vérifier si le stock est suffisant
    if (fuel.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock de carburant insuffisant pour cette vente'
      });
    }

    const fuelSale = new FuelSale({
      fuel_id,
      quantity,
      amount,
      pump_attendant_id,
      client_name
    });

    const savedSale = await fuelSale.save();

    // Mettre à jour le stock du carburant
    await Fuel.findByIdAndUpdate(fuel_id, {
      $inc: { quantity: -quantity },
      last_updated: Date.now()
    });

    // Populate les références pour la réponse
    await savedSale.populate('fuel_id', 'type price_per_liter');
    await savedSale.populate('pump_attendant_id', 'username email');

    res.status(201).json({
      success: true,
      message: 'Vente de carburant créée avec succès',
      data: savedSale
    });
  } catch (error) {
    console.error('Erreur lors de la création de la vente de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la vente de carburant',
      error: error.message
    });
  }
});

// @route   GET /api/fuel-sales
// @desc    Obtenir toutes les ventes de carburant
// @access  Private
router.get('/', async (req, res) => {
  try {
    const sales = await FuelSale.find()
      .populate('fuel_id', 'type price_per_liter')
      .populate('pump_attendant_id', 'username email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des ventes de carburant',
      error: error.message
    });
  }
});

// @route   GET /api/fuel-sales/:id
// @desc    Obtenir une vente de carburant par ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const sale = await FuelSale.findById(req.params.id)
      .populate('fuel_id', 'type price_per_liter')
      .populate('pump_attendant_id', 'username email');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Vente de carburant non trouvée'
      });
    }

    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la vente de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la vente de carburant',
      error: error.message
    });
  }
});

// @route   PUT /api/fuel-sales/:id
// @desc    Mettre à jour une vente de carburant
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { fuel_id, quantity, amount, pump_attendant_id, client_name } = req.body;

    // Vérifier si la vente existe
    const sale = await FuelSale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Vente de carburant non trouvée'
      });
    }

    // Vérifier si le carburant existe si fuel_id est fourni
    if (fuel_id) {
      const fuel = await Fuel.findById(fuel_id);
      if (!fuel) {
        return res.status(404).json({
          success: false,
          message: 'Carburant non trouvé'
        });
      }
    }

    // Si la quantité change, ajuster le stock du carburant
    if (quantity !== sale.quantity) {
      const currentFuelId = fuel_id || sale.fuel_id;
      const fuel = await Fuel.findById(currentFuelId);
      
      // Restaurer l'ancienne quantité et vérifier la nouvelle
      const stockAdjustment = sale.quantity - quantity;
      const newStock = fuel.quantity + stockAdjustment;

      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock insuffisant pour cette modification'
        });
      }

      // Mettre à jour le stock
      await Fuel.findByIdAndUpdate(currentFuelId, {
        quantity: newStock,
        last_updated: Date.now()
      });
    }

    const updatedSale = await FuelSale.findByIdAndUpdate(
      req.params.id,
      {
        fuel_id: fuel_id || sale.fuel_id,
        quantity,
        amount,
        pump_attendant_id: pump_attendant_id || sale.pump_attendant_id,
        client_name
      },
      { new: true, runValidators: true }
    ).populate('fuel_id', 'type price_per_liter')
     .populate('pump_attendant_id', 'username email');

    res.json({
      success: true,
      message: 'Vente de carburant mise à jour avec succès',
      data: updatedSale
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la vente de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de la vente de carburant',
      error: error.message
    });
  }
});

// @route   DELETE /api/fuel-sales/:id
// @desc    Supprimer une vente de carburant
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const sale = await FuelSale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Vente de carburant non trouvée'
      });
    }

    // Restaurer le stock du carburant
    await Fuel.findByIdAndUpdate(sale.fuel_id, {
      $inc: { quantity: sale.quantity },
      last_updated: Date.now()
    });

    await FuelSale.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vente de carburant supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vente de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la vente de carburant',
      error: error.message
    });
  }
});

module.exports = router; 