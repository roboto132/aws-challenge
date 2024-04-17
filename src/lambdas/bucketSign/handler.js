'use strict';
const aws = require('aws-sdk');

const s3 = new aws.S3({signatureVersion: 'v4'})

module.exports.signUrl = async (event) => {
  const fileName = event.queryStringParameters.fileName;

  const signedUrl = await s3.getSignedUrlPromise("putObject", {
    Key: `upload/${fileName}`,
    Bucket: process.env.BUCKET_NAME,
    Expires: 300
  })

  return {
    statusCode: 200,
    body: JSON.stringify({signedUrl},
      null,
      2
    ),
  };
};
