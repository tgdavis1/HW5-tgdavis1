//Import Statements
const express = require('express')
const Product = require('../models/product.js')
const User = require('../models/user.js')

const router = express.Router()


//view all users
router.get('/users',(req,res)=>{
    User.find({}).populate('items').exec((error,result)=>{
        if(error)
            res.send(error)
        else{
            //creates an array
            const userArr  = result.map(u=>{
                return {_id:u._id,name:u.name,user_name:u.user_name,balance:u.balance,items:u.items.length}
            })
            
            res.send(userArr)
        }
    })
})
//router to create user
router.post('/users',(req,res)=>{
    const u1 = new User(req.body)
    u1.save((error,response)=>{
        if(error)
            res.send(error)
        else
            res.send(response)

    })

})
//gets a specific user by username
router.get('/users/:user_name',(req,res)=>{
    User.findOne({user_name:req.params.user_name}).populate('items').exec((error,response)=>{
        if(error)
        res.send(error)
    else
        res.send(response)
    })
})

//gets a summary
router.get('/summary',(req,res)=>{
    User.find({}).populate('items').exec((error,response)=>{
        if(error)
        res.send(error)
    else
        res.send(response)
    })
})

//delete users route
router.delete('/users/:user_name',(req,res)=>{
    //gets user id
    User.findOne({user_name:req.params.user_name},(error,result)=>{
        if(error||result==null){
        console.log(error)
        res.send("user not found")
        }
    else{
        console.log(result)
        const id1=result._id
        //deletes users product
        Product.deleteMany({owner:id1},(error,result)=>{
            if(error)
                 res.send(error)
             else{
                //deletes user
                 User.findOneAndDelete({user_name:req.params.user_name},(error,result)=>{
                     if(error)
                         res.send(error)
                     else{
                         if(result == null)
                             res.send({message:"User not found.."})
                         else
                             res.send(result)
                     }
                 })
             }
         })
        }
    })
    
})

module.exports = router
