const express = require('express');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/stock
// @desc    Obtenir tous les mouvements de stock
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, produitId, typeMouvement, dateDebut, dateFin } = req.query;
    
    // Construire le filtre
    let filter = {};
    
    if (produitId) {
      filter.produitId = produitId;
    }
    
    if (typeMouvement) {
      filter.typeMouvement = typeMouvement;
    }
    
    if (dateDebut || dateFin) {
      filter.createdAt = {};
      if (dateDebut) filter.createdAt.$gte = new Date(dateDebut);
      if (dateFin) filter.createdAt.$lte = new Date(dateFin);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    const movements = await Stock.find(filter)
      .populate('produitId', 'nom sku categorie')
      .populate('utilisateur', 'nom email')
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await Stock.countDocuments(filter);

    res.json({
      success: true,
      data: {
        movements,
        pagination: {
          currentPage: options.page,
          totalPages: Math.ceil(total / options.limit),
          totalMovements: total,
          hasNext: options.page < Math.ceil(total / options.limit),
          hasPrev: options.page > 1
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des mouvements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des mouvements',
      error: error.message
    });
  }
});

// @route   GET /api/stock/:id
// @desc    Obtenir un mouvement de stock par ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const movement = await Stock.findById(req.params.id)
      .populate('produitId', 'nom sku categorie prix')
      .populate('utilisateur', 'nom email');
    
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Mouvement de stock non trouvé'
      });
    }

    res.json({
      success: true,
      data: { movement }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du mouvement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du mouvement',
      error: error.message
    });
  }
});

// @route   POST /api/stock
// @desc    Créer un nouveau mouvement de stock
// @access  Private (Admin/Gestionnaire)
router.post('/', auth, authorize('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { produitId, typeMouvement, quantiteMouvement, motif, numeroCommande, fournisseur } = req.body;

    // Vérifier que le produit existe
    const product = await Product.findById(produitId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Calculer les quantités avant et après
    const quantiteAvant = product.quantite;
    let quantiteApres;

    switch (typeMouvement) {
      case 'entrée':
      case 'retour':
        quantiteApres = quantiteAvant + Math.abs(quantiteMouvement);
        break;
      case 'sortie':
        quantiteApres = quantiteAvant - Math.abs(quantiteMouvement);
        if (quantiteApres < 0) {
          return res.status(400).json({
            success: false,
            message: 'Stock insuffisant pour cette sortie'
          });
        }
        break;
      case 'ajustement':
        quantiteApres = Math.abs(quantiteMouvement);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Type de mouvement invalide'
        });
    }

    // Créer le mouvement de stock
    const stockMovement = new Stock({
      produitId,
      typeMouvement,
      quantiteMouvement: typeMouvement === 'sortie' ? -Math.abs(quantiteMouvement) : Math.abs(quantiteMouvement),
      quantiteAvant,
      quantiteApres,
      motif,
      utilisateur: req.user._id,
      numeroCommande,
      fournisseur
    });

    await stockMovement.save();

    // Mettre à jour la quantité du produit
    await Product.findByIdAndUpdate(produitId, { quantite: quantiteApres });

    // Populer les données pour la réponse
    await stockMovement.populate('produitId', 'nom sku categorie');
    await stockMovement.populate('utilisateur', 'nom email');

    res.status(201).json({
      success: true,
      message: 'Mouvement de stock créé avec succès',
      data: { movement: stockMovement }
    });
  } catch (error) {
    console.error('Erreur lors de la création du mouvement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du mouvement',
      error: error.message
    });
  }
});

// @route   GET /api/stock/product/:productId
// @desc    Obtenir l'historique des mouvements pour un produit
// @access  Private
router.get('/product/:productId', auth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const movements = await Stock.getHistoriqueProduit(req.params.productId, parseInt(limit));

    res.json({
      success: true,
      data: { movements }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'historique',
      error: error.message
    });
  }
});

// @route   GET /api/stock/stats/movements
// @desc    Obtenir les statistiques des mouvements
// @access  Private
router.get('/stats/movements', auth, async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    
    const startDate = dateDebut ? new Date(dateDebut) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 jours par défaut
    const endDate = dateFin ? new Date(dateFin) : new Date();

    const stats = await Stock.getStatistiquesMouvements(startDate, endDate);

    // Statistiques par jour
    const dailyStats = await Stock.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalMouvements: { $sum: 1 },
          entrees: {
            $sum: {
              $cond: [
                { $in: ['$typeMouvement', ['entrée', 'retour']] },
                { $abs: '$quantiteMouvement' },
                0
              ]
            }
          },
          sorties: {
            $sum: {
              $cond: [
                { $eq: ['$typeMouvement', 'sortie'] },
                { $abs: '$quantiteMouvement' },
                0
              ]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        movementStats: stats,
        dailyStats,
        period: {
          startDate,
          endDate
        }
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

// @route   PUT /api/stock/:id
// @desc    Mettre à jour un mouvement de stock (limité)
// @access  Private (Admin)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { motif, numeroCommande, fournisseur } = req.body;
    
    const movement = await Stock.findByIdAndUpdate(
      req.params.id,
      { motif, numeroCommande, fournisseur },
      { new: true, runValidators: true }
    ).populate('produitId', 'nom sku categorie')
     .populate('utilisateur', 'nom email');

    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Mouvement de stock non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Mouvement mis à jour avec succès',
      data: { movement }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mouvement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du mouvement',
      error: error.message
    });
  }
});

module.exports = router;

