//Importing resources
const express = require('express')
const fs= require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Note = require('./models/product.js')
const User = require('./models/user.js')
const bcrypt  = require('bcrypt')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const userRouter = require('./routers/user.js')
const prodRouter = require('./routers/product.js')

require('dotenv').config()



const app = express()

app.listen(process.env.PORT)
//app set
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

//app uses
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())




//my url for database
const url = process.env.MONGOURL

app.use(session({
    secret:process.env.KEY,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:url})

}))

app.use(userRouter)
app.use(prodRouter)
//connects to database
mongoose.connect()
.then(console.log("Successfully connected to DB.."))
.catch(console.log("Error connecting to DB.."))

