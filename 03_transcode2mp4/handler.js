"use strict";

const AWS = require("aws-sdk");

const transcoder = new AWS.ElasticTranscoder({
  apiVersion: "2012-09-25",
  region: process.env.REGION
});

module.exports.index = async (event) => {

  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  const date_obj = new Date();

  const filename = srcKey.split("/").slice(-1)[0];
  const sub = filename.split(".")[0];

  const params = {
    PipelineId: process.env.PIPELINE_ID,
    OutputKeyPrefix: "output/",
    Input: {
      Key: srcKey,
      FrameRate: "auto",
      Resolution: "auto",
      AspectRatio: "auto",
      Interlaced: "auto",
      Container: "auto"
    },
    Outputs: [
      {
        Key: sub + "_" + date_obj.getTime() + ".mp4",
        PresetId: process.env.PRESET_ID
      }
    ]
  };

  try {
    await transcoder.createJob(params).promise();
    console.log("Transcord Success");
  } catch (e) {
    console.log("Transcord Error");
  }

  // TODO エラー処理は考えていない.
  const response = {
    statusCode: 200
  };

  return response;
};
