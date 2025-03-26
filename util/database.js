const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: "postgres",
  // host: "localhost",
  host: process.env.DB_HOST,
  logging: console.log,
});

module.exports = sequelize;
