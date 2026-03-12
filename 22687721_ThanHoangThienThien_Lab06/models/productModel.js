const {dynamodb} = require('../config/aws')
require('dotenv').config()

const tableName = process.env.DYNAMODB_TABLE

exports.getAll = async () => {
    const params = {
        TableName: tableName
    }
    return dynamodb.scan(params).promise()
}

exports.create = async (product) => {
    const params = {
        TableName: tableName,
        Item: product
    };
    return dynamodb.put(params).promise();
};

exports.delete = async (id) => {
    const params = {
        TableName: tableName,
        Key: { ID: id }
    };
    return dynamodb.delete(params).promise();
};

exports.update = async (product) => {
    const params = {
        TableName: tableName,
        Item: product
    };
    return dynamodb.put(params).promise();
};