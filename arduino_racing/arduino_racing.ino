#include <LiquidCrystal.h>

int rs = 3;
int enable = 4;
int d4 = 10;
int d5 = 11;
int d6 = 12;
int d7 = 13;
int columns = 16;
int rows = 2;

LiquidCrystal lcd(rs, enable, d4, d5, d6, d7);

const byte maxCommandLength = 16;
char receivedChars[maxCommandLength];
boolean commandAvailable = false;

String writeCommand = "lcd write";

void setup() {
  Serial.begin(9600);
  Serial.println("arduino ready");

  lcd.begin(columns, rows);
  lcd.clear();
  lcd.print("Ready");
}

void loop() {
  readCommand();
  doCommand();
}

void readCommand() {
  char currentChar;
  static int commandCharacterIndex = 0;
  char startDelim = '{';
  char endDelim = '}';
  static boolean receivingCommand = false;  // static because this function will be called multiple times while reading a single command



  while (Serial.available() > 0 && !commandAvailable) {
    currentChar = Serial.read();

    if (receivingCommand) {

      if (currentChar != endDelim) { // read next command character

        receivedChars[commandCharacterIndex] = currentChar;
        commandCharacterIndex++;
        // safeguard if the user sends a command that's too long
        if ( commandCharacterIndex >= maxCommandLength) {
          commandCharacterIndex = maxCommandLength - 1;
        }
      } else { // command fully received, clean up
        receivedChars[commandCharacterIndex] = '\0'; // null-terminate string
        receivingCommand = false;
        commandCharacterIndex = 0;
        commandAvailable = true;
      }
    } else if (currentChar == startDelim) {
      receivingCommand = true;
    }
  }
}

void doCommand() {
  if (commandAvailable) {
    String command(receivedChars);
    command += " km/h";
    Serial.println("Command: " +  command);
    int startPos = round((columns - command.length()) / 2);
    lcd.clear();
    lcd.setCursor(startPos, 0);
    lcd.print(command);

    commandAvailable = false;
  }
}


