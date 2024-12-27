const Sequelize = require("sequelize");

const sequelize = new Sequelize("edo-shop", "postgres", "", {
  dialect: "postgres",
  host: "localhost",
});

module.exports = sequelize;
