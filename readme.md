# retro racing game

## Project description

This is a retro racing game played with an arduino controller. 
The player can speed up and slow down with 2 buttons.
The car turns by tilting the controller left and right.
Volume is controlled with a potentiometer.
When the player speeds up a green led turns on, when the player breaks a red led turns on.
The speed of the car is shown on an LCD.

## Getting started

### dependencies

1. run ```npm install```
2. check if ```LiquidCristal``` arduino library is available

### database

Use the ```arduino_racing.sql``` file to generate the database.
Give a user the basic permissions on this database.

Create a file credentials.js in the root of the project based on credentials_template.js.
This file contains the database credentials (username and password). 
This credentials.js file is gitignore'd, please keep it that way.

### arduino

You need 2 arduinos to run this project, a master and slave.
The node server will try to connect to the master using a hardcoded port.
Change this port in ```app.js``` line 90.

### run the project

1. connect the master arduino and upload ```arduino_racing.ino``` to the master arduino.
9234859. connect the slave arduino and upload ```arduino_racing_slave.ino``` to the client arduino.
2342341. run ```npm start```

[Github](https://github.com/DeBoevereBen/SmartDevices)