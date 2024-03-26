const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./.env" });
// parse application/json
app.use(bodyParser.json());

const { deductHandler } = require("./deductHandler");
app.get("/api", async (req, res) => {
  res.send("hello world!");
});

app.post("/api/deduct", async (req, res) => {
  //   validate authorization
  if (req.headers.authorization !== process.env.AUTHORIZATION) {
    res.status(401).send("Unauthorized");
    return;
  }
  // TODO: get from body
  let ownerNfcId = req.body.nfcId;
  let amount = req.body.amount;
  //   validate
  if (!ownerNfcId || !amount) {
    res.status(400).send("nfcId and amount are required");
    return;
  }

  let respond = await deductHandler(ownerNfcId, amount);
  res.send(respond);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
