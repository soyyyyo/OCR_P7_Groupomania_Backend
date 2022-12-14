const jwt = require('jsonwebtoken');
require('dotenv').config()


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      console.log("Authorization granted")
      next();
    }
  } catch {
    res.status(401).json({ // au lieu de 401 pour avoir une réponse neutre
      error: 'Please login before accessing API'
    });
  }
};

/*
.then(() => res.status(200).json({ message: 'Objet supprimé !' }))
.catch(error => res.status(400).json({ error }));


      error: new Error('Invalid request!')

*/