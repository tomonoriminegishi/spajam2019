'use strict';

const aws = require('aws-sdk');
aws.config.region = process.env.REGION;
const s3 = new aws.S3();
const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const sharp = require('sharp');

module.exports.index = async (event) => {

  try {
    const imageList = await s3.getObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: event.Records[0].s3.object.key,
    }).promise();
    const imageListJson = JSON.parse(imageList.Body.toString());

    const encoder = new GIFEncoder(560, 420);
    encoder.start();
    encoder.setRepeat(-1);  // 0 for repeat, -1 for no-repeat
    encoder.setDelay(1000); // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.

    for (let element in imageListJson.imageName) {

      const gifFile = await s3.getObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imageListJson.imageName[element],
      }).promise();

      const meta = await sharp(gifFile.Body).metadata();
      const canvas = createCanvas(meta.width, meta.height);
      const ctx = canvas.getContext('2d');

      // sharpがgifに対応していないためとりあえずpng変換し、tmpに出力
      const pngbuf = await sharp(gifFile.Body).png().toBuffer();
      fs.writeFileSync('/tmp/' + element　, pngbuf);

      // tmpに出力したファイルを読み込んでるけど、こんなことしなくても良いような・・・。
      const ccc = await loadImage('/tmp/' + element);
      ctx.drawImage(ccc, 0, 0);
      encoder.addFrame(ctx);
    }

    encoder.finish();

    const srcKey = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );

    let filename = srcKey.split('/').slice(-1)[0];
    filename = filename.split('.')[0];
    filename = filename.split('_').slice(-1)[0]

    const config = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: "gif/" + filename + ".gif",
      ContentType: "image/gif",
      Body: encoder.out.getData()
    };

    await s3.putObject(config).promise();

  } catch (err) {
    console.error(`[Error]: ${JSON.stringify(err)}`);
    return err;
  }
};
