const express = require('express');
const router = express.Router();
const Fuel = require('../models/Fuel');

// @route   POST /api/fuels
// @desc    Créer un nouveau carburant
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { type, quantity, price_per_liter } = req.body;

    const fuel = new Fuel({
      type,
      quantity,
      price_per_liter
    });

    const savedFuel = await fuel.save();

    res.status(201).json({
      success: true,
      message: 'Carburant créé avec succès',
      data: savedFuel
    });
  } catch (error) {
    console.error('Erreur lors de la création du carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du carburant',
      error: error.message
    });
  }
});

// @route   GET /api/fuels
// @desc    Obtenir tous les carburants
// @access  Private
router.get('/', async (req, res) => {
  try {
    const fuels = await Fuel.find().sort({ last_updated: -1 });

    res.json({
      success: true,
      count: fuels.length,
      data: fuels
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des carburants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des carburants',
      error: error.message
    });
  }
});

// @route   GET /api/fuels/:id
// @desc    Obtenir un carburant par ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const fuel = await Fuel.findById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Carburant non trouvé'
      });
    }

    res.json({
      success: true,
      data: fuel
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du carburant',
      error: error.message
    });
  }
});

// @route   PUT /api/fuels/:id
// @desc    Mettre à jour un carburant
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { type, quantity, price_per_liter } = req.body;

    // Vérifier si le carburant existe
    const fuel = await Fuel.findById(req.params.id);
    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Carburant non trouvé'
      });
    }

    const updatedFuel = await Fuel.findByIdAndUpdate(
      req.params.id,
      {
        type,
        quantity,
        price_per_liter,
        last_updated: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Carburant mis à jour avec succès',
      data: updatedFuel
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du carburant',
      error: error.message
    });
  }
});

// @route   DELETE /api/fuels/:id
// @desc    Supprimer un carburant
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const fuel = await Fuel.findById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Carburant non trouvé'
      });
    }

    await Fuel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Carburant supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du carburant',
      error: error.message
    });
  }
});

module.exports = router; 