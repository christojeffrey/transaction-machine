"use client";

import {
  Account,
  Appwrite,
  dataProvider as appwriteDataProvider,
  liveProvider as appwriteLiveProvider,
  Storage,
} from "@refinedev/appwrite";
import {
  APPWRITE_PROJECT,
  APPWRITE_TOKEN_KEY,
  APPWRITE_URL,
} from "@utility/constants";
import Cookies from "js-cookie";

const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);

// for client side authentication
const appwriteJWT = Cookies.get(APPWRITE_TOKEN_KEY);
if (appwriteJWT) {
  appwriteClient.setJWT(appwriteJWT);
}

const account = new Account(appwriteClient);
const storage = new Storage(appwriteClient);

export { account, appwriteClient, storage };

export const dataProvider = appwriteDataProvider(appwriteClient, {
  databaseId: "6602701d11a3e9a70125",
});

export const liveProvider = appwriteLiveProvider(appwriteClient, {
  databaseId: "6602701d11a3e9a70125",
});
