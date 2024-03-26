const { deductHandler } = require("../deductHandler");

export async function POST(req, res) {
  if (req.headers.get("authorization") !== process.env.AUTHORIZATION) {
    return new Response("Unauthorized", { status: 401 });
  }
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response("error! Invalid JSON", { status: 400 });
  }
  let ownerNfcId = body.nfcId;
  let amount = body.amount;
  //   validate
  if (!ownerNfcId || !amount) {
    return new Response("nfcId and amount are required", { status: 400 });
  }

  let respond = await deductHandler(ownerNfcId, amount);
  return new Response(JSON.stringify(respond));
}
