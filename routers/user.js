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
router.post('/users/register',async(req,res)=>{
    //hashes password
    const pass = req.body.password
    const hashedPassword = await bcrypt.hash(pass,8)
    //creates user
    const u1 = new User({name:req.body.name,user_name:req.body.user_name,password:hashedPassword})
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

router.post('/login',async (req,res)=>{

    const user = await User.findOne({user_name:req.body.user_name})
    if(!user){
        console.log("User not found")
        return res.redirect('/?auth=fail')
    }
    
    const isMatch = await bcrypt.compare(req.body.txtPassword,user.password)
    if(!isMatch){
        console.log("Passwords don't match")
        return res.redirect('/?auth=fail')
    }
    req.session.user_id = user._id

    return res.redirect('/dashboard')
      
    

})

module.exports = router
