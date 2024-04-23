const express = require('express')
const Product = require('../models/product.js')
const User = require('../models/user.js')


const router = express.Router()

//buys a product
router.post('/products/buy',(req,res)=>{
    //checks if buyer exists
    User.findOne({user_name:req.body.user_name},(error,foundBuy)=>{
        if(error||foundBuy==null)
            res.send("Buyer Not Found")
        else{
            //find product
            Product.findOne({_id:req.body.productID},(error,foundProd)=>{
                if(error||foundProd==null)
                res.send("Product Not Found")
                else{
                    //if buyer already owns
                    if(foundBuy.id==foundProd.owner)
                        res.send("Oops, "+foundBuy.user_name+" already owns this item")
                    if(foundBuy.id!=foundProd.owner){
                        //if buyer doesnt have enough money
                        if(foundBuy.balance<foundProd.price)
                            res.send("Oops, "+foundBuy.user_name+" has insufficient funds")
                        if(foundBuy.balance>=foundProd.price){
                            //find owner
                            User.findById(foundProd.owner,(error,foundOwner)=>{
                                //at this point both users and the product being exchanged has been found and all checks are done
                                if(error||foundOwner==null)
                                    res.send("Owner Not Found")
                                else{
                                    //update buyers info
                                    User.updateOne({ _id: foundBuy._id },{balance:foundBuy.balance-foundProd.price},(error)=>{
                                        //update seller balance
                                        User.updateOne({_id:foundOwner._id},{balance:foundOwner.balance+foundProd.price},(error)=>{
                                            //update items owner
                                            Product.updateOne({_id:foundProd._id},{owner:foundBuy._id},(error)=>{
                                                res.send("Transaction successful!")
                                            })
                                        })
                                    
                                    
                                    })
                                    
                                }
                            })
                        }
                    }
                }
            })
            
            
        
        }
    })
    

})



//displays all products
router.get('/products',(req,res)=>{
    Product.find({},(error,result)=>{
        if(error)
            res.send(error)
        else{
            //makes an array of user
            const userArr  = result.map(u=>{
                return {_id:u._id,name:u.name,price:u.price,owner:u.owner}
            })
        
            res.send(userArr)
        }
    })
})

//creates a product
router.post('/products',(req,res)=>{
    User.findOne({user_name:req.body.seller},(error,result)=>{
        if(error)
            console.log(error)
        else{
            const newProd = new Product({name:req.body.name,price:req.body.price,owner:result._id})
            newProd.save((error,response)=>{
            if(error)
                res.send(error)
            else
                res.send(response)
    })
        }
    })
    

})



//deletes a product by id
router.delete('/products/:id',(req,res)=>{
    const id = req.body.title

    Product.findOneAndDelete({id:id},(error,result)=>{
        if(error)
            res.send(error)
        else{
            if(result == null)
                res.send({message:"Product not found.."})
            else
                res.send(result)
        }
    })
   
})

module.exports = router