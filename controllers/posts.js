const Post = require('../models/post');
const fs = require('fs');


exports.createPost = (req, res, next) => {

  // console.log("body", req.body);
  // console.log("body file", req.body.file);
  // console.log("body filename", req.body);
  // console.log("file filename", req.file);

  // console.log("json parse body", JSON.parse(req.body));
  // console.log("json parse post", JSON.parse(req.body.post));
  // console.log("json parse image", JSON.parse(req.body.image));


  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  const post = new Post({
    ...postObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/Post/${req.file.filename}` /// lien vers folder inscrit en bdd
  });
  post.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id
  }).then(
    (post) => {
      res.status(200).json(post);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};


exports.modifyPost = (req, res, next) => {
  const postObject = req.file ? {
    ...JSON.parse(req.body.post),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete postObject._userId;

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else if (req.file != null) {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié!' }))
            .catch(error => res.status(401).json({ error }));
        });
      } else {
        Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }

    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};



exports.deletePost = (req, res, next) => {
  console.log("is tryin to access delete function", req.body.userId)

  Post.findOne({ _id: req.params.id })
    .then(post => {
      // vérifie que le userId de req est le même que celui du post, ou celui de l'admin global avant supressions
      const inputUser = req.body.userId // define the super admin user shit thingy
      if (inputUser === post.userId || inputUser === "62fd100b4a0e8ffcebb652d1") {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch(error => res.status(400).json({ error }));
        });
      } else {
        (error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
};


exports.getAllPost = (req, res, next) => {
  Post.find().then(
    (posts) => {
      res.status(200).json(posts);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};