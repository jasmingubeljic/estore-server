const Product = require("../models/product");

const fs = require("fs");
const path = require("path");
const productService = require("../services/product.service");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports.createProduct = async (req, res, next) => {
  await productService
    .createProduct(req)
    .then((r) => res.status(201).json(r))
    .catch((err) => console.log(err));
};

module.exports.updateProduct = async (req, res, next) => {
  const result = await productService.updateProduct(req);
  if (result) {
    res.status(201).json(result.dataValues);
  } else {
    res.status(500).json({ error: "Server failed!" });
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  const result = productService.deleteProduct(req);
  if (result === 1) {
    console.log("image:    ", product.dataValues.image);
    // delete image on remote storage
    const productFilePath = `products/${product.dataValues.image}`;
    const { error } = await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME).remove([productFilePath]);
    if (!error) {
      res.status(200).json({ message: "Product deleted successfully" });
    }
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
    return res.status(422).json({ messages: { errors: [{ msg: "No image has been provided" }] } });
  }

  const { buffer, mimetype } = req.file;
  const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const image = `${req.file["fieldname"]}-${randomName}`;
  const categoryFilePath = `categories/${req.file["fieldname"]}-${randomName}`;

  // Upload image to Supabase Storage
  const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME).upload(categoryFilePath, buffer, { contentType: mimetype });
  if (error) throw error;

  // const image = req.file.path;

  req.user
    .createCategory({
      title,
      image,
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
