const express = require('express')
const router = express.Router()

const Recipe = require('../models/recipe')
const Ingredient = require('../models/ingredient')

router.get('/', async (req, res) => {
  try {
    const populatedRecipes = await Recipe.find({}).populate('owner')
    console.log('Populated recipes:', populatedRecipes)
    res.render('recipes/index.ejs', { Recipe: populatedRecipes })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/new', async (req, res) => {
  const ingredients = await Ingredient.find({})
  res.render('recipes/new.ejs', { ingredients })
})

router.post('/', async (req, res) => {
  req.body.owner = req.session.user._id
  await Recipe.create(req.body)
  res.redirect('/recipes')
})

router.get('/:recipesId', async (req, res) => {
  try {
    const populatedRecipes = await Recipe.findById(
      req.params.recipesId
    ).populate('owner')
    const ingredients = await Ingredient.find({})
    res.render('recipes/show.ejs', {
      Recipe: populatedRecipes,
      ingredients
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.delete('/:recipesId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipesId)
    if (recipe.owner.equals(req.session.user._id)) {
      await Recipe.deleteOne()
      res.redirect('/recipes')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:recipesId/edit', async (req, res) => {
  try {
    const currentRecipes = await Recipe.findById(req.params.recipesId)
    res.render('recipes/edit.ejs', {
      Recipe: currentRecipes
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.put('/:recipesId', async (req, res) => {
  try {
    const currentRecipes = await Recipe.findById(req.params.recipesId)
    if (currentRecipes.owner.equals(req.session.user._id)) {
      await currentRecipes.updateOne(req.body)
      res.redirect('/recipes')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})
module.exports = router
