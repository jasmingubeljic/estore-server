const path = require("path");
const express = require("express");
const cors = require("cors");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const sequelize = require("./util/database");
const bcrypt = require("bcrypt");
const multer = require("multer");

const User = require("./models/user");
const Product = require("./models/product");
const Category = require("./models/category");

const app = express();
const port = process.env.PORT || 3001;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(async (req, res, next) => {
  const user = await User.findByPk(1);
  if (user === null) {
    // User not found

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });
  } else {
    req.user = user;
  }
  next();
});

app.use("/auth", authRoutes);
app.use(shopRoutes);
app.use("/admin", adminRoutes);

User.hasMany(Product);
User.hasMany(Category);
Category.hasMany(Product);

sequelize
  // .sync({ force: true })
  .sync()
  .then(
    app.listen(port, () => {
      console.log("Server is up on port " + port);
    })
  )
  .catch((err) => console.log(err));
