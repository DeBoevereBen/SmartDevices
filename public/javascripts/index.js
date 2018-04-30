document.addEventListener("DOMContentLoaded", function () {
    const socket = io.connect('http://localhost:3000');
    console.log("Ready");
    $("form").on("submit", function (e) {
        e.preventDefault();
        const message = e.target.message.value;
        console.log(message);
        fetch("/speed", {
            method: "post",
            body: JSON.stringify({message: message}),
            headers: {
                'content-type': 'application/json'
            },
        })
            .then(console.log)
            .catch(console.error);
    })
});