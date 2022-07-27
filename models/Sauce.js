const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  // champ _id automatiquent généré par Moongoose
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    userId: { type: String, required: true },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 },
    usersLiked: { type: [String], required: false, default: [] },
    usersDisliked: { type: [String], required: false, default: [] },
  });

  // défini le nom du répértoire, et le type de shéma utilisé
module.exports = mongoose.model('Sauces', sauceSchema);

