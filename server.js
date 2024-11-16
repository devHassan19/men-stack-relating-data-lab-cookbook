//--------------Const -----------------//
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const authController = require('./controllers/auth.js')
const session = require('express-session')
const isSignIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js')
const recipesController = require('./controllers/recipes.js')
const ingredientsController = require('./controllers/ingredients.js')

const port = process.env.PORT ? process.env.PORT : '3001'
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})
//---------------App.use----------------------//
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

app.use(passUserToView)

app.use((req, res, next) => {
  if (req.session.message) {
    console.log('req.session.message', req.session.message)
    res.locals.message = req.session.message
    req.session.message = null
  } else {
    res.locals.message = null
  }
  next()
})

app.use('/recipes', isSignIn, recipesController)
app.use('/ingredients', isSignIn, ingredientsController)

app.use('/auth', authController)
//---------------Routes----------------------//
app.get('/', async (req, res) => {
  res.render('index.ejs')
})

app.listen(port, () => {
  console.log(`The express app is ready on part ${port}`)
})
