const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const access = require('../middleware/access');

const postsCtrl = require('../controllers/posts');
const like = require(`../controllers/like`);

router.get('/', auth, postsCtrl.getAllPost);
router.post('/', auth, multer, postsCtrl.createPost); //multer, auth
router.get('/:id', auth, postsCtrl.getOnePost);
router.put('/:id', auth, access, multer, postsCtrl.modifyPost); // access
router.delete('/:id', auth, access, postsCtrl.deletePost);
router.post('/:id/like', auth, like.likeSystem);


module.exports = router;