const Product = require('../models/product')
const { validationResult } = require("express-validator")

module.exports.createProduct = async (req, res, next) => {
    const { title, price, description, category } = req.body
    const errors = validationResult(req)

    console.log('request', req)
    if (!errors.isEmpty()) {
        return res.status(422).json({"messages": errors})
    }


    if (!req.file) {
        return res.status(422).json({"messages": ['No image provided']})
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
    if (req.body.id) {
        Product.update({
            ...req.body
        },{
            where: {
                id: req.body.id
            }
        })
        res.status(200).json({id})
    }

}

module.exports.deleteProduct = async (req, res, next) => {
    // Product deletion
    console.log('prior to product deletion')
    const result = await Product.destroy({ where: {id: req.body.id}})
    console.log('after the product deletion', result)
}