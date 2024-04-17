'use strict';
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

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

module.exports.postUser = async (event) => {
  const requestBody = JSON.parse(event.body);
  console.log('body request', requestBody);
  const id = uuidv4();
  // Acceder al query string 'name' desde el evento
  let params = {
    TableName: 'usersTable',
    Item: {
      pk: `${id}`
    }
  };

  await dynamodb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({'user': params.Item},
      null,
      2
    ),
  };
};
