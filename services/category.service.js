const Category = require("../models/category");

const getCategories = async () => {
  return await Category.findAll();
};

const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

module.exports = {
  getCategories,
  getCategoryById,
};
