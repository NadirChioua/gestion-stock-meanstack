const express = require('express');
const router = express.Router();
const CarWashService = require('../models/CarWashService');

// @route   POST /api/car-wash-services
// @desc    Créer un nouveau service de lavage de voiture
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, price, duration } = req.body;

    const carWashService = new CarWashService({
      name,
      price,
      duration
    });

    const savedService = await carWashService.save();

    res.status(201).json({
      success: true,
      message: 'Service de lavage de voiture créé avec succès',
      data: savedService
    });
  } catch (error) {
    console.error('Erreur lors de la création du service de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du service de lavage de voiture',
      error: error.message
    });
  }
});

// @route   GET /api/car-wash-services
// @desc    Obtenir tous les services de lavage de voiture
// @access  Private
router.get('/', async (req, res) => {
  try {
    const services = await CarWashService.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des services de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des services de lavage de voiture',
      error: error.message
    });
  }
});

// @route   GET /api/car-wash-services/:id
// @desc    Obtenir un service de lavage de voiture par ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const service = await CarWashService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service de lavage de voiture non trouvé'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du service de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du service de lavage de voiture',
      error: error.message
    });
  }
});

// @route   PUT /api/car-wash-services/:id
// @desc    Mettre à jour un service de lavage de voiture
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, price, duration } = req.body;

    // Vérifier si le service existe
    const service = await CarWashService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service de lavage de voiture non trouvé'
      });
    }

    const updatedService = await CarWashService.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        duration
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Service de lavage de voiture mis à jour avec succès',
      data: updatedService
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du service de lavage de voiture',
      error: error.message
    });
  }
});

// @route   DELETE /api/car-wash-services/:id
// @desc    Supprimer un service de lavage de voiture
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const service = await CarWashService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service de lavage de voiture non trouvé'
      });
    }

    await CarWashService.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service de lavage de voiture supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du service de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du service de lavage de voiture',
      error: error.message
    });
  }
});

module.exports = router; 