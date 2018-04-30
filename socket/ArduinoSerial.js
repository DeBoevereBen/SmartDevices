const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;

const ArduinoSerial = (function () {
    let receivedHandshake = false;
    let dataBufferedBeforeHandshake = [];

    function ArduinoSerial(portname, baudRate) {
        this.portname = portname;
        this.baudRate = baudRate;

        // default event listeners
        this.onOpen = () => console.log("open");
        this.onReceiveData = (data) => console.log("Receiving data");
        this.write = (data) => console.log("overwrite sendData to send data");
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

    // should wait untill the arduino has sent a ready message (handshake)
    // buffers data that is sent before the 
    // see https://node-serialport.github.io/node-serialport/SerialPort.html#write
    // ArduinoSerial.prototype.write = function(data){
    //     this.port.write(data);
    // }

    return ArduinoSerial;
})();


module.exports = ArduinoSerial;