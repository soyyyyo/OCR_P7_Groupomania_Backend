const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// export du model mongoose, nom et shéma de donnée
module.exports = mongoose.model('User', userSchema);