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

module.exports.goodbye = async (event) => {
  console.log('estamos entrando a la lambda goodbye de curso_1');
  // Acceder al query string 'name' desde el evento
  const name =event.pathParameters ? event.pathParameters.name : null;

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Goodbye, ${name || 'stranger'}! Your function executed successfully!`,
        input: event,
      },
      null,
      2
    ),
  };
};

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
