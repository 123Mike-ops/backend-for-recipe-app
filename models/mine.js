const mongoose = require("mongoose");
const mineSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  recipeRate: { type: Number },
  userId: { type: String },
});
const Mine = mongoose.model("Mine", mineSchema);

module.exports = Mine;
