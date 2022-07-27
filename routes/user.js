const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// non affectée
// pour récupérer toutes les images de profil : trombinoscope
// router.get('/', userCtrl.getAllUser);


module.exports = router;