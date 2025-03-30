const pg = require("pg");
const Sequelize = require("sequelize");

const options = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  dialectModule: pg,
  logging: console.log,
};

if (process.env.NODE_ENV === "PROD") {
  options["dialectOptions"] = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, options);

module.exports = sequelize;
