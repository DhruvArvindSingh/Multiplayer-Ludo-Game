const socket = io();
const player_order = ["red", "green", "yellow", "blue"];
let name;
let room_id;
localStorage.clear();
sessionStorage.clear();


function textShadow(precision, size, color) {
    let value = '';
    let offset = 0;
    const length = size * (1 / precision) - 1;

    for (let i = 0; i <= length; i++) {
        offset += precision;
        const shadow = `${offset}px ${offset}px ${color}`;
        value += (i === 0) ? shadow : `, ${shadow}`;
    }

    return value;
}

// Apply the text-shadow dynamically
document.querySelectorAll('.playful span').forEach((span, index) => {
    let color, shadowColor, delay;

    if (index % 2 === 1) {
        color = '#ED625C';
        shadowColor = '#F2A063';
        delay = '0.3s';
    } else if (index % 3 === 2) {
        color = '#FFD913';
        shadowColor = '#6EC0A9';
        delay = '0.15s';
    } else if (index % 5 === 4) {
        color = '#555BFF';
        shadowColor = '#E485F8';
        delay = '0.4s';
    } else if (index % 7 === 6 || index % 11 === 10) {
        color = '#FF9C55';
        shadowColor = '#FF5555';
        delay = '0.25s';
    } else {
        color = '#5362F6';
        shadowColor = '#E485F8';
        delay = '0s';
    }

    span.style.color = color;
    span.style.textShadow = textShadow(0.25, 6, shadowColor);
    span.style.animationDelay = delay;
});


//Craete MAtch


let span = document.getElementsByClassName("close_Craete_room")[0];
let modal = document.getElementById("Create_room");
let back = document.getElementById("cover_page")

span.onclick = function () {
    modal.style.display = "none";
    back.style.display = "flex";
    console.log("room_id = ", room_id);
    socket.emit("leave_room", room_id);
}

function create_match() {
    name = prompt("Enter Your Name: ");

    socket.emit("create_room", name);
    socket.on("create_room_id", (room_idd) => {
        console.log("Craete_room_id received = ", room_idd);
        console.log(document.getElementById("room_id"));
        room_id = room_idd;
        document.getElementById("room_id").innerHTML = room_idd
    })

    // window.onclick = function (event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // }

    // Get the button that opens the modal
    let btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal

    // When the user clicks the button, open the modal 
    // btn.onclick = function () {
    modal.style.display = "block";
    back.style.display = "none";

    let me = document.createElement("div");
    me.classList.add("player");
    me.innerText = `${name} (You)`;
    joined_players = document.getElementById("joined_players");
    if (joined_players.hasChildNodes()) {
        while (joined_players.hasChildNodes() == true) {
            joined_players.removeChild(joined_players.firstChild);
        }
    }
    joined_players.appendChild(me);
}

let join_box = document.getElementById("Join_room");
// let Close_join = document.getElementsByClassName("close_Craete_room")[0];
// Close_join.onclick = function () {
// join_box.style.display = "none";
// back.style.display = "flex";
// }
// console.log(join_box);



function join_match() {

    name = prompt("Enter Your Name: ");
    room_id = prompt("Enter Room Id: ");
    socket.emit("join room", room_id, name);
    socket.on("room not found", () => {
        alert("Room Not Found");
    })
    // join_box.style.display = "block";
    // window.location.href = "custom_game";
    // back.style.display = "none";
    // me.innerText = `${name} (You)`;
    // joined_players = document.getElementById("joined_players");
    // if (joined_players.hasChildNodes()) {
    // while (joined_players.hasChildNodes() == true) {
    // joined_players.removeChild(joined_players.firstChild);
    // }
    // }
    // joined_players.appendChild(me);

}

function clearsessionStorage() {
    console.log(sessionStorage);
    sessionStorage.clear();
    console.log(sessionStorage);
}


socket.on("show players", (players, room_id) => {
    console.log("show players received");
    console.log("players: ", players);
    socket.room_id = room_id;
    // socket.join(`${room_id}`);
    console.log("socket.room_id: ", socket.room_id);
    console.log("room_id: ", room_id);
    console.log(document.getElementById("room_id"));
    document.getElementById("room_id").innerHTML = room_id;
    modal.style.display = "block";
    back.style.display = "none";
    joined_players = document.getElementById("joined_players");
    console.log("joined_players = ", joined_players);
    if (joined_players.hasChildNodes()) {
        while (joined_players.hasChildNodes() == true) {
            joined_players.removeChild(joined_players.firstChild);
        }
    }
    console.log("joined_players = ", joined_players);
    for (let i = 0; i < 4; i++) {
        console.log("players : ", players[`${player_order[i]}`]);
        if (players[`${player_order[i]}`] != undefined) {

            let me = document.createElement("div");
            me.classList.add("player");
            me.innerText = `${players[`${player_order[i]}_name`]}`;
            console.log("players[`${player_order[i]}_name`] = ", players[`${player_order[i]}_name`]);
            me.style.backgroundColor = `${players[`${player_order[i]}`]} `
            joined_players.appendChild(me);
        }
    }
    console.log("joined_players = ", joined_players);


})
socket.on("player added", (players) => {
    console.log("player added received");
    console.log("players: ", players);
    joined_players = document.getElementById("joined_players");
    console.log("joined_players = ", joined_players);
    if (joined_players.hasChildNodes()) {
        while (joined_players.hasChildNodes() == true) {
            joined_players.removeChild(joined_players.firstChild);
        }
    }
    console.log("joined_players = ", joined_players);
    // console.log("joined_players = ", joined_players);
    // console.log("players.length / 2 = ", players.length / 2);

    for (let i = 0; i < 4; i++) {
        console.log("players : ", players[`${player_order[i]}`]);
        if (players[`${player_order[i]}`] != undefined) {

            let me = document.createElement("div");
            me.classList.add("player");
            me.innerText = `${players[`${player_order[i]}_name`]}`;
            console.log("players[`${player_order[i]}_name`] = ", players[`${player_order[i]}_name`]);
            me.style.backgroundColor = `${players[`${player_order[i]}`]} `
            joined_players.appendChild(me);
        }
    }
    console.log("joined_players = ", joined_players);
})
socket.on("copy id to local storage", async () => {
    console.log("copy id to local storage received");
    clearsessionStorage();
    let a = await sessionStorage.setItem("room_id", `${room_id}`);
    let b = await sessionStorage.setItem("name", `${name}`);
    let c = await sessionStorage.setItem("id", `${socket.id}`);
})
socket.on("Start custom game", () => {
    window.location.href = "custom_game";
})



// GAME JS

function start() {
    window.location.href = "start_game";
}