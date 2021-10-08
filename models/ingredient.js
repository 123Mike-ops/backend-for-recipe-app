const mongoose=require('mongoose')
const ingredientSchema=mongoose.Schema({
    name: { type: String, required: true },
    alcholic: { type: Boolean, required: true },
    description: {type: String, required: false},
    createdDate: { type: Date, default: Date.now() }

});
  const  Ingredient=mongoose.model("Ingredient",ingredientSchema);

module.exports=Ingredient;