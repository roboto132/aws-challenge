'use strict';

module.exports.thumbGenerator = async (event) => {
  console.log('the event was triggered');
  const srcBucket = event.Records[0].s3.bucket.name;
  console.log('src bucket', srcBucket);
  console.log(event.Records[0].s3.object)

  return {
    statusCode: 200,
    body: JSON.stringify({message: 'testing upload s3 trigger'},
      null,
      2
    ),
  };
};
