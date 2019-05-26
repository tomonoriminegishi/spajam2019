'use strict';

const IotData = require("aws-sdk").IotData;

module.exports.index = async (event) => {
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  const filename = srcKey.split('/').slice(-1)[0];
  const sub = filename.split('_')[0];

  await publish(sub, srcKey);

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};

async function publish(sub, mp4Uri) {
  const iotData = new IotData({
    apiVersion: "2015-05-28",
    endpoint: process.env.IOT_ENDPOINT
  });

  const params = {
    topic: `${sub}/mp4`,
    payload: JSON.stringify({
      mp4uri: mp4Uri,
      sub: sub
    })
  };
  return iotData.publish(params).promise();
}