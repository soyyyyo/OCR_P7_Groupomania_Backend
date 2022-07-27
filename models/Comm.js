const mongoose = require('mongoose');

const commSchema = mongoose.Schema({
  // champ _id automatiquent généré par Moongoose
  text: { type: String, required: true },
  userId: { type: String, required: true },
});

// défini le nom du répértoire, et le type de shéma utilisé
module.exports = mongoose.model('Comms', commSchema);

