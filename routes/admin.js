const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
const { body } = require('express-validator')

const validate = [
    body('title').trim().notEmpty().withMessage('Please enter the title of the product'),
    body('description').trim().notEmpty().withMessage('Please enter product description'),
    body('price').trim().notEmpty().withMessage('Please enter the price'),
    body('price').trim().isNumeric().withMessage('The price has to be a number'),
    body('category').trim().notEmpty().withMessage('Plese choose category to which this product belongs')
]

router.post('/product', validate, adminController.createProduct)
router.put('/product/:id', adminController.updateProduct)
router.delete('/product/:id', adminController.deleteProduct)

module.exports = router