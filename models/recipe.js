const mongoose = require('mongoose')

const recipesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    instructions: {
      type: String
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ingredient: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ingredient'
      }
    ]
  },
  {
    timestamps: true //means created At and update At
  }
)

const Recipe = mongoose.model('Recipe', recipesSchema)

module.exports = Recipe
