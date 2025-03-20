const express = require('express');
const app = express();
const PORT = 3000;

// Configure Express pour utiliser EJS comme moteur de template
app.set('view engine', 'ejs'); 

// Indique à Express où se trouvent les fichiers de vue EJS
app.set('views', __dirname + '/views'); 

const FLICKR_URL = "https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1";

app.get('/', async (req, res) => 
  {
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
        res.render('index', { images });

    } catch (error) 
    {
        console.error("❌ Erreur lors de la récupération des images :", error);
        res.status(500).send('❌ Erreur lors de la récupération des images');
    }
});


app.listen(PORT, () => {
    console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});
