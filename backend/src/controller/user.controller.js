require("dotenv").config()
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const chatModel = require("../models/chat.model")
const messageRouter = require("../routes/message.routes")

const registerController = async (req,res)=>{
    try {
        // api of new user
        const{name ,email,password} = req.body
        if(!name || !email || !password) return res.status(401).json({
            message : "all fields are required"
        })        
        const existingUser = await userModel.findOne({email})
        if(existingUser) return res.status(403).json({
            message : "user already register by this email",
            success : false,

        }) 


        const newUser = await userModel.create({name,email,password})
        
        //generate token 
        const token = jwt.sign({id :newUser._id},process.env.JWT_SECRET,{
            expiresIn : '30d'
        })
        res.cookie("token" , token )

        return res.status(202).json({
            message:"user register successfully ",
            user : newUser
        })

    } catch (error) {
        console.log("error in register controller ---->" , error )
        return res.status(401).json({
            message : "error in register user ",
            error : error
        })
    }
}

// api for login user

const loginController = async (req, res)=>{

    try {
        const {email , password} = req.body 
        if(!email || !password) return res.status(404).json({
            message : "all fields required"
        })
        const user = await userModel.findOne({email})
        if(!user) return res.status(404).json({
            message : 'user not found'
        })

        let comparePassword = await user.compare(password);

        if (!comparePassword) return res.status(400).json({
            message : "incorrect password "
        })

        let token = jwt.sign({id : user._id } , process.env.JWT_SECRET ,{expiresIn : '30d'})
        res.cookie("token" , token)

        return res.status(200).json({
            message : 'user login successfully ',
            user : user
        })

        
    } catch (error) {
        console.log("error in login controller ---->" , error )
        return res.status(400).json({
            message : " error in login controller",
            error : error
        })
        
    }

}

// api to get published images
const getPublishedImages = async (req ,res)=>{
    try {
        const publishedImageMessages = await chatModel.aggregate([
            {$unwind : "$messages"},{
                $match : {
                    "message.isImage" : true,
                    "message.isPublished" : true
                }
            },
            {
                $project : {
                    _id : 0,
                    imageUrl : "$message.content",
                    userName : "$userName"
                }
            }
        ])

        res.status(200).json({
            message : "successfully image published",
            images : publishedImageMessages.reverse()
        })
        
    } catch (error) {
        console.log("error in publish images --->" , error)
    }
}

module.exports={
    registerController,
    loginController,
    getPublishedImages
}