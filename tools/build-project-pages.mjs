import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(projectRoot, "dist/projects");

const projects = [
  {
    slug: "led-rgb-control",
    short: "LED",
    level: "Beginner",
    title: "LED & RGB Control",
    intro: "Control the ESP32-S3’s built-in addressable RGB LED while learning how software values become colour and light.",
    image: "https://github.com/user-attachments/assets/ec73d7da-acef-4d03-a89f-68f72a6ce86f",
    imageAlt: "ESP32-S3 development board used for the built-in RGB LED exercise",
    source: "https://github.com/ooikk/Arduino-Documentation/tree/main/01_LED",
    duration: "60–90 minutes",
    difficulty: "First project",
    parts: ["ESP32-S3 development board with built-in WS2812B LED", "Data-capable USB cable", "Arduino IDE with ESP32 board support", "Adafruit NeoPixel or compatible library"],
    fundamentals: [
      ["Digital information, analogue-looking output", "The LED receives a precisely timed digital data stream. Each pixel stores separate red, green, and blue intensity values, which our eyes blend into one colour."],
      ["GPIO assignment", "Many ESP32-S3 DevKitC boards connect the built-in RGB LED to GPIO 48, but clones may use another pin. Confirm the board schematic before assuming the pin."],
      ["Current and brightness", "Full white drives all three colour channels and uses more current than a dim single colour. Start at modest brightness to reduce heat and glare."]
    ],
    connections: [
      ["GPIO 48", "DIN", "Internal data"],
      ["3.3 V rail", "VDD", "Internal power"],
      ["Ground", "GND", "Internal return"]
    ],
    wiringNote: "No external wiring is required when your board includes the addressable RGB LED. If it does not, add a separate WS2812B module with a common ground and follow that module’s power requirements.",
    code: `#include <Adafruit_NeoPixel.h>

constexpr uint8_t LED_PIN = 48;
Adafruit_NeoPixel pixel(1, LED_PIN, NEO_GRB + NEO_KHZ800);

void showColour(uint8_t r, uint8_t g, uint8_t b) {
  pixel.setPixelColor(0, pixel.Color(r, g, b));
  pixel.show();
}`,
    outcomes: ["Upload a sketch and illuminate the built-in LED", "Create at least three colours by changing RGB values", "Explain why full white uses more current", "Move repeated LED commands into a reusable function"],
    troubleshoot: [
      ["LED remains dark", "Verify the board really has a WS2812B LED and confirm its GPIO. Try GPIO 48 only when it matches your hardware."],
      ["Wrong colour appears", "The module may use GRB rather than RGB byte order. Select the correct order in the pixel constructor."],
      ["Upload succeeds but nothing changes", "Call pixel.begin() in setup() and pixel.show() after changing the buffer."]
    ],
    extensions: ["Fade colours without delay()", "Display a system status using colour conventions", "Add a push button to select a colour", "Measure current at different brightness settings"]
  },
  {
    slug: "digital-input-control",
    short: "I/O",
    level: "Beginner",
    title: "Inputs & Responsive Control",
    intro: "Read a push button reliably and use it to control an output without leaving the input pin electrically undefined.",
    image: "https://github.com/user-attachments/assets/36c7d625-592f-488f-8238-431cbe2307f8",
    imageAlt: "Push-button wiring example for an ESP32 digital input",
    source: "https://github.com/ooikk/Arduino-Documentation/tree/main/02_IO_Pins",
    duration: "90–120 minutes",
    difficulty: "Foundation",
    parts: ["ESP32-S3 development board", "Momentary push button", "Breadboard and two jumper wires", "Built-in RGB LED or one LED with a suitable series resistor"],
    fundamentals: [
      ["Logic levels", "A digital input interprets voltage as LOW or HIGH. ESP32-S3 GPIO uses 3.3 V logic and must not be exposed directly to 5 V."],
      ["Pull-up resistor", "INPUT_PULLUP connects a weak internal resistor to 3.3 V. The unpressed input reads HIGH; pressing the button connects it to ground and produces LOW."],
      ["Contact bounce", "A mechanical contact may switch several times within a few milliseconds. Debouncing prevents one press from being counted repeatedly."]
    ],
    connections: [
      ["GPIO 4", "Button terminal 1", "Input"],
      ["GND", "Button terminal 2", "Return"],
      ["GPIO 48", "Built-in RGB LED", "Output"]
    ],
    wiringNote: "This active-LOW arrangement uses INPUT_PULLUP. Never configure the button pin as OUTPUT: pressing the button could then short a HIGH output directly to ground.",
    code: `constexpr uint8_t BUTTON_PIN = 4;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  bool pressed = digitalRead(BUTTON_PIN) == LOW;
  updateIndicator(pressed);   // learner-written function
}`,
    outcomes: ["Read a stable default HIGH state", "Detect a press as LOW", "Explain why the input does not float", "Add a simple time-based debounce"],
    troubleshoot: [
      ["Input changes randomly", "Enable INPUT_PULLUP and check that the button connects the input to ground when pressed."],
      ["Always reads LOW", "Rotate the four-leg tactile switch by 90° or verify which legs are internally connected."],
      ["One press counts many times", "Add debounce timing and trigger only on a state transition."]
    ],
    extensions: ["Short-press and long-press actions", "Interrupt-driven event capture", "Two-button menu navigation", "Measure switch-bounce duration with serial timestamps"]
  },
  {
    slug: "rfid-access-controller",
    short: "RFID",
    level: "Intermediate",
    title: "RFID Access Controller",
    intro: "Read a MIFARE card with an MFRC522 module, compare its identifier, and provide a clear access decision.",
    image: "https://github.com/user-attachments/assets/faad8f38-8abe-43f3-98f1-e2c2a0261664",
    imageAlt: "MFRC522 RFID reader and card hardware",
    source: "https://github.com/ooikk/Arduino-Documentation/tree/main/03_RFID",
    duration: "2–3 hours",
    difficulty: "SPI peripheral",
    parts: ["ESP32-S3 development board", "MFRC522 RFID reader", "MIFARE-compatible card or tag", "Jumper wires", "Optional LED or buzzer for access feedback", "Optional 10 µF decoupling capacitor"],
    fundamentals: [
      ["Radio-frequency identification", "The reader energises a nearby passive tag and exchanges data at 13.56 MHz. The ESP32 communicates with the reader over SPI."],
      ["SPI chip select", "SCK, MOSI, and MISO carry clock and data. CS/SDA selects the MFRC522 so other SPI devices can share the bus."],
      ["Identity is not strong security", "A card UID can be copied on some tag types. Treat UID comparison as a learning prototype, not a secure door-control design."]
    ],
    connections: [
      ["3V3", "3.3V", "Power"],
      ["GND", "GND", "Common ground"],
      ["GPIO 12", "SCK", "SPI clock"],
      ["GPIO 11", "MOSI", "Controller → reader"],
      ["GPIO 13", "MISO", "Reader → controller"],
      ["GPIO 10", "SDA / SS", "Chip select"],
      ["GPIO 5", "RST", "Reader reset"]
    ],
    wiringNote: "Power the MFRC522 from 3.3 V, not 5 V. A 10 µF capacitor across 3.3 V and GND near the reader can help if scans are intermittent.",
    code: `#include <SPI.h>
#include <MFRC522.h>

constexpr uint8_t SS_PIN = 10;
constexpr uint8_t RST_PIN = 5;
MFRC522 reader(SS_PIN, RST_PIN);

if (reader.PICC_IsNewCardPresent() &&
    reader.PICC_ReadCardSerial()) {
  printUid(reader.uid);       // compare in a separate function
}`,
    outcomes: ["Initialise the SPI bus and MFRC522", "Read and print a card UID", "Separate card reading from access-decision logic", "Produce distinct granted and denied feedback"],
    troubleshoot: [
      ["Version register reads 0x00 or 0xFF", "Check 3.3 V, common ground, SCK/MOSI/MISO, and chip-select wiring."],
      ["Card is detected intermittently", "Shorten jumper wires, add local decoupling, and keep metal objects away from the antenna."],
      ["Wrong card is accepted", "Compare every UID byte and its length; do not compare only a printed partial value."]
    ],
    extensions: ["Store authorised UIDs in NVS", "Add a display and event log", "Use a relay driver for a low-voltage lock demonstrator", "Discuss authentication keys and access bits"]
  },
  {
    slug: "oled-instrument",
    short: "OLED",
    level: "Intermediate",
    title: "Compact OLED Instrument",
    intro: "Present live measurements on a 128 × 64 OLED while learning I²C addressing, display buffers, and readable information design.",
    image: "https://github.com/user-attachments/assets/070bcd75-011a-4365-b36e-caba64e9435b",
    imageAlt: "Small 0.96-inch OLED display module",
    source: "https://github.com/ooikk/Arduino-Documentation/tree/main/04_I2C_0.96_OLED",
    duration: "2–3 hours",
    difficulty: "I²C display",
    parts: ["ESP32-S3 development board", "0.96-inch 128 × 64 SSD1306 I²C OLED", "Four jumper wires", "Optional analogue or digital sensor"],
    fundamentals: [
      ["I²C bus", "SDA carries addressed data and SCL carries the controller’s clock. Multiple devices can share the two signal lines when each has a different address."],
      ["Addressing", "Many SSD1306 modules use address 0x3C; some use 0x3D. An I²C scanner is the fastest way to confirm what is present."],
      ["Frame buffer", "Graphics are composed in memory and sent to the display when display.display() is called. The visible screen may not change until that transfer occurs."]
    ],
    connections: [
      ["3V3", "VCC", "Power"],
      ["GND", "GND", "Common ground"],
      ["GPIO 8", "SDA", "I²C data"],
      ["GPIO 9", "SCL", "I²C clock"]
    ],
    wiringNote: "Use short wires and confirm the module supports 3.3 V. I²C lines require pull-ups; most breakout modules already include them.",
    code: `#include <Wire.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

Wire.begin(8, 9);
display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
display.clearDisplay();
display.setCursor(0, 0);
display.print(sensorValue);
display.display();`,
    outcomes: ["Confirm the OLED address with a bus scan", "Initialise the display on GPIO 8 and GPIO 9", "Show a value, unit, and status label", "Explain why a buffered display needs an explicit refresh"],
    troubleshoot: [
      ["Display remains blank", "Check the I²C address, VCC/GND polarity, and call display.display() after drawing."],
      ["Allocation failed", "Confirm the correct display dimensions and that sufficient RAM remains."],
      ["Text is clipped", "Reset the cursor and clear or overwrite the previous field before printing a new value."]
    ],
    extensions: ["Add icons and a bar graph", "Auto-scale a sensor value", "Share the bus with a second sensor", "Refresh only when the displayed value changes"]
  },
  {
    slug: "lcd-status-panel",
    short: "LCD",
    level: "Intermediate",
    title: "LCD1602 Status Panel",
    intro: "Use an I²C backpack to control a 16 × 2 character display and design useful messages within a very small interface.",
    image: "https://github.com/user-attachments/assets/b0b46067-8f01-401b-a87a-c077a97138b9",
    imageAlt: "LCD1602 character display with an I2C interface backpack",
    source: "https://github.com/ooikk/Arduino-Documentation/tree/main/04_I2C_LCD1602A",
    duration: "2–3 hours",
    difficulty: "I²C interface",
    parts: ["ESP32-S3 development board", "LCD1602 display", "PCF8574-based I²C backpack", "Four jumper wires", "Optional logic-level shifter depending on the backpack"],
    fundamentals: [
      ["Parallel display, serial adapter", "The HD44780 display normally uses several control and data lines. A PCF8574 backpack converts I²C commands into those parallel signals."],
      ["Address variants", "Common backpack addresses are 0x27 and 0x3F, but they are not guaranteed. Scan the bus instead of guessing."],
      ["Voltage compatibility", "Many backpacks are powered from 5 V and pull SDA/SCL up to that supply. ESP32-S3 is a 3.3 V device, so verify pull-up voltage and use level shifting when necessary."]
    ],
    connections: [
      ["Approved supply", "VCC", "Per module"],
      ["GND", "GND", "Common ground"],
      ["GPIO 8", "SDA", "I²C data"],
      ["GPIO 9", "SCL", "I²C clock"]
    ],
    wiringNote: "Do not assume that a 5 V-powered backpack is automatically safe for ESP32-S3 signal pins. Measure or inspect the pull-ups; keep SDA and SCL at 3.3 V logic.",
    code: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

Wire.begin(8, 9);
lcd.init();
lcd.backlight();
lcd.setCursor(0, 0);
lcd.print("System ready");
lcd.setCursor(0, 1);
lcd.print("Value: ");`,
    outcomes: ["Discover the backpack address", "Initialise a 16 × 2 display", "Place content using row and column coordinates", "Design a two-line status message without unreadable scrolling"],
    troubleshoot: [
      ["Backlight on, no characters", "Adjust the contrast trimmer and verify address and library configuration."],
      ["Blocks appear on first line", "The display has power but is not being initialised correctly; check SDA/SCL and address."],
      ["ESP32 becomes unstable", "Check for 5 V pull-ups on SDA/SCL and correct the interface voltage."]
    ],
    extensions: ["Create custom characters", "Build a reaction-time game", "Add a button-driven menu", "Compare fixed-width LCD layout with OLED graphics"]
  },
  {
    slug: "tft-dashboard",
    short: "TFT",
    level: "Intermediate",
    title: "Colour TFT Dashboard",
    intro: "Drive a 1.8-inch ST7735 display over SPI and build a compact dashboard while reasoning about bandwidth, colour, and redraw cost.",
    image: "https://github.com/user-attachments/assets/0273c9c0-9692-4ec4-8902-4d963e92de3c",
    imageAlt: "1.8-inch ST7735 SPI colour TFT display module",
    source: "https://github.com/ooikk/Arduino-Documentation/tree/main/05_1.8_TFT_SPI_Display",
    duration: "3–4 hours",
    difficulty: "SPI graphics",
    parts: ["ESP32-S3 development board", "1.8-inch ST7735 or ST7735S SPI TFT", "Jumper wires", "TFT_eSPI or Adafruit ST7735/GFX libraries", "Suitable external supply if the module load requires it"],
    fundamentals: [
      ["Why SPI", "A 128 × 160 colour frame contains far more data than a monochrome OLED. A faster SPI clock makes screen updates practical."],
      ["Control signals", "MOSI and SCK move display data; CS selects the display; DC distinguishes commands from pixel data; RST provides hardware reset."],
      ["Redraw strategy", "Clearing and repainting the entire display can flicker and waste time. Update only fields that have changed when possible."]
    ],
    connections: [
      ["3V3 / rated supply", "VDD", "Verify module"],
      ["GND", "GND", "Common ground"],
      ["GPIO 12", "SCL / SCK", "SPI clock"],
      ["GPIO 11", "SDA / MOSI", "Pixel data"],
      ["GPIO 10", "RST", "Reset"],
      ["GPIO 14", "DC / RS", "Data or command"],
      ["GPIO 9", "CS", "Chip select"],
      ["3V3 / PWM GPIO", "BLK", "Backlight"]
    ],
    wiringNote: "Module power arrangements vary. Confirm whether VDD accepts 3.3 V or 5 V, while keeping all ESP32-S3 logic signals at 3.3 V.",
    code: `#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>

Adafruit_ST7735 tft(9, 14, 10); // CS, DC, RST

tft.initR(INITR_BLACKTAB);
tft.setRotation(1);
tft.fillScreen(ST77XX_BLACK);
tft.setTextColor(ST77XX_CYAN);
tft.setCursor(8, 12);
tft.print("Sensor dashboard");`,
    outcomes: ["Identify SPI and display-specific control pins", "Run a graphics test and select the correct panel initialiser", "Draw text, shapes, and a changing value", "Reduce flicker by limiting the redraw area"],
    troubleshoot: [
      ["White or black screen", "Check CS/DC/RST definitions, SPI pins, power, and the panel driver or tab initialiser."],
      ["Image shifted or wrong colours", "Try the correct initR option and colour-order setting for your panel variant."],
      ["Display resets the board", "Check supply current and wiring. Do not assume the board regulator can power every backlight safely."]
    ],
    extensions: ["PWM backlight dimming", "Non-blocking gauge animation", "Display data from an I²C sensor", "Compare full-screen and partial redraw times"]
  },
  {
    slug: "touch-screen-controller",
    short: "TOUCH",
    level: "Advanced",
    title: "Touch-Screen Controller",
    intro: "Combine an ILI9488 colour display and XPT2046 touch controller to build an interactive embedded interface.",
    image: "https://github.com/user-attachments/assets/29e8fc7e-41b9-4c76-9e46-2bd30373cb39",
    imageAlt: "3.5-inch ILI9488 touch-screen module",
    source: "https://github.com/ooikk/Arduino-Documentation/tree/main/06_3.5_TFT_Touch_Display",
    duration: "4–6 hours",
    difficulty: "Shared peripherals",
    parts: ["ESP32-S3 development board", "ILI9488 SPI TFT with XPT2046 touch", "Stable external supply suited to the module", "Jumper wires", "TFT_eSPI and XPT2046-compatible libraries"],
    fundamentals: [
      ["Two controllers, one panel", "The LCD controller draws pixels while a separate touch controller measures press coordinates. They require separate chip-select signals."],
      ["Shared SPI bus", "Clock and data lines may be shared when only one device is selected at a time. Every CS line must have a known inactive state during startup."],
      ["Calibration", "Raw touch readings must be mapped to screen coordinates. Rotation changes the mapping, so calibration belongs to the final orientation."]
    ],
    connections: [
      ["Rated supply", "VCC", "Check J1 pad"],
      ["GND", "GND", "Common ground"],
      ["GPIO 12", "SCK + T_CLK", "Shared clock"],
      ["GPIO 11", "MOSI + T_DIN", "Shared output"],
      ["GPIO 13", "T_DO", "Touch input"],
      ["GPIO 9", "TFT_CS", "Display select"],
      ["GPIO 8", "T_CS", "Touch select"],
      ["GPIO 10", "RESET", "Display reset"],
      ["GPIO 14", "DC / RS", "Display command"],
      ["Not connected", "TFT_SDO", "Avoid bus conflict"]
    ],
    wiringNote: "Some ILI9488 modules do not release TFT SDO/MISO correctly. Leave the display SDO disconnected when it interferes with touch or SD communication. Power requirements depend on the module’s J1 configuration.",
    code: `#include <TFT_eSPI.h>
#include <XPT2046_Touchscreen.h>

constexpr uint8_t TOUCH_CS = 8;
TFT_eSPI tft;
XPT2046_Touchscreen touch(TOUCH_CS);

if (touch.touched()) {
  TS_Point raw = touch.getPoint();
  ScreenPoint p = calibrate(raw); // map to current rotation
  handlePress(p.x, p.y);
}`,
    outcomes: ["Initialise display and touch controllers independently", "Calibrate raw touch values", "Draw a button and detect a press inside its bounds", "Explain how chip-select prevents two devices driving the bus"],
    troubleshoot: [
      ["Display works, touch does not", "Check T_CS, T_DO, shared clock/data, and initialise the touch library after setting CS pins inactive."],
      ["Coordinates are reversed", "Recalibrate for the chosen rotation and swap or invert axes as required."],
      ["Touch or SD locks up", "Disconnect TFT SDO and verify that only one chip-select line is LOW at a time."]
    ],
    extensions: ["On-screen keypad", "Debounced touch buttons", "Touch-drawn graph cursor", "Separate SD card onto the second SPI peripheral"]
  },
  {
    slug: "sd-data-display",
    short: "SD",
    level: "Advanced",
    title: "SD Data Display",
    intro: "Store and retrieve files on a microSD card, then present selected data or images on a display without bus conflicts.",
    image: "https://github.com/user-attachments/assets/9295b346-a905-4f83-9c77-06c00559bef4",
    imageAlt: "ESP32-S3 wiring diagram for separate TFT and SD-card SPI buses",
    source: "https://github.com/ooikk/Arduino-Documentation/tree/main/07_SDCard_Display",
    duration: "4–6 hours",
    difficulty: "Storage and buses",
    parts: ["ESP32-S3 development board", "microSD breakout or display with SD slot", "FAT32-formatted microSD card", "Jumper wires", "Optional TFT display", "SD and SPI libraries"],
    fundamentals: [
      ["Block storage and a file system", "The card stores sectors; the FAT file system organises those sectors into named files and directories."],
      ["SPI ownership", "A card can use a dedicated SPI peripheral or share a bus with a display. Shared devices need separate CS pins and disciplined initialisation."],
      ["Write integrity", "Removing power during a write can corrupt the file system. Close files, flush important data, and design a safe shutdown process."]
    ],
    connections: [
      ["3V3 / rated supply", "VCC", "Verify module"],
      ["GND", "GND", "Common ground"],
      ["GPIO 4", "SCK", "VSPI clock"],
      ["GPIO 6", "MOSI", "ESP32 → card"],
      ["GPIO 5", "MISO", "Card → ESP32"],
      ["GPIO 7", "CS", "Card select"]
    ],
    wiringNote: "This example places the SD card on a separate SPI peripheral from the TFT. Keep logic at 3.3 V and use an SD module designed for the supply voltage you provide.",
    code: `#include <SPI.h>
#include <SD.h>

SPIClass sdBus(VSPI);
constexpr uint8_t SD_CS = 7;

sdBus.begin(4, 5, 6);       // SCK, MISO, MOSI
if (!SD.begin(SD_CS, sdBus, 16000000)) {
  Serial.println("SD initialisation failed");
}
`,
    outcomes: ["Initialise a card on an explicitly assigned SPI bus", "List files and report their sizes", "Read a text or image file in bounded chunks", "Explain when separate SPI buses simplify integration"],
    troubleshoot: [
      ["Card mount failed", "Check formatting, CS pin, supply voltage, wiring order, and start at a lower SPI frequency."],
      ["Works alone but not with TFT", "Set every CS pin HIGH before initialisation or use separate SPI peripherals."],
      ["Files become corrupted", "Close files, avoid power loss during writes, and test the card on a computer."]
    ],
    extensions: ["CSV sensor logger", "Image slideshow", "Configuration file loader", "Ring-buffered event logging with timestamps"]
  },
  {
    slug: "protocol-test-bench",
    short: "BUS",
    level: "Advanced",
    title: "Protocol Test Bench",
    intro: "Compare UART, I²C, SPI, and I²S by wiring real peripherals and observing how each protocol moves data.",
    image: "https://github.com/user-attachments/assets/140ca81c-1869-4194-9212-f1367c9c127f",
    imageAlt: "SPI module overview used as one station in the communication protocol test bench",
    source: "https://github.com/ooikk/Arduino-Documentation",
    duration: "4–6 hours",
    difficulty: "Communications lab",
    parts: ["ESP32-S3 development board", "Second microcontroller or UART adapter", "I²C sensor or display", "SPI peripheral", "Optional I²S microphone or amplifier", "Logic analyser if available"],
    fundamentals: [
      ["UART", "Asynchronous point-to-point communication uses TX and RX with matching baud, frame format, and a shared ground."],
      ["I²C", "A controller addresses multiple targets over shared SDA and SCL lines with pull-up resistors and acknowledgements."],
      ["SPI", "A controller supplies clock and selects one peripheral. Separate MOSI and MISO lines permit simultaneous transfer."],
      ["I²S", "A dedicated digital-audio bus separates bit clock, word/channel select, and sample data."]
    ],
    connections: [
      ["GPIO 17 TX", "UART RX", "Cross-connect"],
      ["GPIO 18 RX", "UART TX", "Cross-connect"],
      ["GPIO 8", "I²C SDA", "Shared data"],
      ["GPIO 9", "I²C SCL", "Clock"],
      ["GPIO 11", "SPI MOSI", "Controller out"],
      ["GPIO 13", "SPI MISO", "Controller in"],
      ["GPIO 12", "SPI SCK", "Clock"],
      ["GPIO 10", "SPI CS", "Select"],
      ["GPIO 4", "I²S BCLK", "Audio clock"],
      ["GPIO 5", "I²S LRCK", "Channel select"],
      ["GPIO 1", "I²S DATA", "Audio samples"],
      ["GND", "All modules", "Common reference"]
    ],
    wiringNote: "Treat the pin map as a controlled lab allocation, not a universal default. ESP32-S3’s GPIO matrix allows many peripherals to be remapped; always check for board-specific reserved pins.",
    code: `#include <Wire.h>
#include <SPI.h>

HardwareSerial link(1);

link.begin(115200, SERIAL_8N1, 18, 17); // RX, TX
Wire.begin(8, 9);                       // SDA, SCL
SPI.begin(12, 13, 11, 10);             // SCK, MISO, MOSI, CS

// Test one interface at a time and log the result.`,
    outcomes: ["Wire and identify the signal roles of four buses", "Choose an interface based on distance, speed, pins, and device type", "Capture or print evidence of a successful transaction", "Diagnose a crossed signal, missing ground, wrong address, or wrong clock setting"],
    troubleshoot: [
      ["UART text is unreadable", "Match baud and frame format, cross TX to RX, and connect grounds."],
      ["I²C target is absent", "Scan addresses and inspect pull-ups, SDA/SCL order, and target power."],
      ["SPI returns invalid data", "Check CS timing, clock mode, pin mapping, and whether MISO is released by other devices."],
      ["I²S audio is silent or distorted", "Check BCLK/LRCK/data direction, sample rate, bit width, and amplifier enable."]
    ],
    extensions: ["Measure bus throughput", "Capture waveforms with a logic analyser", "Add checksums to UART messages", "Create a decision table for selecting a protocol"]
  }
];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function list(items, className = "") {
  return `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function connectionDiagram(project) {
  const height = Math.max(330, 120 + project.connections.length * 40);
  const palette = ["#175fe9", "#13b8c4", "#ff7a45", "#7a5af8", "#299c5f", "#d8446f"];
  const lines = project.connections.map(([left, right, role], index) => {
    const y = 88 + index * 40;
    const color = palette[index % palette.length];
    return `
      <g>
        <line x1="245" y1="${y}" x2="675" y2="${y}" stroke="${color}" stroke-width="4" />
        <circle cx="245" cy="${y}" r="6" fill="${color}" />
        <circle cx="675" cy="${y}" r="6" fill="${color}" />
        <rect x="318" y="${y - 14}" width="284" height="28" rx="8" fill="#ffffff" stroke="${color}" />
        <text x="460" y="${y + 5}" text-anchor="middle" fill="#0b1830" font-size="13" font-weight="700">${escapeHtml(left)} → ${escapeHtml(right)}</text>
        <text x="460" y="${y + 25}" text-anchor="middle" fill="#516078" font-size="11">${escapeHtml(role)}</text>
      </g>`;
  }).join("");
  return `
    <div class="diagram-frame" role="img" aria-label="Connection diagram between ESP32-S3 and ${escapeHtml(project.title)} hardware">
      <svg viewBox="0 0 920 ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="30" width="220" height="${height - 60}" rx="22" fill="#081a35"/>
        <text x="135" y="60" text-anchor="middle" fill="#c9f45a" font-size="18" font-weight="800">ESP32-S3</text>
        <rect x="675" y="30" width="220" height="${height - 60}" rx="22" fill="#eaf0ff" stroke="#175fe9" stroke-width="2"/>
        <text x="785" y="60" text-anchor="middle" fill="#081a35" font-size="16" font-weight="800">${escapeHtml(project.short)} MODULE</text>
        ${lines}
      </svg>
    </div>`;
}

function page(project, index) {
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const fundamentals = project.fundamentals.map(([title, text]) => `
    <article class="foundation-item"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join("");
  const troubleshoot = project.troubleshoot.map(([symptom, check]) => `
    <tr><th scope="row">${escapeHtml(symptom)}</th><td>${escapeHtml(check)}</td></tr>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(project.intro)}">
  <title>${escapeHtml(project.title)} | ESP32 Learning Lab</title>
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/styles.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header">
    <nav class="nav-shell" aria-label="Main navigation">
      <a class="brand" href="../index.html"><span class="brand-mark" aria-hidden="true">32</span><span>ESP32 Learning Lab<small>Electronics · C · IoT</small></span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav">Menu</button>
      <div class="nav-links" id="main-nav"><a href="../index.html">Home</a><a href="../technology.html">ESP32</a><a href="../projects.html" aria-current="page">Projects</a><a href="../curriculum.html">Lesson plans</a><a href="../about.html">About</a><a href="../contact.html">Contact</a></div>
    </nav>
  </header>
  <main id="main">
    <section class="project-detail-hero">
      <div class="wrap project-hero-grid">
        <div>
          <div class="breadcrumb"><a href="../index.html">Home</a><span>/</span><a href="../projects.html">Projects</a><span>/</span><span>${escapeHtml(project.title)}</span></div>
          <div class="tags"><span class="tag">${escapeHtml(project.level)}</span><span class="tag">${escapeHtml(project.duration)}</span></div>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="lead">${escapeHtml(project.intro)}</p>
          <div class="hero-actions"><a class="button" href="#wiring">See ESP32-S3 connections</a><a class="button secondary" href="#code">Study the code extract</a></div>
        </div>
        <figure class="project-figure">
          <img src="${project.image}" alt="${escapeHtml(project.imageAlt)}" loading="eager" referrerpolicy="no-referrer">
          <figcaption>Reference hardware or diagram from the course’s Arduino documentation.</figcaption>
        </figure>
      </div>
    </section>

    <section class="section-tight">
      <div class="wrap project-facts">
        <div><small>Level</small><strong>${escapeHtml(project.level)}</strong></div>
        <div><small>Suggested time</small><strong>${escapeHtml(project.duration)}</strong></div>
        <div><small>Focus</small><strong>${escapeHtml(project.difficulty)}</strong></div>
        <div><small>Deliverable</small><strong>Working demonstration</strong></div>
      </div>
    </section>

    <section class="section">
      <div class="wrap project-layout">
        <article>
          <section class="content-section">
            <p class="eyebrow">01 · Engineering foundation</p>
            <h2>Know what the circuit is doing.</h2>
            <div class="foundation-grid">${fundamentals}</div>
          </section>

          <section class="content-section" id="wiring">
            <p class="eyebrow">02 · Connections</p>
            <h2>Wire it to the ESP32-S3.</h2>
            ${connectionDiagram(project)}
            <div class="notice"><strong>Before applying power</strong><p>${escapeHtml(project.wiringNote)}</p></div>
          </section>

          <section class="content-section" id="code">
            <p class="eyebrow">03 · Code focus</p>
            <h2>Study the important pattern.</h2>
            <pre class="code project-code"><code>${escapeHtml(project.code)}</code></pre>
            <p class="code-note">This is an instructional extract, not the complete project. Error handling, library setup, and supporting functions may be omitted deliberately.</p>
          </section>

          <section class="content-section">
            <p class="eyebrow">04 · Project outcome</p>
            <h2>What a successful build demonstrates.</h2>
            ${list(project.outcomes, "outcome-list")}
          </section>

          <section class="content-section">
            <p class="eyebrow">05 · Diagnose</p>
            <h2>Use symptoms as evidence.</h2>
            <div class="table-wrap"><table class="spec-table troubleshooting-table"><thead><tr><th>Symptom</th><th>First checks</th></tr></thead><tbody>${troubleshoot}</tbody></table></div>
          </section>

          <section class="content-section">
            <p class="eyebrow">06 · Extend</p>
            <h2>Move beyond the first demonstration.</h2>
            ${list(project.extensions, "extension-grid")}
          </section>
        </article>

        <aside class="project-sidebar">
          <div class="card">
            <p class="eyebrow">Equipment</p>
            <h3>What you need</h3>
            ${list(project.parts, "compact-list")}
          </div>
          <div class="card">
            <p class="eyebrow">Full reference</p>
            <h3>Continue with the source material</h3>
            <p>The repository contains fuller notes, sketches, library details, and additional experiments.</p>
            <a class="link-arrow" href="${project.source}">Open complete resources →</a>
          </div>
        </aside>
      </div>
    </section>

    <nav class="wrap project-nav" aria-label="Other project examples">
      <a href="${previous.slug}.html"><span>Previous project</span><strong>← ${escapeHtml(previous.title)}</strong></a>
      <a href="../projects.html"><span>All projects</span><strong>Project library</strong></a>
      <a href="${next.slug}.html"><span>Next project</span><strong>${escapeHtml(next.title)} →</strong></a>
    </nav>
  </main>
  <footer class="site-footer"><div class="wrap"><div class="footer-grid"><a class="brand" href="../index.html"><span class="brand-mark" aria-hidden="true">32</span><span>ESP32 Learning Lab</span></a><div class="footer-links"><a href="../about.html">About</a><a href="../curriculum.html">Lesson plans</a><a href="../projects.html">Projects</a><a href="../contact.html">Contact</a></div></div><p class="copyright">© <span data-year></span> Kian Keong Ooi. Verify every pin assignment against your exact board and module.</p></div></footer>
  <script src="../assets/site.js"></script>
</body>
</html>`;
}

mkdirSync(outputDir, { recursive: true });
projects.forEach((project, index) => {
  writeFileSync(resolve(outputDir, `${project.slug}.html`), page(project, index));
});
console.log(`Generated ${projects.length} project learning pages in ${outputDir}`);
