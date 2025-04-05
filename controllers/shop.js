const productService = require("../services/product.service");
const categoryService = require("../services/category.service");

module.exports.getProducts = async (req, res, next) => {
  const products = await productService.getProducts(req.params.offset, req.params.limit);
  res.status(200).json({ products });
};

module.exports.getProductById = async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);

  if (product === null) {
    // not found
    res.status(404).json({ message: "Product not found" });
  } else {
    res.status(200).json(product);
  }
};

module.exports.queryProducts = async (req, res, next) => {
  const products = await productService.queryProducts(req.query);
  res.status(200).json({ products });
};

module.exports.getCategories = async (req, res, next) => {
  const categories = await categoryService.getCategories();

  if (categories) {
    res.status(200).json(categories);
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getCategoryById = async (req, res, next) => {
  const category = await categoryService.getCategories(req.params.id);

  if (category === null) {
    // not found
    res.status(404).json({ message: "Category not found" });
  } else {
    res.status(200).json(category);
  }
};
