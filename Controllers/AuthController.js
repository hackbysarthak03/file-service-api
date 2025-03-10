const UserModel = require("../Models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signUpController = async (req, res) => {
    try{
    const {name, username, password} = req.body

    const user = await UserModel.findOne({username})
    if(user){
        return res.status(409).json({message: 'Username already exist', success: 'false'})
    }

    const userModel = new UserModel({name, username, password})
    userModel.password = await bcrypt.hash(password, 10);   
    await userModel.save()

    return res.status(200).json({message: 'User created Successfully', success: 'true'})
    
    }catch(err){
        return res.status(500).json({message:'Internal Server Error'})
    }
}

const loginController = async (req, res) => {
    try{
        const {username, password} = req.body
        const user = await UserModel.findOne({username})

        if(!user){
            return res.status(403).json({message: 'Invalid credentials', success: false})
        }

        const isPassEqual = bcrypt.compare(password, user.password)

        if(!isPassEqual){
            return res.status(403).json({message: 'Invalid credentials', success: false})  
        }

        const jwtToken = jwt.sign({username: user.username, _id: user._id }, process.env.JWT_SECRET, {expiresIn: '24h'})
        
        res.status(200).json({
            message: 'Login Success',
            success: 'true',
            jwtToken,
            name: user.name,
            username: user.name
        })


    }catch(err){
        res.status(400).json({
            message: 'Unauthorised Access',
            success: 'false'
        })
    }
}

module.exports = {
    signUpController, loginController
}