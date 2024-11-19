const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { body } = require('express-validator')

const validate = [
    body('email').isEmail().withMessage('Please enter valid email address'),
    body('password').notEmpty().withMessage('Please enter your password')
]

router.post('/login', validate, authController.login)

module.exports = router