const Product = require('../models/product')

module.exports.getProducts = async (req, res, next) => {
    const products = await Product.findAll()
    res.status(200).json(products)
}

module.exports.getProductById = async (req, res, next) => {
    const product = await Product.findByPk(req.params.id)

    if (product === null) {
        // not found
        res.status(404).json({message: "Product not found"})
    } else {
        res.status(200).json(product)
    }

    
}