
const byte maxCommandLength = 16;
char receivedChars[maxCommandLength];
boolean commandAvailable = false;

String writeCommand = "lcd write";

int lcd_pwm = 11;
int red_led = 12;
int green_led = 13;

void setup() {
  Serial.begin(9600);
  Serial.println("arduino ready");
  pinMode(lcd_pwm, OUTPUT);
  pinMode(red_led, OUTPUT);
  pinMode(green_led, OUTPUT);
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
    char separator = ' ';
    int indexOfSeparator = command.indexOf(separator);
    String commandName = command.substring(0, indexOfSeparator);
    String param = command.substring(indexOfSeparator + 1);

    if (commandName.equals("lcd")) {
      sendToLCD(param);
    } else if (commandName.equals("led")) {
      sendToLED(param);
    }
    commandAvailable = false;
  }
}

void sendToLED(String param) {
  if (param.equals("red")) {
    digitalWrite(red_led, HIGH);
    digitalWrite(green_led, LOW);
  } else if (param.equals("green")) {
    digitalWrite(green_led, HIGH);
    digitalWrite(red_led, LOW);
  }
}

void sendToLCD(String param) {
  int motor_speed = param.toInt();
  int to_send =  map(motor_speed, 0, 120, 0, 255);
  analogWrite(lcd_pwm, to_send);
}


