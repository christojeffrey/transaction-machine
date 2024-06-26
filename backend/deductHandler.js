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
  let owner;
  try {
    // get the owner
    const accounts = await databases.listDocuments(process.env.DATABASE_ID, process.env.ACCOUNT_COLLECTION_ID);

    owner = accounts.documents.find((account) => account["nfc-id"] === ownerNfcId);

    if (!owner) {
      return `TAG ${ownerNfcId} TIDAK DITEMUKAN. DAFTARKAN DAHULU KARTU ANDA`;
    }

    // check remaining balance
    if (owner.balance + amount < 0) {
      // log transaction
      await databases.createDocument(process.env.DATABASE_ID, process.env.TRANSACTION_COLLECTION_ID, sdk.ID.unique(), {
        amount: amount,
        account: owner.$id,
        updatedBalance: owner.balance,
        success: false,
      });
      return "SALDO TIDAK MENCUKUPI";
    }

    await Promise.all(
      // this is a way to run async functions in parallel
      [1, 2].map(async (number) => {
        if (number === 1) {
          // update balance
          await databases.updateDocument(process.env.DATABASE_ID, process.env.ACCOUNT_COLLECTION_ID, owner.$id, {
            balance: owner.balance + amount,
          });
        } else {
          // log transaction
          await databases.createDocument(process.env.DATABASE_ID, process.env.TRANSACTION_COLLECTION_ID, sdk.ID.unique(), {
            amount: amount,
            account: owner.$id,
            updatedBalance: owner.balance + amount,
            success: true,
          });
        }
      })
    );

    // deduct the amount from the owner

    // record transaction
  } catch (e) {
    respond = "error! " + e.message;
  }
  return `TRANSAKSI BERHASIL, SISA SALDO Rp. ${owner.balance + amount}`;
}

exports.deductHandler = deductHandler;
