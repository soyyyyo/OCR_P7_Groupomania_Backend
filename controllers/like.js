const Post = require('../models/post');

exports.likeSystem = (req, res, next) => {
    // console.log(req.auth.userId)
    // console.log(req.body.like)
    // console.log(req.params)
    console.log("like systeme activated")
    Post.findOne({ _id: req.params.id })
        .then((objet) => {

            // if userID NON présent dans usersliked && like value 1
            if (!objet.usersLiked.includes(req.auth.userId) && req.body.like === 1) {
                Post.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.auth.userId }
                    })
                    .then(() => res.status(201).json({ message: "Un like en plus !" }))
                    .catch(error => res.status(400).json({ error }));
            }

            // if userId présent dans usersLiked && like value 0
            else if (objet.usersLiked.includes(req.auth.userId) && req.body.like === 0) {
                Post.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.auth.userId }
                    })
                    .then(() => res.status(201).json({ message: "Un like en moins !" }))
                    .catch(error => res.status(400).json({ error }));
            }

            // if userID présent dans usersdisliked && like value 0
            else if (objet.usersDisliked.includes(req.auth.userId) && req.body.like === 0) {
                Post.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.auth.userId }
                    })
                    .then(() => res.status(201).json({ message: "Un dislike en moins !" }))
                    .catch(error => res.status(400).json({ error }));
            }

            // if userID non présent dans usersDiliked && like value -1
            else if (!objet.usersDisliked.includes(req.auth.userId) && req.body.like === -1) {
                Post.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.auth.userId }
                    })
                    .then(() => res.status(201).json({ message: "Un dislike en plus !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}


