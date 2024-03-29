<script setup lang="ts">
import { Client } from "appwrite";
import { ref } from "vue";

const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("66026e239dcf973dc67e");

const count = ref(0);
const text = ref("");
const nfcId = ref("");

console.log("subscribing to transaction collection");
// Subscribe to transaction collection channel
client.subscribe("databases.6602701d11a3e9a70125.collections.6602717c258ab09ec073.documents", (response: any) => {
  // increment count
  count.value++;
  // if success
  if (response.payload.success) {
    const balance = response.payload.updatedBalance;
    text.value = "TRANSAKSI BERHASIL, SISA SALDO Rp " + balance;
  } else {
    text.value = "SALDO TIDAK MENCUKUPI";
  }
  // set nfcId
  nfcId.value = response.payload.account["nfc-id"];
});
// count
</script>

<template>
  <main>
    <h1>Transaction Machine Merchant</h1>
    <p>Count: {{ count }}</p>
    <p>{{ text }}</p>
    <p>{{ nfcId }}</p>
  </main>
</template>

<style>
p {
  font-size: 1.5em;
}
</style>
