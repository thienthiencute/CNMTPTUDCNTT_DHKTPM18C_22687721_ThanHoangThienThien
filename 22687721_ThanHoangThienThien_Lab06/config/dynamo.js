const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const dynamoDB = new AWS.DynamoDB({
  endpoint: process.env.DYNAMODB_ENDPOINT,
});

const docClient = new AWS.DynamoDB.DocumentClient({
  service: dynamoDB,
});

module.exports = docClient;