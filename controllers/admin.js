const Product = require('../models/product')

module.exports.createProduct = async (req, res, next) => {
    const { title, price, description, category} = req.body
    Product
        .create({...req.body})
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