const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()


const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const userComms = require('./routes/comms');
const statusRoutes = require("./routes/status");
const path = require('path');


// variable environnement .env a la racine


/// CONNEXION A MOONGOOSE
mongoose.connect(process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

/// DEFINITION DES HEADERS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, X-Auth-Token');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // ?????
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/comms', userComms)
app.use('/api/status', statusRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

