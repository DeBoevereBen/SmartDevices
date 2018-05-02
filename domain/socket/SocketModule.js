let SocketModule = (function () {

    function SocketModule(io){
        let socket = null;

        this.io = io;

        this.io.on('connection',  (client) => {
            console.log('Client connected...');
            this.socket = client;


            this.emitCommand(this.movementCommands.accelerate, null);

            this.socket.on("speed", data => console.log(data));
        });

        // define constants for movementCommands
        this.movementCommands = {
            left: "left",
            right: "right",
            break: "break",
            accelerate: "accelerate"
        }


    }

    SocketModule.prototype.emitCommand = function(name, data){
        if(name in this.movementCommands){
            this.socket.emit(name, data);
        }
    };

    return SocketModule;
})();

module.exports = SocketModule;