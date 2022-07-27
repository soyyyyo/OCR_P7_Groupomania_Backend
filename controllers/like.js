const Sauce = require('../models/sauce');

exports.likeSystem = (req, res, next) => {
    // console.log(req.body.userId)
    // console.log(req.body.like)
    // console.log(req.params)
    Sauce.findOne({_id : req.params.id})
    .then((objet) => {
        
        // if userID NON présent dans usersliked && like value 1
        if(!objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        Sauce.updateOne(
            {_id : req.params.id},
            {
                $inc: {likes: 1},
                $push: {usersLiked: req.body.userId}
            })
        .then(() => res.status(201).json({ message: "Un like en plus !"}))
        .catch(error => res.status(400).json({ error }));
        }

        // if userId présent dans usersLiked && like value 0
        else if(objet.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        Sauce.updateOne(
            {_id : req.params.id},
            {
                $inc: {likes: -1},
                $pull: {usersLiked: req.body.userId}
            })
        .then(() => res.status(201).json({ message: "Un like en plus !"}))
        .catch(error => res.status(400).json({ error }));
            }

        // if userID présent dans usersdisliked && like value 0
        else if(objet.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {dislikes: -1},
                    $pull: {usersDisliked: req.body.userId}
                })
            .then(() => res.status(201).json({ message: "Un like en plus !"}))
            .catch(error => res.status(400).json({ error }));
            }
        
        // if userID non présent dans usersDiliked && like value -1
        else if(!objet.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc: {dislikes: 1},
                    $push: {usersDisliked: req.body.userId}
                })
            .then(() => res.status(201).json({ message: "Un like en plus !"}))
            .catch(error => res.status(400).json({ error }));
            }
    })
    .catch(error => res.status(500).json({ error }));
}
  
  
 