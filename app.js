//Importing resources
const express = require('express')
const fs= require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Note = require('./models/product.js')
const User = require('./models/user.js')
const bcrypt  = require('bcrypt')
const session = require('express-session')

const userRouter = require('./routers/user.js')
const prodRouter = require('./routers/product.js')

require('dotenv').config()



const app = express()

app.listen(process.env.ROUTE)
//app set
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

//app uses
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(userRouter)
app.use(prodRouter)

app.use(session({
    secret:process.env.KEY,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:url})

}))

//my url for database
const url = process.env.MONGOURL
//connects to database
mongoose.connect(url,(err)=>{
    if(err)
        console.log("Error connecting to DB..")
    else
        console.log("Successfully connected to DB..")
})
