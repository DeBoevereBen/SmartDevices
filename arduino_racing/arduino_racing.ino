int button_A = 3;
int button_B = 2;
int volume_in = A5;
int left = 5;
int right = 6;

bool isAccelerating = false;
bool isDecelerating = false;

const byte maxCommandLength = 16;
char receivedChars[maxCommandLength];
boolean commandAvailable = false;

String writeCommand = "lcd write";

int lcd_pwm = 11;
int red_led = 12;
int green_led = 13;

int volume_out = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("arduino ready");
  pinMode(lcd_pwm, OUTPUT);
  pinMode(red_led, OUTPUT);
  pinMode(green_led, OUTPUT);

  pinMode(button_A, INPUT);
  pinMode(button_B, INPUT);
  pinMode(volume_in, INPUT);
  pinMode(left, INPUT);
  pinMode(right, INPUT);

  attachInterrupt(digitalPinToInterrupt(button_A), accelerate, CHANGE);
  attachInterrupt(digitalPinToInterrupt(button_B), decelerate, CHANGE);
}

void accelerate() {
  int pressed = digitalRead(button_A);
  if (!isDecelerating) {
    if (pressed == HIGH) {
      isAccelerating = false;
      sendToLED("off");
    } else {
      isAccelerating = true;
      sendToLED("green");
    }
  }
}

void decelerate() {
  int pressed = digitalRead(button_B);
  if (!isAccelerating) {
    if (pressed == HIGH) {
      isDecelerating = false;
      sendToLED("off");
    } else {
      isDecelerating = true;
      sendToLED("red");
    }
  }
}

void loop() {
  readCommand();
  doCommand();
  readVolume();
  isTilted();
  doSpeedStuff();
  delay(100);
}

void doSpeedStuff() {
  if (isAccelerating) {
    Serial.println("accelerate");
  } else if (isDecelerating) {
    Serial.println("break");
  } else {
    Serial.println("uitbollen");
  }
}

void isTilted() {
  int isLeft = digitalRead(left);
  int isRight = digitalRead(right);
  if (isLeft) {
    Serial.println("left");
  } else if (isRight) {
    Serial.println("right");
  } else {
    Serial.println("straight");
  }
}

void readVolume() {
  int temp = analogRead(volume_in);
  if (temp >= volume_out + 100 || temp <= volume_out - 100) {
    volume_out = temp;
    Serial.print("volume ");
    Serial.println(volume_out);
  }
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
  } else if (param.equals("off")) {
    digitalWrite(green_led, LOW);
    digitalWrite(red_led, LOW);
  }
}

void sendToLCD(String param) {
  int motor_speed = param.toInt();
  int to_send =  map(motor_speed, 0, 120, 0, 255);
  analogWrite(lcd_pwm, to_send);
}


