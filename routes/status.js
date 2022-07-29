const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({ message: "Cool, ça fonctionne" })
});

// non affectée
// pour récupérer toutes les images de profil : trombinoscope
// router.get('/', userCtrl.getAllUser);


module.exports = router;