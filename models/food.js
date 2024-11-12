const mongoose = require('mongoose')

const foodsSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true //means created At and update At
  }
)

const Foods = mongoose.model('Foods', foodsSchema)

module.exports = Foods
