const express = require('express');
const router = express.Router();
const Accessory = require('../models/Accessory');

// @route   POST /api/accessories
// @desc    Créer un nouvel accessoire
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock_quantity, sku } = req.body;

    // Vérifier si un accessoire avec le même SKU existe déjà
    if (sku) {
      const existingAccessory = await Accessory.findOne({ sku });
      if (existingAccessory) {
        return res.status(400).json({
          success: false,
          message: 'Un accessoire avec ce SKU existe déjà'
        });
      }
    }

    const accessory = new Accessory({
      name,
      description,
      price,
      stock_quantity: stock_quantity || 0,
      sku
    });

    const savedAccessory = await accessory.save();

    res.status(201).json({
      success: true,
      message: 'Accessoire créé avec succès',
      data: savedAccessory
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'accessoire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'accessoire',
      error: error.message
    });
  }
});

// @route   GET /api/accessories
// @desc    Obtenir tous les accessoires
// @access  Private
router.get('/', async (req, res) => {
  try {
    const accessories = await Accessory.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: accessories.length,
      data: accessories
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des accessoires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des accessoires',
      error: error.message
    });
  }
});

// @route   GET /api/accessories/:id
// @desc    Obtenir un accessoire par ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id);

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessoire non trouvé'
      });
    }

    res.json({
      success: true,
      data: accessory
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'accessoire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'accessoire',
      error: error.message
    });
  }
});

// @route   PUT /api/accessories/:id
// @desc    Mettre à jour un accessoire
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, stock_quantity, sku } = req.body;

    // Vérifier si l'accessoire existe
    const accessory = await Accessory.findById(req.params.id);
    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessoire non trouvé'
      });
    }

    // Vérifier si le nouveau SKU existe déjà (sauf pour l'accessoire actuel)
    if (sku && sku !== accessory.sku) {
      const existingAccessory = await Accessory.findOne({ sku });
      if (existingAccessory) {
        return res.status(400).json({
          success: false,
          message: 'Un accessoire avec ce SKU existe déjà'
        });
      }
    }

    const updatedAccessory = await Accessory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        stock_quantity,
        sku
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Accessoire mis à jour avec succès',
      data: updatedAccessory
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'accessoire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de l\'accessoire',
      error: error.message
    });
  }
});

// @route   DELETE /api/accessories/:id
// @desc    Supprimer un accessoire
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id);

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessoire non trouvé'
      });
    }

    await Accessory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Accessoire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'accessoire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de l\'accessoire',
      error: error.message
    });
  }
});

module.exports = router; 