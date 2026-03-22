const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-southeast-1",
  accessKeyId: "local",
  secretAccessKey: "local",
});

const dynamoDB = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
});

dynamoDB.listTables({}, (err, data) => {
  if (err) console.error(err);
  else console.log("Tables:", data.TableNames);
});