const Post = require('../models/post');
require('dotenv').config()

module.exports = (req, res, next) => {
    // const inputUser = req.body.userId // define the super admin user shit thingy
    const inputUser = req.auth.userId // define the super admin user shit thingy

    console.log("inputuser", inputUser)
    Post.findOne({ _id: req.params.id })
        .then(post => {
            // vérifie que le userId de req est le même que celui du post, ou celui de l'admin global avant supressions
            console.log("inpute user is", inputUser)
            if (inputUser === post.userId || inputUser === process.env.ADMIN_USERID) {
                next();
                console.log("Access accepted")
            } else {
                console.log("Access denied")
                throw (error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));

};