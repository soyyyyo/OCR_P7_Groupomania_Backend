const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const commsCtrl = require('../controllers/comms');

router.post('/', auth, commsCtrl.createComm);
router.put('/:id', auth, commsCtrl.modifyComm);
router.delete('/:id', auth, commsCtrl.deleteComm);


module.exports = router;