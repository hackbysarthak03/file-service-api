const Joi = require('joi')

const signUpValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(6).max(20).required(),
        username: Joi.string().min(6).max(10).required(),
        password: Joi.string().min(6).max(15).required()
    })

    const {error} = schema.validate(req.body)

    if(error){
        return res.status(400).json({message: 'Validation Failed'})
    }

    next()
}

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(6).max(10).required(),
        password: Joi.string().min(6).max(15).required()
    })

    const {error} = schema.validate(req.body)

    if(error){
        return res.status(400).json({message: 'Validation Failed'})
    }

    next()
}

module.exports = {
    signUpValidation, loginValidation
}




