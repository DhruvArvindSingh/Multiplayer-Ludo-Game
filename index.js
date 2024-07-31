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
const ongoing_game = [];
let no_of_ongoing_games = 0


app.get("/", (req, res) => {
    res.render("Ludo", {
        title: "First User"
    });
})

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    socket.on("my_name", (name) => {

        if (!current_players.red) {
            current_players.red = socket.id;
            current_players.red_name = socket.id;
            console.log("red");
            socket.join("Game_room");
            socket.join(`red_player`);
            socket.emit("player_color", "red");
        }
        else if (!current_players.green) {
            current_players.green = socket.id;
            current_players.green_name = socket.id;
            console.log("green");
            socket.join("Game_room");
            socket.join(`green_player`);
            socket.emit("player_color", "green");
        }
        else if (!current_players.yellow) {
            current_players.yellow = socket.id;
            current_players.yellow_name = socket.id;
            console.log("yellow");
            socket.join("Game_room");
            socket.join(`yellow_player`);
            socket.emit("player_color", "yellow");
        }
        else if (!current_players.blue) {
            current_players.blue = socket.id;
            current_players.game_id = current_players.red;
            current_players.blue_name = socket.id;
            console.log("blue");
            socket.join("Game_room");
            socket.join(`blue_player`);
            ongoing_game.push({ ...current_players });
            console.log("ongoing_game", ongoing_game);
            console.log("current_players", current_players);
            socket.emit("player_color", "blue");
            ongoing_game++;
            Start_Game();
        }
    })
    socket.on("join_room", (my_color) => {
        socket.join("Game_room");
        socket.join(`${my_color}_player`);
    });

    async function Start_Game() {
        const player_order = ["red", "green", "yellow", "blue"];
        for (let j = 0; ; j++) {
            for (let i = 0; i < 4; i++) {
                await socket.to(`${player_order[i]}_player`).emit("Roll_dice");
                await socket.on("Dice_value", (dice_value) => {
                    console.log(dice_value);
                });
                socket.to("Game_room").broadcast("Dice_value", dice_value);
            }
        }
    }

})

server.listen(80, () => {
    console.log("Server Started");
})