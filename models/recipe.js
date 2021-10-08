const mongoose = require("mongoose");
const User = require("./user");
const Ingredient = require("./ingredient");
const searchable = require("mongoose-regex-search");
const recipeSchema = mongoose.Schema({
  name: { type: String, required: true, searchable: true },
  skill: { type: String },
  prepTime: { type: String },
  ingridientNature: { type: String },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  photo: { type: String },
  rate: { type: Number },
  createdDate: { type: Date, default: Date.now() },
});
recipeSchema.plugin(searchable);
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
