const Product = require("../models/product");

module.exports.getProducts = async (req, res, next) => {
  const queryOptions = { order: [["updatedAt", "DESC"]] };
  if (/^\d+$/.test(req.query.offset)) {
    queryOptions["offset"] = req.query.offset;
  }
  if (/^\d+$/.test(req.query.limit)) {
    queryOptions["limit"] = req.query.limit;
  }
  const products = await Product.findAll(queryOptions);
  const totalProductCount = await Product.count();
  res.status(200).json({ products, totalProductCount });
};

module.exports.getProductById = async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (product === null) {
    // not found
    res.status(404).json({ message: "Product not found" });
  } else {
    res.status(200).json(product);
  }
};
