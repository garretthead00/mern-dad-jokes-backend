require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const apiRoutes = require('./routes')

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`)
  next()
}) 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use('/api', apiRoutes)

app.listen(process.env.PORT, function () {
  console.log(`App listening on port ${process.env.PORT}'!`);
});