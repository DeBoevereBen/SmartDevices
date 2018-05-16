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
            name: "straight",
            key: "none"
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
        socket.on(command.name, function (data) {
            setMovement(command.key);
        })
    });

    socket.on("volume", volume => setVolume(volume));

    setInterval(() => logSpeed(socket), 200);

});

function setMovement(command) {
    resetMovement(command);

    if (movementCommands.find(x => x.key === command) !== undefined) {
        this[command] = true;
    }
}

function resetMovement(command) {
    switch (command) {
        case "none":
            keyLeft = false;
            keyRight = false;
            keyFaster = false;
            break;
        case "keyFaster":
            keySlower = false;
            break;
        case "keySlower":
            keyFaster = false;
            break;
        case "uitbollen":
            keyFaster = false;
            keySlower = false;
            break;
        case "keyLeft":
            keyRight = false;
            break;
        case "keyRight":
            keyLeft = false;
            break;
    }
}

function setVolume(volume) {
    console.log(volume);
    let music = Dom.get('music');
    music.volume = volume;
}

function logSpeed(socket) {
    let realSpeed = 5 * Math.round(speed / 500);
    socket.emit("lcd", realSpeed);
}

/*
* fetch("/speed", {
    body: JSON.stringify({message: "lcd 75"}), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
  })
  .then(console.log)
* */