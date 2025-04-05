const Product = require("../models/product");
const { Sequelize, Op } = require("sequelize");
const { validationResult } = require("express-validator");

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const getProducts = async (offset, limit) => {
  const queryOptions = { order: [["updatedAt", "DESC"]] };
  if (/^\d+$/.test(offset)) {
    queryOptions["offset"] = offset;
  }
  if (/^\d+$/.test(limit)) {
    queryOptions["limit"] = limit;
  }
  return await Product.findAndCountAll(queryOptions);
};

const getProductById = async (id) => {
  return await Product.findByPk(id);
};

const queryProducts = async (queryArg) => {
  const { offset, limit, queryStr, categoryId } = queryArg;
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

  return await Product.findAndCountAll(queryOptions);
};

const createProduct = async (req) => {
  const { title, price, isUsed, description, isHidden, categoryId } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ messages: errors });
  }

  if (!req.file) {
    return res.status(422).json({ messages: { errors: [{ msg: "No image has been provided" }] } });
  }

  const { buffer, mimetype } = req.file;
  const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const image = `${req.file["fieldname"]}-${randomName}`;
  const productFilePath = `products/${req.file["fieldname"]}-${randomName}`;

  // Upload image to Supabase Storage
  const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME).upload(productFilePath, buffer, { contentType: mimetype });
  if (error) throw error;

  return await req.user.createProduct({
    title,
    image,
    price,
    isUsed,
    description,
    isHidden,
    categoryId,
  });
};

const updateProduct = async (req) => {
  const { title, price, isUsed, description, categoryId, isHidden } = req.body;

  const product = await Product.findByPk(req.params.id);
  let image = product.image;

  if (product) {
    if (req.file) {
      // upload new image
      const { buffer, mimetype } = req.file;
      const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      image = `${req.file["fieldname"]}-${randomName}`;
      const productFilePath = `products/${image}`;
      const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME).upload(productFilePath, buffer, { contentType: mimetype });
      if (error) throw error;

      // delete image on remote storage
      const oldProductFilePath = `products/${product.image}`;
      await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME).remove([oldProductFilePath]);
    }

    product.title = title;
    product.price = price;
    product.image = image;
    product.isUsed = isUsed;
    product.description = description;
    product.isHidden = isHidden;
    product.categoryId = categoryId;
    return await product.save();
  }
};

const deleteProduct = async (req) => {
  const product = await Product.findByPk(req.params.id);

  // delete product from db
  return await Product.destroy({ where: { id: req.params.id } });
};

module.exports = {
  getProducts,
  getProductById,
  queryProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
