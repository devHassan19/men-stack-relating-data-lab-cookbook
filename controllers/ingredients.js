const express = require('express')
const router = express.Router()

const Ingredient = require('../models/ingredient')

router.get('/', async (req, res) => {
  try {
    const populatedIngredient = await Ingredient.find({}).populate('owner')
    console.log('Populated ingredient:', populatedIngredient)
    res.render('ingredients/index.ejs', { Ingredient: populatedIngredient })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/new', async (req, res) => {
  res.render('ingredients/new.ejs')
})

router.post('/', async (req, res) => {
  req.body.owner = req.session.user._id
  await Ingredient.create(req.body)
  res.redirect('/ingredients')
})

router.get('/:ingredientsId', async (req, res) => {
  try {
    const populatedIngredients = await Ingredient.findById(
      req.params.ingredientsId
    ).populate('owner')
    res.render('ingredients/show.ejs', {
      Ingredient: populatedIngredients
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/:ingredientsId/edit', async (req, res) => {
  try {
    const currentIngredients = await Ingredient.findById(
      req.params.ingredientsId
    )
    res.render('ingredients/edit.ejs', {
      Ingredient: currentIngredients
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.put('/:ingredientsId', async (req, res) => {
  try {
    const currentIngredients = await Ingredient.findById(
      req.params.ingredientsId
    )
    if (currentIngredients.owner.equals(req.session.user._id)) {
      await currentIngredients.updateOne(req.body)
      res.redirect('/ingredients')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.delete('/:ingredientsId', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.ingredientsId)
    if (ingredient.owner.equals(req.session.user._id)) {
      await Ingredient.deleteOne()
      res.redirect('/ingredients')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

module.exports = router
