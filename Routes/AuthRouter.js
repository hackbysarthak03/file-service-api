const { loginController, signUpController } = require('../Controllers/AuthController')
const { loginValidation, signUpValidation } = require('../Middlewares/AuthValidation')
const router = require('express').Router()

router.post('/login', loginValidation, loginController)
router.post('/signup', signUpValidation, signUpController)

module.exports = router