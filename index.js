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
let current_no = 0;
let player_color = player_order[current_no];
io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    socket.on("my_name", (name) => {

        if (!current_players.red) {
            current_players.red = socket.id;
            current_players.red_name = name;
            console.log("red");
            socket.join("Game_room");
            // socket.join(`red_player`);
            socket.emit("player_color", "red");
        }
        else if (!current_players.green) {
            current_players.green = socket.id;
            current_players.green_name = name;
            console.log("green");
            socket.join("Game_room");
            // socket.join(`green_player`);
            socket.emit("player_color", "green");
        }
        else if (!current_players.yellow) {
            current_players.yellow = socket.id;
            current_players.yellow_name = name;
            console.log("yellow");
            socket.join("Game_room");
            // socket.join(`yellow_player`);
            socket.emit("player_color", "yellow");
        }
        else if (!current_players.blue) {
            current_players.blue = socket.id;
            current_players.game_id = current_players.red;
            current_players.blue_name = name;
            console.log("blue");
            socket.join("Game_room");
            // socket.join(`blue_player`);
            ongoing_game.push({ ...current_players });
            console.log("ongoing_game", ongoing_game);
            console.log("current_players", current_players);
            socket.emit("player_color", "blue");
            // ongoing_game++;
            Start_Game();
        }
    })
    // socket.on("join_room", (my_color) => {
    //     socket.join("Game_room");
    //     socket.join(`${my_color}_player`);
    // });

    const player_order = ["red", "green", "yellow", "blue"];
    function Start_Game() {
        console.log("Start_game")

        draw_dice("red")
    }
    function draw_dice(current_color) {
        console.log("Draw_dice")
        io.to(current_players[`${current_color}`]).emit('draw_dice', current_color);

    }
    socket.on("dice_value", async (dice_value) => {
        console.log("Draw_dice");
        let value = dice_value;
        console.log("value: ", value);
        console.log("dice_value: ", dice_value);
        io.except(socket.id).emit("current_dice_value", `${player_order[current_no]}_${value}`);
        allow_move(`${player_order[current_no]}`);
    })
    function allow_move(current_color) {
        console.log(current_players[`${player_order[current_no]}`])
        // io.to[current_players[`${player_order[current_no]}`]].emit('allow_move');
        io.to(current_players[`${current_color}`]).emit('allow_move', `${player_order[current_no]}`);
    }
    socket.on("moved_piece", (loc) => {
        if (loc == "All locked") {
            if (current_no == 3) {
                current_no = 0;
            }
            else {
                current_no++;
            }
            draw_dice(`${player_order[current_no]}`);
        }
        console.log("loc: ", loc);
        // let current_color;
        if (current_no == 3) {
            current_no = 0;
            current_color = player_order[0]
            draw_dice(`${player_order[current_no]}`);
        }
        else {
            current_no++;
            let current_color = player_order[current_no];
            draw_dice(`${player_order[current_no]}`);
            // draw_dice(player_order[`${current_no}`]);
        }
    })


})

server.listen(80, () => {
    console.log("Server Started");
})