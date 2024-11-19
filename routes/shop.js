const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shop')

router.get('/product', shopController.getProducts)
router.get('/product/:id', shopController.getProductById)

module.exports = router