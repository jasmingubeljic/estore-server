const Product = require("../models/product");
const { Sequelize, Op } = require("sequelize");

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

module.exports = {
  getProducts,
  getProductById,
  queryProducts,
};
