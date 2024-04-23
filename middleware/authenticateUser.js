const User = require('../models/user')

async function authenticateUser(req,res,next){
    if(!req.session.user_id){
        console.log("User not authorized")
        return res.redirect('/')
    }
    const user = await User.findById(req.session.user_id)
    req.user = user
    next()
}


module.exports = authenticateUser