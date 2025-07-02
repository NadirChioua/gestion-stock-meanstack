const express = require('express');
const router = express.Router();
const CarWashTicket = require('../models/CarWashTicket');
const CarWashService = require('../models/CarWashService');

// @route   POST /api/car-wash-tickets
// @desc    Créer un nouveau ticket de lavage de voiture
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { service_id, client_name, vehicle_info, payment_status, washer_id, amount } = req.body;

    // Vérifier si le service existe
    const service = await CarWashService.findById(service_id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service de lavage de voiture non trouvé'
      });
    }

    const carWashTicket = new CarWashTicket({
      service_id,
      client_name,
      vehicle_info,
      payment_status: payment_status || 'pending',
      washer_id,
      amount
    });

    const savedTicket = await carWashTicket.save();

    // Populate les références pour la réponse
    await savedTicket.populate('service_id', 'name price duration');
    await savedTicket.populate('washer_id', 'username email');

    res.status(201).json({
      success: true,
      message: 'Ticket de lavage de voiture créé avec succès',
      data: savedTicket
    });
  } catch (error) {
    console.error('Erreur lors de la création du ticket de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du ticket de lavage de voiture',
      error: error.message
    });
  }
});

// @route   GET /api/car-wash-tickets
// @desc    Obtenir tous les tickets de lavage de voiture
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tickets = await CarWashTicket.find()
      .populate('service_id', 'name price duration')
      .populate('washer_id', 'username email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des tickets de lavage de voiture',
      error: error.message
    });
  }
});

// @route   GET /api/car-wash-tickets/:id
// @desc    Obtenir un ticket de lavage de voiture par ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const ticket = await CarWashTicket.findById(req.params.id)
      .populate('service_id', 'name price duration')
      .populate('washer_id', 'username email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket de lavage de voiture non trouvé'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du ticket de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du ticket de lavage de voiture',
      error: error.message
    });
  }
});

// @route   PUT /api/car-wash-tickets/:id
// @desc    Mettre à jour un ticket de lavage de voiture
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { service_id, client_name, vehicle_info, payment_status, washer_id, amount } = req.body;

    // Vérifier si le ticket existe
    const ticket = await CarWashTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket de lavage de voiture non trouvé'
      });
    }

    // Vérifier si le service existe si service_id est fourni
    if (service_id) {
      const service = await CarWashService.findById(service_id);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service de lavage de voiture non trouvé'
        });
      }
    }

    const updatedTicket = await CarWashTicket.findByIdAndUpdate(
      req.params.id,
      {
        service_id: service_id || ticket.service_id,
        client_name,
        vehicle_info,
        payment_status,
        washer_id: washer_id || ticket.washer_id,
        amount
      },
      { new: true, runValidators: true }
    ).populate('service_id', 'name price duration')
     .populate('washer_id', 'username email');

    res.json({
      success: true,
      message: 'Ticket de lavage de voiture mis à jour avec succès',
      data: updatedTicket
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du ticket de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du ticket de lavage de voiture',
      error: error.message
    });
  }
});

// @route   DELETE /api/car-wash-tickets/:id
// @desc    Supprimer un ticket de lavage de voiture
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await CarWashTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket de lavage de voiture non trouvé'
      });
    }

    await CarWashTicket.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Ticket de lavage de voiture supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du ticket de lavage de voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du ticket de lavage de voiture',
      error: error.message
    });
  }
});

module.exports = router; 