import ls from "lightstreamer-client";
import axios from "axios";
import moment from "moment";
import { printTable } from "console-table-printer";
const colors = require('colors');

const prodURL = "https://ciapi.cityindex.com/TradingApi";
const LIGHTSTREAMER_SERVER_HOST = "https://push.cityindex.com";

const accountFields = [
  "Cash",
  "OpenTradeEquity",
  "Margin",
  "MarginIndicator",
  "NetEquity",
  "OpenTradeEquity",
  "TradeableFunds",
  "PendingFunds",
  "TradingResource",
  "TotalMarginRequirement",
  "CurrencyId",
  "CurrencyISO"
];

const main = async () => {
  try {
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

    // Begin LightstreamerClient()
    var myLSClient = new ls.LightstreamerClient(
      LIGHTSTREAMER_SERVER_HOST,
      "STREAMINGALL"
    );

    myLSClient.connectionDetails.setUser(process.env.APP_USERNAME);
    myLSClient.connectionDetails.setPassword(data.Session);

    myLSClient.connect();

    var testSubscription = new ls.Subscription("MERGE", "CLIENTACCOUNTMARGIN", accountFields);
    testSubscription.setDataAdapter("CLIENTACCOUNTMARGIN");

    testSubscription.setRequestedSnapshot("yes");
    testSubscription.setRequestedMaxFrequency(50);
    testSubscription.setRequestedBufferSize(100000);

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

    let updateCount = 0;
    const regExp = /\(([^)]+)\)/;
    let tableRows = [];

    testSubscription.addListener({
      onSubscription: function () {
        console.log("SUBSCRIBED");
      },
      onUnsubscription: function () {
        console.log("UNSUBSCRIBED");
      },
      onItemUpdate: function (obj) {
        console.log(
          `${colors.yellow(`${moment().format("MMMM Do YYYY, h:mm:ss a")}`)} | ${colors.yellow("Cash: ")}${colors.green(`$${obj.getValue("Cash")}`)} | ${colors.yellow("OpenTradeEquity: ")}${colors.green(`${obj.getValue("OpenTradeEquity")}`)}
          `
        );
      },
    });
  } catch (error) {
    console.log("error", error);
  }
};

main();

export default main;

