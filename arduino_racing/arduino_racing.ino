
const byte maxCommandLength = 16;
char receivedChars[maxCommandLength];
boolean commandAvailable = false;

String writeCommand = "lcd write";

int lcd_pwm = 11;

void setup() {
  Serial.begin(9600);
  Serial.println("arduino ready");
  pinMode(lcd_pwm, OUTPUT);
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
    int speed = command.toInt();
    Serial.write("arduino says: " + speed);
    analogWrite(lcd_pwm, map(speed, 0, 120, 0, 255));

    commandAvailable = false;
  }
}


