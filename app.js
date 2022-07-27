const express = require('express');
const app = express();
const mongoose = require('mongoose');


// sanitizer pour éviter les injections
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(mongoSanitize());

app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  }),
);


const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');


// variable environnement .env a la racine


/// CONNEXION A MOONGOOSE
mongoose.connect('mongodb+srv://izame:KryptoJustice75@cluster0.owgl8.mongodb.net/?retryWrites=true&w=majority',
// compte restreint pour ne pas divulguer le compte admin sur github
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

/// DEFINITION DES HEADERS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
