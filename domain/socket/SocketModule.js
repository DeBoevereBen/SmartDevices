let SocketModule = (function () {

    function SocketModule(io){
        let socket = null;

        this.io = io;

        this.io.on('connection',  (client) => {
            console.log('Client connected...');
            this.socket = client;


            this.emitCommand(this.movementCommands.accelerate, null);
        });

        // define constants for movementCommands
        this.commands = {
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