const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Photo = require('./models/Photo');
const PORT = 3000;

// Configure Express pour utiliser EJS comme moteur de template
app.set('view engine', 'ejs');

// Indique à Express où se trouvent les fichiers de vue EJS
app.set('views', __dirname + '/views');

// Attendre que MongoDB soit prêt
setTimeout(() => {
  mongoose.connect('mongodb://mongodb:27017/ImageDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('✅ Connexion à MongoDB établie');
    
    // Vérification des collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections existantes:', collections.map(c => c.name));
    
    // Vérification des données
    const count = await Photo.countDocuments();
    console.log(`✅ La collection "photos" contient ${count} documents`);
  })
  .catch(err => console.error('❌ Erreur de connexion à MongoDB:', err));
}, 5000);


const FLICKR_URL = "https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1";

app.get('/', async (req, res) => {
  try {
    const response = await fetch(FLICKR_URL);
    const data = await response.json();

    // Simuler une "page" aléatoire : sélectionner un index de départ aléatoire
    const totalImages = data.items.length;
    const randomStartIndex = Math.floor(Math.random() * (totalImages - 10));

    const images = data.items.slice(randomStartIndex, randomStartIndex + 10).map(photo => ({
      title: photo.title || "Sans titre",
      url: photo.media.m,
      author: photo.author,
      link: photo.link
    }));

    console.log(images);
    
    // Stockage des images dans MongoDB
    for (const image of images) {
      // Vérifier si l'image existe déjà (par URL pour éviter les doublons)
      const existingPhoto = await Photo.findOne({ url: image.url });
      if (!existingPhoto) 
      {
        const newPhoto = new Photo(image);
        await newPhoto.save();
        console.log(`✅ Image "${image.title}" sauvegardée dans MongoDB`);
      } 
      else 
      {
        console.log(`ℹ️ Image "${image.title}" déjà présente dans la base de données`);
      }
    }

    // Récupérer toutes les photos depuis MongoDB pour l'affichage
    // const dbImages = await Photo.find().sort({ dateAdded: -1 }).limit(20);
    
    res.render('index', { images: images });
  }

  catch (error) 
  {
    console.error("❌ Erreur lors de la récupération ou du stockage des images :", error);
    res.status(500).send('❌ Erreur lors de la récupération ou du stockage des images');
  }
});


// Route pour afficher toutes les images stockées
app.get('/stored', async (req, res) => {
  try {
    const storedImages = await Photo.find().sort({ dateAdded: -1 });
    res.render('stored', { images: storedImages });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des images stockées :", error);
    res.status(500).send('❌ Erreur lors de la récupération des images stockées');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});