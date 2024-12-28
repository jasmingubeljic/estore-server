const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const { body } = require("express-validator");
const isAuth = require("../middleware/isAuth");

const validateCreateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Please enter the title of the product"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Please enter product description"),
  body("price").trim().notEmpty().withMessage("Please enter the price"),
  body("price").trim().isNumeric().withMessage("The price has to be a number"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Plese choose category to which this product belongs"),
];

const validateCreateCategory = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Please enter the title of the product"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Please enter product description"),
];

router.post(
  "/product",
  isAuth,
  validateCreateProduct,
  adminController.createProduct
);
router.put("/product/:id", isAuth, adminController.updateProduct);
router.delete("/product/:id", isAuth, adminController.deleteProduct);
router.post(
  "/category",
  isAuth,
  validateCreateCategory,
  adminController.createCategory
);

module.exports = router;
