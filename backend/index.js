const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config({ path: "./.env" });

const { deductHandler } = require("./deductHandler");
// print testing from .env
console.log(process.env.TESTING);
app.get("/", async (req, res) => {
  // TODO: get from body
  let ownerNfcId = "1234";
  let amount = -20000;

  let respond = await deductHandler(ownerNfcId, amount);
  res.send(respond);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
