const Product = require('../models/product')
const { validationResult } = require("express-validator")
const fs = require('fs')
const path = require('path')

module.exports.createProduct = async (req, res, next) => {
    const { title, price, description, category } = req.body
    const errors = validationResult(req)

    console.log('request', req)
    if (!errors.isEmpty()) {
        return res.status(422).json({"messages": errors})
    }

    if (!req.file) {
        return res.status(422).json({ "messages": { "errors": [{ "msg": 'No image has been provided' }] } })
    }
    const imageUrl = req.file.path
        
    Product
        .create({
            title,
            imageUrl,
            price,
            description,
            category
        })
        .then(r => res.status(201).json(r))
        .catch(err => console.log(err))

}

module.exports.updateProduct = async (req, res, next) => {
    const id = req.params.id
    const { title, price, description, category } = req.body
    let imageUrl = req.body.image
    if (req.file) {
        imageUrl = req.file.path
    }
    if (!imageUrl) {
         return res.status(422).json({ "messages": { "errors": [{ "msg": 'No image has been provided' }] } })
    }

    const product = await Product.findByPk(id)

    if (product) {
        unlinkImage(product.imageUrl)
        product.title = title,
        product.price = price,
        product.description = description,
        product.category = category,
        product.imageUrl = imageUrl
    }

    const result = await product.save()
    if (result) {
        res.status(201).json(result.dataValues)
    } else {
        res.status(500).json({"error": "Server failed!"})
    }
    

}

module.exports.deleteProduct = async (req, res, next) => {
    // Product deletion
    console.log('prior to product deletion')
    const result = await Product.destroy({ where: {id: req.body.id}})
    console.log('after the product deletion', result)
}


const unlinkImage = filePath => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, err => console.log(err))
}