import Light from "./lightstreamerConnection";
import axios from "axios";
import express from "express";
import moment from "moment";
const app = express();
const prodURL = "https://ciapi.cityindex.com/TradingApi";
const port = process.env.PORT;
import ls from "lightstreamer-client";

const LIGHTSTREAMER_SERVER_HOST = "https://push.cityindex.com";

const fields = [
  "MarketId",
  "TickDate",
  "Bid",
  "Offer",
  "Price",
  "High",
  "Low",
  "Change",
  "Direction",
  "Delta",
  "ImpliedVolatility",
  "AuditId",
  "StatusSummary",
];

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
    // console.log(marketID);
    const items = marketID.data.Markets.map((obj) => {
      return `PRICE.${obj.MarketId}`;
    });

    // Begin LightstreamerClient()
    var myLSClient = new ls.LightstreamerClient(
      LIGHTSTREAMER_SERVER_HOST,
      "STREAMINGALL"
    );

    myLSClient.connectionDetails.setUser(process.env.APP_USERNAME);
    myLSClient.connectionDetails.setPassword(data.Session);

    myLSClient.connect();

    var testSubscription = new ls.Subscription("MERGE", items, fields);
    //   var testSubscription = new ls.Subscription("MERGE", ["QUOTES"], []);
    testSubscription.setDataAdapter("PRICES");

    //   testSubscription.setDataAdapter("PRICES");
    testSubscription.setRequestedSnapshot("yes");
    testSubscription.setRequestedMaxFrequency(50);
    testSubscription.setRequestedBufferSize(100);

    myLSClient.subscribe(testSubscription);

    myLSClient.addListener({
      onStatusChange: function (newStatus) {
        console.log("Status Alert: ", newStatus);
      },
      onListenStart: function (listenStart) {
        console.log("Listening Started!");
      },
      onServerError: function (serverError) {
        console.log("SERVER ERROR! --> ", serverError);
      },
      onPropertyChange: function (propertyChange) {
        console.log(propertyChange, "changed.");
      },
    });

    let response = [];
    let updateCount = 0;
    const regExp = /\(([^)]+)\)/;

    testSubscription.addListener({
      onSubscription: function () {
        console.log("SUBSCRIBED");
      },
      onUnsubscription: function () {
        console.log("UNSUBSCRIBED");
      },
      onItemUpdate: function (obj) {
        console.log(
          `${moment(parseInt(regExp.exec(obj.getValue("TickDate"))[1])).format("MMMM Do YYYY, h:mm:ss a")} | ${
            marketID.data.Markets[updateCount].Name
          } - Bid: ${obj.getValue("Bid")}, Offer: ${obj.getValue(
            "Offer"
          )}, Price: ${obj.getValue("Price")}, High: ${obj.getValue("High")},
          Low: ${obj.getValue("Low")}\n`
        );
        response.push({
          date: "Date.now()",
          market: marketID.data.Markets[updateCount].Name,
          bid: obj.getValue("Bid"),
          offer: obj.getValue("Offer"),
          price: obj.getValue("Price"),
          high: obj.getValue("High"),
          low: obj.getValue("Low"),
        });
        if (response.length === 21) {
          res.json(response);
        }
        updateCount++;
      },
    });
  } catch (error) {
    console.log(error);
  }
});
