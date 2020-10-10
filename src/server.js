import ls from "lightstreamer-client";
import axios from "axios";
import express from "express";
const app = express();
const port = process.env.PORT;
import PriceStream from './PriceStream'

PriceStream();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("HII!");
});

app.get("/markets/getmarketinfo", async (req, res) => {
  try {
    if (
      req.headers.username !== process.env.APP_USERNAME ||
      req.headers.password !== process.env.APP_PASSWORD
    ) {
      throw "wrong username or password!";
    }

  } catch (error) {
    console.log("res.json(error)");
    res.status(400);
    res.json(error);
  }
});
