#include <LiquidCrystal.h>
int rs = 6;
int enable = 7;
int d4 = 10;
int d5 = 11;
int d6 = 12;
int d7 = 13;
int columns = 16;
int rows = 2;
LiquidCrystal lcd(rs, enable, d4, d5, d6, d7);

int lcd_input = A0;
int green_light_in = A1;
int red_light_in = A2;
int red_led = 2;
int green_led = 3;

int curr_speed = 0;

void setup() {
  pinMode(lcd_input, INPUT);
  pinMode(red_light_in, INPUT);
  pinMode(green_light_in, INPUT);
  pinMode(red_led, OUTPUT);
  pinMode(green_led, OUTPUT);

  digitalWrite(red_led, LOW);
  digitalWrite(green_led, LOW);

  lcd.begin(columns, rows);
  lcd.clear();
  lcd.print("Ready");
}

void loop() {
  doSpeedStuff();
  doLightStuff();
}

void doLightStuff() {
  int green_led_on = digitalRead(green_light_in);
  int red_led_on = digitalRead(red_light_in);
  if (green_led_on + red_led_on == LOW) {
    digitalWrite(red_led, LOW);
    digitalWrite(green_led, LOW);
  } else {
    if (green_led_on == HIGH) {
      digitalWrite(red_led, LOW);
      digitalWrite(green_led, HIGH);
    }
    if (red_led_on == HIGH) {
      digitalWrite(red_led, HIGH);
      digitalWrite(green_led, LOW);
    }
  }
}

void doSpeedStuff() {
  int motor_speed = analogRead(lcd_input);
  motor_speed = map(motor_speed, 0, 1024, 0, 120);
  if (motor_speed >= curr_speed + 2 || motor_speed <= curr_speed - 2) {
    curr_speed = motor_speed;
    String text = String(motor_speed) + " km/h";
    int startPos = round((columns - text.length()) / 2);
    lcd.clear();
    lcd.setCursor(startPos, 0);
    lcd.print(text);
  }
}





