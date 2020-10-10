import ls from "lightstreamer-client";
import axios from "axios";
import express from "express";
const app = express();
const port = process.env.PORT;
import { PriceStream, sessionID, currentMarketData } from "./PriceStream";

// Data.csv file will now be constantly updated
PriceStream(process.argv[2]);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send(currentMarketData.AuditId);
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

app.post("/test", async (req, res) => {
  try {
    const { data } = await axios({
      method: "GET",
      url: `https://ciapi.cityindex.com/TradingAPI/useraccount/ClientAndTradingAccount`,
      headers: {
        username: process.env.APP_USERNAME,
        session: sessionID,
      },
    });
    // console.log(data.TradingAccounts[0].TradingAccountId);
    const response = await axios({
      method: "POST",
      url: "https://ciapi.cityindex.com/TradingAPI/order/newtradeorder",
      headers: {
        username: process.env.APP_USERNAME,
        session: sessionID,
      },
      data: {
        IfDone: [],
        Direction: "buy",
        ExpiryDateTimeUTCDate: null,
        LastChangedDateTimeUTCDate: null,
        OcoOrder: null,
        Type: null,
        ExpiryDateTimeUTC: null,
        Applicability: null,
        TriggerPrice: null,
        BidPrice: currentMarketData.Bid,
        AuditId: currentMarketData.AuditId,
        AutoRollover: false,
        MarketId: currentMarketData.MarketId,
        OfferPrice: currentMarketData.Offer,
        OrderId: 0,
        Currency: null,
        Quantity: 1,
        QuoteId: null,
        LastChangedDateTimeUTC: null,
        PositionMethodId: 1,
        TradingAccountId: data.TradingAccounts[0].TradingAccountId,
        MarketName: currentMarketData.MarketName,
        Status: null,
        isTrade: true,
      },
    });
    console.log(response.data);
    res.status(200);
    res.json(response.data);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
});
