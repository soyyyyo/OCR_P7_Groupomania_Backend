const bcrypt = require(`bcrypt`);
const User = require(`../models/User`);
const jwt = require('jsonwebtoken');
require('dotenv').config()


// // age limite du token de connexion, à réduire pour '24h'
// const maxAge = 3 * 24 * 60 * 60 * 1000;

// // crée le token via un encodage du fichier ENV
// const createToken = (id) => {
//   return jwt.sign({ id }, process.env.TOKEN_SECRET, {
//     expiresIn: maxAge
//   })
// };

const RegexEmail = (value) => {
  const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const valid = emailRegexp.test(value);
  return valid;
}


exports.signup = (req, res, next) => {
  const password = req.body.password
  const email = req.body.email
  const username = req.body.username

  if (!RegexEmail(req.body.email)) {
    res.status(401).json({ message: "invalid email, please double check" });
  } else if (password.length < 8) {
    res.status(401).json({ message: "invalid password - min 8 characters" });
  } else {
    bcrypt.hash(password, 10)
      .then(hash => {
        const user = new User({
          email: email,
          password: hash,
          username: username
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      // on renvoi au front si l'user est admin (ne lui donne qu'un affichage, les verifs se feront en back)
      const isAdmin = user.isAdmin;
      if (!user) {
        return res.status(200).json({ error: 'Utilisateur non trouvé !' }); // 200 au lieu de 401 qui catch ERR
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            isAdmin: isAdmin,
            userId: user._id,
            username: user.username,
            token: jwt.sign(
              { userId: user._id },
              process.env.TOKEN_SECRET,
              { expiresIn: '24h' }
            )
          });

        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// exports.getAllUser = (req, res, next) => { };