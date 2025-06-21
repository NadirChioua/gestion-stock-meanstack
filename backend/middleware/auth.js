const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Accès refusé. Aucun token fourni.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-motDePasse');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide. Utilisateur non trouvé.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide.' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expiré.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la vérification du token.' 
    });
  }
};

// Middleware pour vérifier les rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Accès refusé. Utilisateur non authentifié.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès refusé. Permissions insuffisantes.' 
      });
    }

    next();
  };
};

module.exports = { auth, authorize };

