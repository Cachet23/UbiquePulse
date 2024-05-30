#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

#define REPORTING_PERIOD_MS 1000

PulseOximeter pox;
uint32_t tsLastReport = 0;

void onBeatDetected() {
    Serial.println("Beat detected!");
}

void setup() {
    Serial.begin(115200);
    Serial.print("Initializing pulse oximeter... ");

    // Initialize the PulseOximeter instance
    if (!pox.begin()) {
        Serial.println("FAILED");
        for(;;);
    } else {
        Serial.println("SUCCESS");
    }

    // The default current for the IR LED is 50mA and it could be changed
    // by uncommenting the following line. Check MAX30100_PulseOximeter.h for all the available options.
    // pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);

    // Register a callback for the beat detection
    pox.setOnBeatDetectedCallback(onBeatDetected);
}

void loop() {
    // Make sure to call update as fast as possible
    pox.update();

    // Grab the updated heart rate and SpO2
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
        // Create JSON string with sensor data
        String jsonData = "{ \"heartRate\": " + String(pox.getHeartRate()) + ", \"spO2\": " + String(pox.getSpO2()) + " }";
        
        // Send JSON string over serial
        Serial.println(jsonData); // This adds a newline character automatically

        tsLastReport = millis();
    }
}
