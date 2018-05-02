let SocketModule = (function () {

    function SocketModule(io){
        let socket = null;

        this.io = io;

        this.io.on('connection', function (client) {
            console.log('Client connected...');
            socket = client;

            socket.emit("data", "test");
        });


    }



    return SocketModule;
})();

module.exports = SocketModule;