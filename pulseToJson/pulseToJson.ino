#include <Wire.h>
#include "MAX30100.h"
#include "MAX30100_PulseOximeter.h"

#define REPORTING_PERIOD_MS 1000

// Define a MAX30100 sensor instance
MAX30100 sensor;
PulseOximeter pox;
uint32_t tsLastReport = 0;

void onBeatDetected() {
    Serial.println("Beat detected!");
}

void setup() {
    Serial.begin(115200);
    Serial.print("Initializing MAX30100... ");

    // Initialize the MAX30100 sensor
    if (!sensor.begin()) {
        Serial.println("FAILED");
        for(;;);
    } else {
        Serial.println("SUCCESS");
    }

    // Set up MAX30100 parameters
    sensor.setMode(MAX30100_MODE_SPO2_HR);
    sensor.setLedsCurrent(MAX30100_LED_CURR_50MA, MAX30100_LED_CURR_27_1MA);
    sensor.setLedsPulseWidth(MAX30100_SPC_PW_1600US_16BITS);
    sensor.setSamplingRate(MAX30100_SAMPRATE_100HZ);
    sensor.setHighresModeEnabled(true);

    // Initialize the PulseOximeter instance
    Serial.print("Initializing pulse oximeter... ");
    if (!pox.begin()) {
        Serial.println("FAILED");
        for(;;);
    } else {
        Serial.println("SUCCESS");
    }

    // Register a callback for beat detection
    pox.setOnBeatDetectedCallback(onBeatDetected);
}

void loop() {
    uint16_t ir, red;

    // Update the sensor
    sensor.update();
    pox.update();

    // Check if it's time to report
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
        // Get raw values
        if (sensor.getRawValues(&ir, &red)) {
            // Create JSON string with sensor data
            String jsonData = "{ \"heartRate\": " + String(pox.getHeartRate()) + 
                              ", \"spO2\": " + String(pox.getSpO2()) + 
                              ", \"red\": " + String(red) + " }";
            
            // Send JSON string over serial
            Serial.println(jsonData); // This adds a newline character automatically
        }

        tsLastReport = millis();
    }
}
