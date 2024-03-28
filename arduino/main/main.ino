#include <SPI.h>
#include <MFRC522.h>

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFiClientSecure.h>

#define NO_TRANSACTION 1
#define TRANSACTION_SUCCESS 2
#define TRANSACTION_FAILED 3

#define LED_BUILTIN 2
#define SS_PIN  5  // ESP32 pin GPIO5 
#define RST_PIN 4 // ESP32 pin GPIO27 

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

const char* ssid = "63prknykn lt.2";
const char* password = "Knykn063";

const char*  server = "tm-api.christojeffrey.com";  // Server URL

const int frequency = 10;
const int duration = 5000; // in milliseconds. for light blinking or solid when transaction success or failed. this will also be the delay for the next transaction. 
int transactionAmount = -20000;

int transactionState = NO_TRANSACTION;

WiFiClientSecure client;
unsigned long lastTransactionTime;

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
MFRC522 rfid(SS_PIN, RST_PIN);


void connectToWifi(){
  Serial.print("Attempting to connect to SSID: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  // attempt to connect to Wifi network:
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    // wait 1 second for re-trying
    delay(1000);
  }

  Serial.print("Connected to ");
  Serial.println(ssid);
}

void sendRequest(String nfcId, int amount){
  // TODO: make this secure!
  client.setInsecure();

  Serial.println("\nStarting connection to server...");
  appendToDisplay("Sending request...\n");
  if (!client.connect(server, 443)){
    Serial.println("Connection failed!");
    appendToDisplay("Connection failed!\n");
  }
  else {
    Serial.println("Connected to server!");
    appendToDisplay("Connected to server!\n");
    // Make a HTTP request:
    client.println("POST https://tm-api.christojeffrey.com/api/deduct HTTP/1.0");
    client.println("Content-Type: application/json");
    client.println("Authorization: secrete");
    String body = String("{\"nfcId\": \"" + nfcId + "\", \"amount\": " + String(amount) + "}");
    client.println("Content-Length: " + String(body.length()));
    client.println();
    client.println(body);
    client.println();
    client.println("Host: tm-api.christojeffrey.com");
    client.println("Connection: close");
    client.println();

    while (client.connected()) {
      String line = client.readStringUntil('\n');
      if (line == "\r") {
        Serial.println("headers received");
        break;
      }
    }

    // if there are incoming bytes available
    // from the server, read them and print them:
    while (client.available()) {
        String respond = client.readStringUntil('\n');
        Serial.println(respond);

        char respondChar[respond.length() + 1];
        respond.toCharArray(respondChar, respond.length() + 1);
        printToDisplay(respondChar);

        // check line 
        if(respond.indexOf("BERHASIL") > 0){
          // transaction success
          transactionState = TRANSACTION_SUCCESS;
          lastTransactionTime = millis();
          return;
        } else if(respond.indexOf("TIDAK") > 0){ 
          // transaction failed or card not registered
          transactionState = TRANSACTION_FAILED;
          lastTransactionTime = millis();
          return;
        }
    }
    Serial.println("\nClosing connection");
    appendToDisplay("Closing connection\n");
    client.stop();
  }
}

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  delay(100);

  connectToWifi();
  setupLed();
  
  // // example
  // sendRequest("1234", 100);

  setupDisplay();
  setupNFCReader();
}

void setupLed(){
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
}

void setupDisplay(){
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
      Serial.println(F("SSD1306 allocation failed"));
      for(;;);
  }
  delay(2000);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  printToDisplay("display ready!\n");
}

void appendToDisplay(char *text){
  display.print(text);
  display.display();
}

void clearDisplay(){
  display.clearDisplay();
  display.setCursor(0, 10);
  display.display();
}

void printToDisplay(char *text){
  display.clearDisplay();
  display.setCursor(0, 10);
  
  // Display static text
  display.print(text);
  display.display();
}

void setupNFCReader(){
  SPI.begin(); // init SPI bus
  rfid.PCD_Init(); // init MFRC522
  Serial.println("NFC Reader Ready");
}

void standByNFCRead(){
  if (rfid.PICC_IsNewCardPresent()) { // new tag is available
    if (rfid.PICC_ReadCardSerial()) { // NUID has been readed
      MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
      

      // print UID in Serial Monitor in the hex format

      char uid[20] = "";
      for (int i = 0; i < rfid.uid.size; i++) {
        if(rfid.uid.uidByte[i] < 0x10){
          sprintf(uid, "%s0%X", uid, rfid.uid.uidByte[i]);
        } else{
          sprintf(uid, "%s%X", uid, rfid.uid.uidByte[i]);
        }
      }
      Serial.println(uid);
      appendToDisplay("TAG UID: ");
      appendToDisplay(uid);
      appendToDisplay("\n");

      sendRequest(uid, transactionAmount);

      rfid.PICC_HaltA(); // halt PICC
      rfid.PCD_StopCrypto1(); // stop encryption on PCD
    }
  }
}

void loop() {
  if(transactionState == TRANSACTION_FAILED){
    // blink LED
    blinkLed();
    checkIfDurationHasPassed();

  }else if(transactionState == TRANSACTION_SUCCESS){
    // keep LED on
    digitalWrite(LED_BUILTIN, HIGH);
    checkIfDurationHasPassed();
  } else{ // no transaction is currently running
    // ready for transaction.
    printToDisplay("Ready for transaction\n");
    standByNFCRead();
  }
}


void checkIfDurationHasPassed(){
  // check if <duration> amount of time has passed
  unsigned long currentTime = millis();

  if(transactionState == TRANSACTION_SUCCESS || transactionState == TRANSACTION_FAILED){
    // Serial.println("Checking if duration has passed...");
    if (currentTime - lastTransactionTime >= duration) {
      // turn of LED
      digitalWrite(LED_BUILTIN, LOW);
      transactionState = NO_TRANSACTION;
      Serial.println("Duration has passed, turning off LED");
    }
  }
}

unsigned long timeLastChangeInLedState = millis(); // in milliseconds
void blinkLed(){
// run LED based on frequency
  unsigned long currentTime = millis();
  float timeBetweenPulses = 1000 / frequency; // in milliseconds
  if (currentTime - timeLastChangeInLedState >= timeBetweenPulses) {
    timeLastChangeInLedState = currentTime;
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));

  }
}