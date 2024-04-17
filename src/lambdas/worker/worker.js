'use strict';

module.exports.handler = async (event) => {
  console.log('hola mundo');

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'OK' }),
  };
};
