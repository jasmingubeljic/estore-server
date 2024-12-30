const { Sequelize, Op } = require("sequelize");
const Product = require("../models/product");
const Category = require("../models/category");

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

module.exports.getCategories = async (req, res, next) => {
  const categories = await Category.findAll();

  if (categories) {
    res.status(200).json(categories);
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getCategoryById = async (req, res, next) => {
  const category = await Category.findByPk(req.params.id);

  if (category === null) {
    // not found
    res.status(404).json({ message: "Category not found" });
  } else {
    res.status(200).json(category);
  }
};

module.exports.queryProducts = async (req, res, next) => {
  const clientQueryStr = req.body.queryString.trim();
  const query = clientQueryStr.replace(/ /g, " | ");

  const queryOptions = { order: [["updatedAt", "DESC"]] };
  if (/^\d+$/.test(req.query.offset)) {
    queryOptions["offset"] = req.query.offset;
  }
  if (/^\d+$/.test(req.query.limit)) {
    queryOptions["limit"] = req.query.limit;
  }

  queryOptions["where"] = {
    title: {
      [Op.match]: Sequelize.fn("to_tsquery", query),
    },
  };

  const products = await Product.findAndCountAll(queryOptions);
  res.status(200).json({ products });
};
