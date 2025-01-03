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
  const products = await Product.findAndCountAll(queryOptions);
  res.status(200).json({ products });
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

module.exports.queryProducts = async (req, res, next) => {
  const { offset, limit, queryStr, categoryId } = req.query;
  let query = queryStr.trim();
  query = query.replace(/\s\s+/g, " ");
  query = query.replace(/ /g, " | ");

  const queryOptions = { order: [["updatedAt", "DESC"]] };
  if (/^\d+$/.test(offset)) {
    queryOptions["offset"] = offset;
  }
  if (/^\d+$/.test(limit)) {
    queryOptions["limit"] = limit;
  }
  queryOptions["where"] = {
    title: {
      [Op.match]: Sequelize.fn("to_tsquery", query),
    },
  };
  if (/^\d+$/.test(categoryId)) {
    queryOptions["where"]["categoryId"] = { [Op.eq]: categoryId };
  }

  const products = await Product.findAndCountAll(queryOptions);
  res.status(200).json({ products });
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
