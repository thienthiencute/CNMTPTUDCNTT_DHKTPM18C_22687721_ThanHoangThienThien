const Product = require("../models/productModel");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// LIST + SEARCH + PAGINATION
exports.index = async (req, res) => {
  let allProducts = await Product.getAll();

  const keyword = req.query.keyword || '';
  let products = allProducts;
  
  if (keyword) {
    products = allProducts.filter(p =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  const page = parseInt(req.query.page) || 1;
  const limit = 8;
  const totalPages = Math.ceil(products.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = products.slice(startIndex, startIndex + limit);

res.render("products/index", { 
    products: paginatedProducts, 
    currentPage: page, 
    totalPages: totalPages,
    keyword: keyword
  });
};

// FORM CREATE
exports.createForm = (req, res) => {
  res.render("products/create");
};

// CREATE
exports.create = async (req, res) => {
  const { name, price, unit_in_stock } = req.body;

  if (!name || price <= 0 || unit_in_stock < 0) {
    return res.redirect("/create?msg=Invalid data");
  }

  const product = {
    id: uuidv4(),
    name,
    price: Number(price),
    unit_in_stock: Number(unit_in_stock),
    url_image: req.file ? "/images/" + req.file.filename : ""
  };

  await Product.create(product);
  res.redirect("/?msg=Created");
};

// DETAIL
exports.detail = async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.render("products/detail", { product });
};

// FORM EDIT
exports.editForm = async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.render("products/edit", { product });
};

// UPDATE
exports.update = async (req, res) => {
  const { name, price, unit_in_stock } = req.body;

  let product = await Product.getById(req.params.id);

  product.name = name;
  product.price = Number(price);
  product.unit_in_stock = Number(unit_in_stock);

  if (req.file) {
    // xóa ảnh cũ
    if (product.url_image) {
      const oldPath = "public" + product.url_image;
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    product.url_image = "/images/" + req.file.filename;
  }

  await Product.update(product);
  res.redirect("/?msg=Updated");
};

// DELETE
exports.delete = async (req, res) => {
  const product = await Product.getById(req.params.id);

  if (product.url_image) {
    const path = "public" + product.url_image;
    if (fs.existsSync(path)) fs.unlinkSync(path);
  }

  await Product.remove(req.params.id);
  res.redirect("/?msg=Deleted");
};