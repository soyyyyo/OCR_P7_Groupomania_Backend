const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  // champ _id automatiquent généré par Moongoose
  title: { type: String, required: true },
  text: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  userImageUrl: { type: String, required: false },
  likes: { type: Number, required: false, default: 0 },
  dislikes: { type: Number, required: false, default: 0 },
  usersLiked: { type: [String], required: false, default: [] },
  usersDisliked: { type: [String], required: false, default: [] },
});

// défini le nom du répértoire, et le type de shéma utilisé
module.exports = mongoose.model('Posts', postSchema);





