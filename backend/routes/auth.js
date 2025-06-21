const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Enregistrer un nouvel utilisateur
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { nom, email, motDePasse, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer un nouvel utilisateur
    const user = new User({
      nom,
      email,
      motDePasse,
      role: role || 'utilisateur'
    });

    await user.save();

    // Générer un token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: {
          id: user._id,
          nom: user.nom,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Connecter un utilisateur
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(motDePasse);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Générer un token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user._id,
          nom: user.nom,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtenir les informations de l'utilisateur connecté
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          nom: req.user.nom,
          email: req.user.email,
          role: req.user.role,
          createdAt: req.user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du profil',
      error: error.message
    });
  }
});

module.exports = router;

