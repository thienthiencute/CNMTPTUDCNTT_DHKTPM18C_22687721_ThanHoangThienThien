const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-southeast-1",
  accessKeyId: "local",
  secretAccessKey: "local",
});

const dynamoDB = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
});

const params = {
  TableName: "Products",
  KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  BillingMode: "PAY_PER_REQUEST",
};

dynamoDB.createTable(params, (err, data) => {
  if (err) console.error("❌ Error:", err);
  else console.log("✅ Table created!");
});