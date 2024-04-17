'use strict';
const aws = require('aws-sdk');

let dynamodbConfig = {};

if(process.env.IS_OFFLINE) {
  dynamodb = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
    secretAccessKey: 'DEFAULT_SECRET' 
  }
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamodbConfig);

module.exports.getUser = async (event) => {
  console.log('params', params);
  const userId = event.pathParameters ? event.pathParameters.userId : null;
  var params = {
    TableName: 'usersTable',
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': `${userId}`,
    }
  };
  const result = await dynamodb.query(params).promise();

  console.log('result', result);


  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        user: result
      },
      null,
      2
    ),
  };
};
