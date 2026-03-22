require("dotenv").config();

const express = require("express");
const path = require("path");

const productRoutes = require("./routes/productRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ THÊM CÁI NÀY (fix query + debug env)
app.use((req, res, next) => {
  res.locals.query = req.query;
  next();
});

// ✅ DEBUG ENV (tạm thời)
console.log("TABLE =", process.env.DYNAMODB_TABLE);

app.use("/", productRoutes);

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});