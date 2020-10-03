const ls = require("lightstreamer-client");
const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

const LIGHTSTREAMER_SERVER_HOST = "https://push.cityindex.com";
const items = ["PRICE.401155667"];
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

const main = async () => {
  // store data to get data.Session
  const { data } = await axios({
    method: "POST",
    url: `https://ciapi.cityindex.com/TradingApi/session`,
    data: {
      userName: process.env.APP_USERNAME,
      password: process.env.APP_PASSWORD,
      AppVersion: "1",
      AppComments: "",
      AppKey: process.env.APP_KEY,
    },
  }).catch((err) => {
    console.log(`There was an ERROR -> ${err}`);
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
//   var testSubscription = new ls.Subscription("MERGE", ["HEADLINES.UK"], ["Story", "StoryInHtml"]);
  testSubscription.setDataAdapter("PRICES");

//   testSubscription.setDataAdapter("PRICES");
  testSubscription.setRequestedSnapshot("yes");
  testSubscription.setRequestedMaxFrequency(5)
  testSubscription.setRequestedBufferSize(100)


  myLSClient.subscribe(testSubscription);

  myLSClient.addListener({
    onStatusChange: function (newStatus) {
      console.log(newStatus);

    },
  });

  testSubscription.addListener({
    onSubscription: function () {
      console.log("SUBSCRIBED");
    },
    onUnsubscription: function () {
      console.log("UNSUBSCRIBED");
    },
    onItemUpdate: function (obj) {
      console.log(obj);
//   console.log(testSubscription.isActive());
    
    },
  });

};

main();
