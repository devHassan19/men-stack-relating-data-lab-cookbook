const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true //means created At and update At
  }
)

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

module.exports = Ingredient
