//Importing resources
const express = require('express')
const fs= require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Note = require('./models/product.js')
const User = require('./models/user.js')

const userRouter = require('./routers/user.js')
const prodRouter = require('./routers/product.js')



const app = express()

app.listen(3000)
//app set
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

//app uses
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(userRouter)
app.use(prodRouter)

//my url for database
const url = "mongodb+srv://tgdavis1:test1234@cluster0.tqgynqo.mongodb.net/infinity-marketplace?retryWrites=true&w=majority&appName=Cluster0"
//connects to database
mongoose.connect(url,(err)=>{
    if(err)
        console.log("Error connecting to DB..")
    else
        console.log("Successfully connected to DB..")
})
