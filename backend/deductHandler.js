const sdk = require("node-appwrite");

function getDatabases() {
  let client = new sdk.Client();
  client
    .setEndpoint(process.env.PROJECT_API_ENDPOINT) // Your API Endpoint
    .setProject(process.env.PROJECT_ID) // Your project ID
    .setKey(process.env.DATABASE_API_KEY);

  const databases = new sdk.Databases(client);
  return databases;
}
async function deductHandler(ownerNfcId, amount) {
  const databases = getDatabases();
  let respond;
  try {
    // get the owner
    // const accounts = await databases.listDocuments(process.env.DATABASE_ID, process.env.ACCOUNT_COLLECTION_ID);

    // let owner = accounts.documents.find((account) => account["nfc-id"] === ownerNfcId);

    // deduct the amount from the owner
    // await databases.updateDocument(process.env.DATABASE_ID, process.env.ACCOUNT_COLLECTION_ID, owner.$id, {
    //   balance: owner.balance + amount,
    // });

    // record transaction
    respond = await databases.createDocument(process.env.DATABASE_ID, process.env.TRANSACTION_COLLECTION_ID, sdk.ID.unique(), {
      amount: amount,
      //   account: owner.$id,
    });
  } catch (e) {
    respond = "error! " + e.message;
  }
  return respond;
}

exports.deductHandler = deductHandler;
