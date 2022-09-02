const Post = require('../models/post');
const fs = require('fs');


exports.createPost = (req, res, next) => {

  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  if (!req.file) {
    const post = new Post({
      ...postObject,
      imageUrl: null // si il n'y a pas d'image
    });
    post.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
      .catch(error => res.status(400).json({ error }));
  } else {
    const post = new Post({
      ...postObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/Post/${req.file.filename}` /// lien vers le dossier de la BDD
    });
    post.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
      .catch(error => res.status(400).json({ error }));
  }
  ////
};

// affichage d'un seul post: non utilisé à ce jour
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
    imageUrl: `${req.protocol}://${req.get('host')}/images/Post/${req.file.filename}`
  } : { ...JSON.parse(req.body.post) }; //JSON.parse car on envoi un objet JS

  delete postObject._userId;

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      // si l'image doit être remplacée : un file en upload, une valeur pour imageURL dans le post
      if (req.file != null && post.imageUrl != null) {
        const filename = post.imageUrl.split('/images/Post')[1]; // chemins posts ??
        fs.unlink(`images/Post/${filename}`, () => {
          Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié! Image remplacée' }))
            .catch(error => res.status(401).json({ error }));
        });
        // si l'image doit être ajoutée (pas de valeur imageUrl dans post), ou update sans images
      } else if (req.file === null || post.imageUrl === null) {
        Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié! Sans images.' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


// supprime un post et l'image correspondante
exports.deletePost = (req, res, next) => {
  console.log("is tryin to access delete function", req.body.userId)
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (post.imageUrl === null) {
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      } else {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch(error => res.status(400).json({ error }));
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
};

// exporte tout les posts et toutes leurs données
exports.getAllPost = (req, res, next) => {
  Post.find().then(
    (posts) => {
      /// idéalement pouvoir cacher le userId et ne prévoir qu'un boolean pour l'acces front des edit/delete
      // posts.forEach(post => {
      //   if (req.auth.userId = post.userId) {
      //     post.userId = true
      //   } else {
      //     post.userId = false
      //   }
      // });
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