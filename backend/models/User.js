const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'gestionnaire', 'utilisateur'],
    default: 'utilisateur'
  }
}, {
  timestamps: true
});

// Hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);

