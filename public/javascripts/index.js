document.addEventListener("DOMContentLoaded", function () {
    const socket = io.connect('http://localhost:3000');

    movementCommands = [
        {
            name: "left",
            key: "keyLeft"
        },
        {
            name: "right",
            key: "keyRight"
        },
        {
            name: "break",
            key: "keySlower"
        },
        {
            name: "accelerate",
            key: "keyFaster"
        }
    ];

    movementCommands.forEach(command => {
        socket.on(command.name, function(data){
            setMovement(command.key);
        })
    } );

    socket.on("volume", volume => setVolume(volume));

    setInterval(() => logSpeed(socket), 200);

});

function setMovement(command){
    keyFaster = false;
    keySlower = false;
    keyLeft = false;
    keyRight = false;

    // all variables are global, so we can use this fancy javascript to set the variable to true
    this[command] = true;
}

function setVolume(volume){
    console.log(volume);
    let music = Dom.get('music');
    music.volume = volume;
}

function logSpeed(socket){
    let realSpeed =  5 * Math.round(speed/500);
    socket.emit("speed", realSpeed);
}