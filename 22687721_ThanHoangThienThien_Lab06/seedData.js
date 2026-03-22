const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  region: "ap-southeast-1",
  accessKeyId: "local",
  secretAccessKey: "local",
});

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
});

const TABLE = "Products";

const products = [
  {
    id: uuidv4(),
    name: "iPhone 11",
    price: 12000000,
    unit_in_stock: 10,
    url_image: "/images/iphone11.png"
  },
  {
    id: uuidv4(),
    name: "iPhone 12",
    price: 15000000,
    unit_in_stock: 8,
    url_image: "/images/iphone12.png"
  },
  {
    id: uuidv4(),
    name: "iPhone 14",
    price: 22000000,
    unit_in_stock: 6,
    url_image: "/images/iphone14.png"
  },
  {
    id: uuidv4(),
    name: "Laptop Dell",
    price: 25000000,
    unit_in_stock: 5,
    url_image: "/images/laptop.png"
  },
  {
    id: uuidv4(),
    name: "Tablet Samsung",
    price: 8000000,
    unit_in_stock: 12,
    url_image: "/images/tablet1.png"
  },
  {
    id: uuidv4(),
    name: "Default Product",
    price: 5000000,
    unit_in_stock: 20,
    url_image: "/images/default.png"
  }
];

async function seed() {
  for (let p of products) {
    await docClient.put({
      TableName: TABLE,
      Item: p
    }).promise();
  }

  console.log("✅ Seed data thành công!");
}

seed();