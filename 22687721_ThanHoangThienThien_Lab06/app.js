require("dotenv").config();

const express = require("express");
const path = require("path");
const productRoutes = require("./routes/productRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", productRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});