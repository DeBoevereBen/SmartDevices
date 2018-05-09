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

void setup() {
  pinMode(lcd_input, INPUT);
  pinMode(red_light_in, INPUT);
  pinMode(green_light_in, INPUT);

  lcd.begin(columns, rows);
  lcd.clear();
  lcd.print("Ready");
}

void loop() {
  int speed = map(analogRead(lcd_input), 0, 255, 0, 120);
  String text = speed + " km/h";
  int startPos = round((columns - text.length()) / 2);
  lcd.clear();
  lcd.setCursor(startPos, 0);
  lcd.print(text);
  delay(100);
}








