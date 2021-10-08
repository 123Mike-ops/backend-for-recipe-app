const mongoose = require("mongoose");
const rateSchema = mongoose.Schema({
  recipeId: { type: String, required: true },
  rateAmount: { type: Number },
});
const Rate = mongoose.model("Rate", rateSchema);

module.exports = Rate;
