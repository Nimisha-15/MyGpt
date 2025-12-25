require("dotenv").config()
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

const authMiddleWare = async (req ,res ,next)=>{
    try {
        let token = req.cookies.token 
         
        if(!token){
            return res.status(404).json({
                message : 'token not found '
            })
        }
        let verifyToken = jwt.verify(token ,process.env.JWT_SECRET)
        
        let user = await userModel.findById(verifyToken.id)
        if(!user){
            return res.status(404).json({
                message : "invalid token "
            })
        }
        req.user = user;
        next()
    } catch (error) {
        console.log("error in auth Middlerware --->" , error)
    }
}
module.exports = authMiddleWare