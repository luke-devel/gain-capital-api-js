import Light from "./lightstreamerConnection";
const axios = require("axios");
const express = require("express");
const app = express();
const prodURL = "https://ciapi.cityindex.com/TradingApi";
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

app.get("/", (req, res) => {
  res.send("HII!");
});

app.get("/markets/getmarketinfo", async (req, res) => {
  try {
    const marketReqQuery = req.headers.market.toUpperCase();

    const { data } = await axios({
      method: "POST",
      url: `${prodURL}/session`,
      data: {
        userName: process.env.APP_USERNAME,
        password: process.env.APP_PASSWORD,
        AppVersion: "1",
        AppComments: "",
        AppKey: process.env.APP_KEY,
      },
    });

    const marketID = await axios({
      method: "GET",
      url: `${prodURL}/market/searchwithtags?SearchByMarketName=TRUE`,
      headers: {
        username: process.env.APP_USERNAME,
        session: data.Session,
      },
      params: {
        Query: marketReqQuery,
      },
    });
console.log(marketID.data.Markets.length);
res.json('hi')
    // Light(MARKET_ID);
  } catch (error) {
    console.log(error);
  }
});
