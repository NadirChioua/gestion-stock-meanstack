const express = require('express');
const router = express.Router();
const FuelEntry = require('../models/FuelEntry');
const Fuel = require('../models/Fuel');

// @route   POST /api/fuel-entries
// @desc    Créer une nouvelle entrée de carburant
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { fuel_id, quantity, user_id } = req.body;

    // Vérifier si le carburant existe
    const fuel = await Fuel.findById(fuel_id);
    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Carburant non trouvé'
      });
    }

    const fuelEntry = new FuelEntry({
      fuel_id,
      quantity,
      user_id
    });

    const savedEntry = await fuelEntry.save();

    // Mettre à jour la quantité du carburant
    await Fuel.findByIdAndUpdate(fuel_id, {
      $inc: { quantity: quantity },
      last_updated: Date.now()
    });

    // Populate les références pour la réponse
    await savedEntry.populate('fuel_id', 'type price_per_liter');
    await savedEntry.populate('user_id', 'username email');

    res.status(201).json({
      success: true,
      message: 'Entrée de carburant créée avec succès',
      data: savedEntry
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'entrée de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'entrée de carburant',
      error: error.message
    });
  }
});

// @route   GET /api/fuel-entries
// @desc    Obtenir toutes les entrées de carburant
// @access  Private
router.get('/', async (req, res) => {
  try {
    const entries = await FuelEntry.find()
      .populate('fuel_id', 'type price_per_liter')
      .populate('user_id', 'username email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des entrées de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des entrées de carburant',
      error: error.message
    });
  }
});

// @route   GET /api/fuel-entries/:id
// @desc    Obtenir une entrée de carburant par ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const entry = await FuelEntry.findById(req.params.id)
      .populate('fuel_id', 'type price_per_liter')
      .populate('user_id', 'username email');

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entrée de carburant non trouvée'
      });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entrée de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'entrée de carburant',
      error: error.message
    });
  }
});

// @route   PUT /api/fuel-entries/:id
// @desc    Mettre à jour une entrée de carburant
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { fuel_id, quantity, user_id } = req.body;

    // Vérifier si l'entrée existe
    const entry = await FuelEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entrée de carburant non trouvée'
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
    if (quantity !== entry.quantity) {
      const currentFuelId = fuel_id || entry.fuel_id;
      const quantityDifference = quantity - entry.quantity;
      
      await Fuel.findByIdAndUpdate(currentFuelId, {
        $inc: { quantity: quantityDifference },
        last_updated: Date.now()
      });
    }

    const updatedEntry = await FuelEntry.findByIdAndUpdate(
      req.params.id,
      {
        fuel_id: fuel_id || entry.fuel_id,
        quantity,
        user_id: user_id || entry.user_id
      },
      { new: true, runValidators: true }
    ).populate('fuel_id', 'type price_per_liter')
     .populate('user_id', 'username email');

    res.json({
      success: true,
      message: 'Entrée de carburant mise à jour avec succès',
      data: updatedEntry
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entrée de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de l\'entrée de carburant',
      error: error.message
    });
  }
});

// @route   DELETE /api/fuel-entries/:id
// @desc    Supprimer une entrée de carburant
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const entry = await FuelEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entrée de carburant non trouvée'
      });
    }

    // Restaurer la quantité du carburant
    await Fuel.findByIdAndUpdate(entry.fuel_id, {
      $inc: { quantity: -entry.quantity },
      last_updated: Date.now()
    });

    await FuelEntry.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Entrée de carburant supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entrée de carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de l\'entrée de carburant',
      error: error.message
    });
  }
});

module.exports = router; 