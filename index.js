const express = require("express");
const http = require("http");
const socket_io = require("socket.io");
const path = require("path"); // the path that you provide to the express.static function is relative to the directory from where you launch your node process. If you run the express app from another directory, it’s safer to use the absolute path of the directory that you want to serve:
const app = express();
const server = http.createServer(app);
const io = new socket_io.Server(server);
const player_order = ["red", "green", "yellow", "blue"];

//below line actually lets us use ejs file for views folder
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

//below line actually lets us use different css and js file for views folder
app.use(express.static(path.join(__dirname, "public")));

const current_players = {};


app.get("/", (req, res) => {
    res.render("Ludo", {
        title: "First User"
    });
})

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    if (!current_players.red) {
        current_players.red = socket.id;
        socket.emit("player_color", "red");
    }
    else if (!current_players.green) {
        current_players.green = socket.id;
        socket.emit("player_color", "green");
    }
    else if (!current_players.yellow) {
        current_players.yellow = socket.id;
        socket.emit("player_color", "yellow");
    }
    else if (!current_players.blue) {
        current_players.blue = socket.id;
        socket.emit("player_color", "blue");
        // io.sockets.emit("broadcast", {blue : });
    }
    // else {
    //     // socket.emit("player_color", "none");
    // }
    // console.log(current_players);

    // socket.on("my_name", (my_name, my_color) = {


    // })



    // socket.on("disconnect", () => {
    //     if (socket.id === current_players.red) {
    //         delete current_players.red;
    //     }
    //     else if (socket.id === current_players.green) {
    //         delete current_players.green;
    //     }
    //     else if (socket.id === current_players.yellow) {
    //         delete current_players.yellow;
    //     }
    //     else if (socket.id === current_players.blue) {
    //         delete current_players.blue;
    //     }

    // })
    // console.log(current_players);
})

server.listen(80, () => {
    console.log("Server Started");
})