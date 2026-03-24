const { S3Client } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
require('dotenv').config();

// Khởi tạo DynamoDB
const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dbClient); 

// Khởi tạo S3
const s3Client = new S3Client({ region: process.env.AWS_REGION });

module.exports = { s3Client, docClient };