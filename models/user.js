const mongoose = require('mongoose')

//Model for a user
const UserSchema  = mongoose.Schema({
    name:{type:String, required:true},
    user_name:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    balance:{type:Number,default:100}
})
//virtual fields
UserSchema.virtual('items',{
    ref:'Product',
    localField: '_id',
    foreignField: 'owner'
})//sets virtuals to true
UserSchema.set('toJSON',{virtuals:true})
UserSchema.set('toObject',{virtuals:true})

//User model
const User = mongoose.model('User',UserSchema,'users')

//exports User
module.exports = User
