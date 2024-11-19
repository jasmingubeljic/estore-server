const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')

router.post('/product', adminController.createProduct)
router.put('/product', adminController.updateProduct)
router.delete('/product', adminController.deleteProduct)

module.exports = router