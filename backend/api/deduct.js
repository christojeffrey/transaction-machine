const { deductHandler } = require("../deductHandler");

export async function POST(req, res) {
  if (req.headers.authorization !== process.env.AUTHORIZATION) {
    return new Response("Unauthorized", { status: 401 });
  }
  // TODO: get from body
  let ownerNfcId = req.body.nfcId;
  let amount = req.body.amount;
  //   validate
  if (!ownerNfcId || !amount) {
    return new Response("nfcId and amount are required", { status: 400 });
  }

  let respond = await deductHandler(ownerNfcId, amount);
  return new Response(respond);
}
