//Import Statements
const express = require('express')
const Product = require('../models/product.js')
const User = require('../models/user.js')
const bcrypt=require('bcrypt')
const router = express.Router()
const session = require('express-session')
const authenticateUser = require('../middleware/authenticateUser')



//router to create user
router.post('/users/register',async(req,res)=>{
    //hashes password
    const pass = req.body.password
    const hashedPassword = await bcrypt.hash(pass,8)
    //creates user
    const u1 = new User({name:req.body.name,user_name:req.body.user_name,password:hashedPassword})
    await u1.save()
    req.session.user_id = u1._id
    res.redirect('/users/me')

})
//gets a specific user by username
router.get('/users/me',authenticateUser,async(req,res)=>{
    try{
    await req.user.populate('items')
    res.send({name:req.user.name,user_name:req.user.user_name,balance:req.user.balance,items:req.user.items})
    }
    catch(e){
        res.send(e)
    }
})

//gets a summary
router.get('/summary',async(req,res)=>{
    let users=await User.find({}).populate('items').exec()
    res.send(users)
})

//delete users route
router.delete('/users/me',authenticateUser,async(req,res)=>{
    try{
        //deletes users product
        await Product.deleteMany({owner:req.user._id})
        //deletes user
        await User.deleteOne(req.user)
        res.send({message: "Successfully Deleted "+req.user.name})
    }
    catch(e){
        res.send(e)
    }
    })
    

//login route
router.post('/users/login',async (req,res)=>{
    try{
    const user = await User.findOne({user_name:req.body.user_name})
    if(!user){
        console.log("User not found")
        return res.redirect('/?auth=fail')
    }
    
    const isMatch = await bcrypt.compare(req.body.password,user.password)
    if(!isMatch){
        console.log("Passwords don't match")
        return res.redirect('/?auth=fail')
    }
    req.session.user_id = user._id

    return res.redirect('/users/me')
}
catch(e){
    res.send(e)
}
})
//logout route
router.post('/users/logout',authenticateUser,(req,res)=>{
    try{
    req.session.destroy(()=>{
        return res.send({message: "Successfully logged out "+req.user.name})
    })
}
catch(e){
    res.send(e)
}
})

module.exports = router
