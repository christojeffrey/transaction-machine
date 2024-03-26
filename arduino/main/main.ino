#include <WiFi.h>
#include <PubSubClient.h>

// WiFi
const char *ssid = "asf"; // Enter your WiFi name - phone hotspot. esp32 and laptop connected to the same hotspot. using WPA3 - personal
const char *password = "sadf";  // Enter WiFi password

WiFiClient espClient;
PubSubClient client(espClient);

#define LED 2 // build in LED pin

const int frequency = 10;
unsigned long StartTime = millis(); // in milliseconds
float timeBetweenPulses = 1000 / frequency; // in milliseconds

void setup() {
 // Set software serial baud to 115200;
 Serial.begin(115200);
 
 connectWifi();
 setupPin();
}


void loop() {

}

// SETUP HELPER
void connectWifi(){
// connecting to a WiFi network
 WiFi.begin(ssid, password);
 while (WiFi.status() != WL_CONNECTED) {
     Serial.println("Connecting to WiFi..");
     delay(2000);
 }
 Serial.println("Connected to the WiFi network");
}


void setupPin(){
  pinMode(LED, OUTPUT);
    // configure the trigger pin to output mode
}


void runLed(){
// run LED based on frequency
  unsigned long currentTime = millis();
  if (currentTime - StartTime >= timeBetweenPulses) {
    StartTime = currentTime;
    digitalWrite(LED, !digitalRead(LED));

  }
}