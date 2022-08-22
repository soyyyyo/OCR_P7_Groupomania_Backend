const Post = require('../models/post');


module.exports = (req, res, next) => {
    try {
        Post.findOne({ _id: req.params.id })
            .then(post => {
                // vérifie que le userId de req est le même que celui du post, ou celui de l'admin global avant supressions
                const inputUser = req.body.userId // define the super admin user shit thingy
                if (inputUser === post.userId || inputUser === "62fd100b4a0e8ffcebb652d1") {
                    next();
                } else {
                    (error => res.status(400).json({ error }));
                }
            })
    } catch {
        res.status(401).json({ // au lieu de 401 pour avoir une réponse neutre
            error: 'Those datas belongs to another user, you little rascal!'
        });
    }
};