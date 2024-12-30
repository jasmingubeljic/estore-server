const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");

router.get("/product", shopController.getProducts);
router.get("/product/query", shopController.queryProducts);
router.get("/product/:id", shopController.getProductById);
router.get("/category", shopController.getCategories);
router.get("/category/:id", shopController.getCategoryById);

module.exports = router;
