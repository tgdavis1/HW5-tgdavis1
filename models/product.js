
const mongoose = require('mongoose')

//Product Schema
const ProductSchema = mongoose.Schema({
    name:{required: true, type: String},
    price:{required: true, type: Number},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})
//Product Model
const Product = mongoose.model('Product',ProductSchema,"products")

//Exports Product
module.exports = Product
