"use strict";

const twitter = require("twitter");

const client = new twitter({
  consumerKey: process.env.CONSUMERKEY,
  consumerSecret: process.env.CONSUMERSECRET,
  accessToken: process.env.ACCESSTOKEN,
  accessTokenSecret: process.env.ACCESSTOKENSECRET
});

module.exports.index = async event => {

  const tweets = await client
    .get("search/tweets", { q: "#" + event.pathParameters.proxy })
    .catch(err => console.log(err));

  return {
    statusCode: 200,
    body: tweets
  };
};
