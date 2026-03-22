const AWS = require('aws-sdk')
require('dotenv').config()

AWS.config.update({
    accessKeyId: 'process.env.AWS_ACCESS_KEY',
    secretAccessKey: 'process.env.AWS_SECRET_KEY',
    region: 'ap-southeast-1',
    endpoint: 'http://localhost:3030'
})

const dynamodb = new AWS.DynamoDB.DocumentClient()

const s3 = new AWS.S3() 

module.exports = {dynamodb, s3}