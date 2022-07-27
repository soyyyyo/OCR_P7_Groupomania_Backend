const Comm = require('../models/comm');
const fs = require('fs');

// avec un mix du systeme de like pour trouver le post et insérer le comm dedans

exports.createComm = (req, res, next) => {
  const commObject = JSON.parse(req.body.comm);
  delete commObject._id;
  const comm = new Comm({
    ...commObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  comm.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};



exports.modifyComm = (req, res, next) => {
  const commObject = req.file ? {
    ...JSON.parse(req.body.comm),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete commObject._userId;

  Comm.findOne({ _id: req.params.id })
    .then((comm) => {
      if (comm.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else if (req.file != null) {
        const filename = comm.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Comm.updateOne({ _id: req.params.id }, { ...commObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié!' }))
            .catch(error => res.status(401).json({ error }));
        });
      } else {
        Comm.updateOne({ _id: req.params.id }, { ...commObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }

    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


exports.deleteComm = (req, res, next) => {
  Comm.findOne({ _id: req.params.id })
    .then(comm => {
      const filename = comm.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Comm.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

