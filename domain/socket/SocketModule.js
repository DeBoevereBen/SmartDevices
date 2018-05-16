let SocketModule = (function () {

    function SocketModule(io, arduino) {
        let socket = null;

        this.io = io;
        this.arduino = arduino;

        this.io.on('connection', (client) => {
            console.log('Client connected...');
            this.socket = client;


            this.emitCommand(this.movementCommands.accelerate, null);

            this.socket.on("lcd", data => {
                arduino.write(`{lcd ${data}}`);
            });
        });

        // define constants for movementCommands
        this.movementCommands = {
            left: "left",
            right: "right",
            straight: "straight",
            break: "break",
            accelerate: "accelerate",
            uitbollen: "uitbollen",
            volume: "volume"
        }


    }

    SocketModule.prototype.emitCommand = function (name, data) {
        if (this.socket !== undefined) {
            if (name in this.movementCommands) {
                this.socket.emit(name, data);
            }
        }
    };


    return SocketModule;
})();

module.exports = SocketModule;