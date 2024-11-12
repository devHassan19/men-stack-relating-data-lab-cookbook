const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
      return res.send('Username already taken.')
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
    }
    //install the bcrypt package for password
    // npm i bcrypt
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    //save/create the user
    const user = await User.create(req.body)
    res.send(`Thanks for signing up ${user.username}`)
  } catch (error) {
    console.log(error)
  }
})

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.')
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )
    if (!validPassword) {
      return res.send('Login failed. Please try again.')
    }

    // log the user in.
    // install npm i express-session

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }
    req.session.message = 'User logged in successfully'
    res.redirect('/')
  } catch (error) {
    console.log(error)
    req.session.message = 'Pleas try again later '
  }
})

router.get('/sign-out', (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
