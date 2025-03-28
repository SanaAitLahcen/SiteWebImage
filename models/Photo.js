const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Sans titre"
  },
  url: {
    type: String,
    required: true
  },
  author: String,
  link: String,
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

// Création et exportation du modèle 'Photo' basé sur le schéma
module.exports = mongoose.model('Photo', photoSchema);