import ls from "lightstreamer-client";
import axios from "axios";
import express from "express";
const app = express();
const port = process.env.PORT;
import { PriceStream, currentMarketData } from "./PriceStream";

// Data.csv file will now be constantly updated
PriceStream(process.argv[2]);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send(currentMarketData.Name);
});

app.get("/markets/getmarketinfo", async (req, res) => {
  try {
    if (
      req.headers.username !== process.env.APP_USERNAME ||
      req.headers.password !== process.env.APP_PASSWORD
    ) {
      throw "wrong username or password!";
    }
    const response = {
      date: currentMarketData.Date,
      market: currentMarketData.MarketName,
      bid: currentMarketData.Bid,
      offer: currentMarketData.Offer,
      price: currentMarketData.Pricue,
      high: currentMarketData.High,
      low: currentMarketData.Low,
      change: currentMarketData.Change,
    };
    res.status(200);
    res.json(response);
    console.log("API returned.");
  } catch (error) {
    console.log("res.json(error)");
    res.status(400);
    res.json(error);
  }
});
