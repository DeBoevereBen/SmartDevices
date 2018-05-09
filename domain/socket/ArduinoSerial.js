const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;

const ArduinoSerial = (function () {
    let receivedHandshake = false;
    let dataBufferedBeforeHandshake = [];

    function ArduinoSerial(portname, baudRate) {
        this.portname = portname;
        this.baudRate = baudRate;
        this.websocket = null;

        // default event listeners
        this.onOpen = onOpen;
        this.onReceiveData = onReceiveData;
        this.write = write;
        this.showError = (err) => console.error(err);
    }

    ArduinoSerial.prototype.open = function () {
        let self = this;
        this.port = new SerialPort(this.portname, { baudRate: this.baudRate });

        const parser = new ReadLine(); // tranform stream: emits data on a newline character by default, possible to pass other delimiter
        this.port.pipe(parser); // pipe the serial stream to the parser

        this.port.on('open', this.onOpen);
        parser.on('data', this.onReceiveData);
        this.port.on('error', this.showError)
    }


    function onOpen() {
        console.log("open connection");

    }

    function onReceiveData(command) {
        console.log("Received data: " + command);

        let movementCommands = ["left", "right", "break", "accelerate"];

        // this should be "left", "right", "break" or "accelerate"
        if(movementCommands.indexOf(command) !== -1){
            websocket.emitCommand(command);
        }

        // volume command format: "volume 0.43"
        if(command.indexOf("volume") !== -1){
            let volume = parseFloat(command.split(" ")[1]);

            websocket.emitCommand("volume", volume)
        }


        // socket.emit("temperature", data);
    }

    function write(data) {
        //console.log("sending to serial: " + data);
        this.port.write(data + "\n");
    }

    // should wait untill the arduino has sent a ready message (handshake)
    // buffers data that is sent before the 
    // see https://node-serialport.github.io/node-serialport/SerialPort.html#write
    // ArduinoSerial.prototype.write = function(data){
    //     this.port.write(data);
    // }

    return ArduinoSerial;
})();


module.exports = ArduinoSerial;