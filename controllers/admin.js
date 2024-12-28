const Product = require("../models/product");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

module.exports.createProduct = async (req, res, next) => {
  const { title, price, isUsed, description, category, isHidden } = req.body;
  const errors = validationResult(req);

  console.log("request", req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ messages: errors });
  }

  if (!req.file) {
    return res
      .status(422)
      .json({ messages: { errors: [{ msg: "No image has been provided" }] } });
  }
  const imageUrl = req.file.path;

  req.user
    .createProduct({
      title,
      imageUrl,
      price,
      isUsed,
      description,
      isHidden,
      categoryId: category,
    })
    .then((r) => res.status(201).json(r))
    .catch((err) => console.log(err));
};

module.exports.updateProduct = async (req, res, next) => {
  const id = req.params.id;
  const { title, price, isUsed, description, category, isHidden } = req.body;
  let imageUrl = undefined;
  if (req.file) {
    imageUrl = req.file.path;
  }
  // if (!imageUrl) {
  //      return res.status(422).json({ "messages": { "errors": [{ "msg": 'No image has been provided' }] } })
  // }

  const product = await Product.findByPk(id);

  if (product) {
    if (imageUrl) {
      unlinkImage(product.imageUrl); // delete previous product image
      product.imageUrl = imageUrl; // attach the other value
    }
    product.title = title;
    product.price = price;
    product.isUsed = isUsed;
    product.description = description;
    product.isHidden = isHidden;
    product.categoryId = category;
  }

  const result = await product.save();
  if (result) {
    res.status(201).json(result.dataValues);
  } else {
    res.status(500).json({ error: "Server failed!" });
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  const result = await Product.destroy({ where: { id: req.params.id } });
  if (result === 1) {
    unlinkImage(req.body.imageUrl);
    res.status(204).json({ message: "Product has been successfuly deleted" });
  } else {
    res.status(500).json({ message: "Error while deleting a product" });
  }
};

module.exports.createCategory = async (req, res, next) => {
  const { title, description, isHidden } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ messages: errors });
  }

  if (!req.file) {
    return res
      .status(422)
      .json({ messages: { errors: [{ msg: "No image has been provided" }] } });
  }
  const imageUrl = req.file.path;

  req.user
    .createCategory({
      title,
      imageUrl,
      description,
      isHidden,
    })
    .then((r) => res.status(201).json(r))
    .catch((err) => console.log(err));
};

const unlinkImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
