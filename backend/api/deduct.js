const { deductHandler } = require("../deductHandler");

export async function POST(req, res) {
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
}
