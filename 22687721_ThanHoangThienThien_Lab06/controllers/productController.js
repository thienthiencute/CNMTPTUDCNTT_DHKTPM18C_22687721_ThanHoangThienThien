const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
async function deleteOldImage(imageUrl) {
  if (!imageUrl.includes("amazonaws.com")) return;

  const key = imageUrl.split(".com/")[1];

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);
}
//dữ liệu giả
let products = [
  {
    ID: "1",
    name: "Laptop Dell XPS 13",
    price: 15000000,
    quantity: 5,
    image: "/images/lap3.png",
  },
  {
    ID: "2",
    name: "Iphone 15",
    price: 25000000,
    quantity: 3,
    image: "/images/iphone15.png",
  },
  {
    ID: "3",
    name: "Samsung Galaxy S23",
    price: 22000000,
    quantity: 4,
    image: "/images/ss23.png",
  },
  {
    ID: "4",
    name: "MacBook Air M2",
    price: 32000000,
    quantity: 2,
    image: "/images/mb2.png",
  },
  {
    ID: "5",
    name: "iPad Pro 11",
    price: 21000000,
    quantity: 6,
    image: "/images/ipad11.png",
  },
  {
    ID: "6",
    name: "Sony WH-1000XM5",
    price: 9000000,
    quantity: 8,
    image: "/images/sn2.png",
  },
  {
    ID: "7",
    name: "Apple Watch Series 9",
    price: 12000000,
    quantity: 7,
    image: "/images/iphone12.png",
  },
  {
    ID: "8",
    name: "Logitech MX Master 3",
    price: 2500000,
    quantity: 10,
    image: "/images/lap3.png",
  },
  {
    ID: "9",
    name: "Dell Ultrasharp Monitor",
    price: 8000000,
    quantity: 3,
    image: "/images/iphone12.png",
  },
  {
    ID: "10",
    name: "Mechanical Keyboard Keychron K8",
    price: 3500000,
    quantity: 9,
    image: "/images/iphone12.png",
  },
];

// hiển thị danh sách
exports.list = (req, res) => {
  const page = parseInt(req.query.page) || 1; // trang hiện tại
  const limit = 4; // mỗi trang 4 sản phẩm

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = products.slice(startIndex, endIndex);

  const totalPages = Math.ceil(products.length / limit);

  res.render("index", {
    products: paginatedProducts,
    currentPage: page,
    totalPages: totalPages,
  });
};

// thêm sản phẩm
exports.addProduct = async (req, res) => {
  const { ID, name, price, quantity } = req.body;

  let imageUrl = "/images/default.png";

  if (req.file) {
    const fileName = Date.now() + "-" + req.file.originalname;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/images/${fileName}`;
  }

  const newProduct = {
    ID,
    name,
    price: parseFloat(price),
    quantity: parseInt(quantity),
    image: imageUrl,
  };

  products.push(newProduct);

  res.redirect("/");
};

// tìm kiếm
exports.searchProduct = (req, res) => {
  const keyword = req.query.keyword.toLowerCase();

  const page = parseInt(req.query.page) || 1;
  const limit = 4;

  // lọc toàn bộ sản phẩm trước
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(keyword),
  );

  // tính pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProducts.length / limit);

  res.render("index", {
    products: paginatedProducts,
    currentPage: page,
    totalPages: totalPages,
    keyword: req.query.keyword,
  });
};

// xóa sản phẩm
exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  products = products.filter((product) => product.ID !== id);

  res.redirect("/");
};
// hiển thị form update
exports.showEditForm = (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.ID === id);

  res.render("edit", { product });
};

// update sản pẩm
exports.updateProduct = async (req, res) => {
  const id = req.params.id;

  const product = products.find((p) => p.ID === id);

  product.name = req.body.name;
  product.price = parseFloat(req.body.price);
  product.quantity = parseInt(req.body.quantity);

  if (req.file) {
    // xóa ảnh cũ trên S3
    await deleteOldImage(product.image);

    const fileName = Date.now() + "-" + req.file.originalname;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    product.image = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/images/${fileName}`;
  }
  console.log(product.image);
  res.redirect("/");
};