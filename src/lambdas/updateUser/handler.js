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

module.exports.updateUser = async (event) => {
  const userId = event.pathParameters ? event.pathParameters.userId : null;
  const id = uuidv4();

  // Si userId no está presente, retornar un error
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'El parámetro userId es requerido' }),
    };
  }

  const body = JSON.parse(event.body);

  console.log('body del patch', body);
  // Define los parámetros para la operación de actualización
  const params = {
    TableName: 'usersTable',
    Key: { pk: `${userId}` },
    UpdateExpression: 'SET #name = :name',
    ExpressionAttributeNames: {'#name': 'name'},
    ExpressionAttributeValues: {
      ':name': `${body.name}`
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const response = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ newValues: response }),
    };
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
