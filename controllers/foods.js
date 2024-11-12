const express = require('express')
const router = express.Router()

const foods = require('../models/food')
const Foods = require('../models/food')

router.get('/', async (req, res) => {
  try {
    const populatedFoods = await Foods.find({}).populate('owner')
    console.log('Populated foods:', populatedFoods)
    res.render('foods/index.ejs', { Foods: populatedFoods })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/new', async (req, res) => {
  res.render('foods/new.ejs')
})

router.post('/', async (req, res) => {
  req.body.owner = req.session.user._id
  await foods.create(req.body)
  res.redirect('/foods')
})

router.get('/:foodsId', async (req, res) => {
  try {
    const populatedFoods = await Foods.findById(req.params.foodsId).populate(
      'owner'
    )
    res.render('foods/show.ejs', {
      Foods: populatedFoods
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.delete('/:foodsId', async (req, res) => {
  try {
    const foods = await Foods.findById(req.params.foodsId)
    if (foods.owner.equals(req.session.user._id)) {
      await foods.deleteOne()
      res.redirect('/foods')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:foodsId/edit', async (req, res) => {
  try {
    const currentFoods = await foods.findById(req.params.foodsId)
    res.render('foods/edit.ejs', {
      foods: currentFoods
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.put('/:foodsId', async (req, res) => {
  try {
    const currentFoods = await foods.findById(req.params.foodsId)
    if (currentFoods.owner.equals(req.session.user._id)) {
      await currentFoods.updateOne(req.body)
      res.redirect('/foods')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})
module.exports = router
