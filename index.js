const express = require("express");
const http = require("http");
const socket_io = require("socket.io");
const path = require("path"); // the path that you provide to the express.static function is relative to the directory from where you launch your node process. If you run the express app from another directory, it’s safer to use the absolute path of the directory that you want to serve:
const app = express();
const server = http.createServer(app);
const io = new socket_io.Server(server);
const player_order = ["red", "green", "yellow", "blue"];
const ShortUniqueId = require('short-unique-id');
const { randomUUID } = new ShortUniqueId({ length: 10 });
// import { Start_Game, draw_dice, allow_move } from "./routes/Board_func.js";
//below line actually lets us use ejs file for views folder
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

//below line actually lets us use different css and js file for views folder
app.use(express.static(path.join(__dirname, "public")));

const current_players = {};
const custom_players = {};
const ongoing_game = {};
let no_of_ongoing_games = 0;

app.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    });
})
app.get("/start_game", (req, res) => {
    res.render("Ludo", {
        title: "First User",
    });
})
app.get("/custom_game", (req, res) => {
    res.render("Ludo", {
        title: "Custom Game"
    });
})
app.get("/create", (req, res) => {
    let game_id = randomUUID();
    console.log("game_is : ", game_id)
    res.alert(`Game ID : ${game_id}`);
})

let current_no = 0;
// let player_color = player_order[ongoing_game[`${socket.room_id}`]["current_no"]];
io.on("connection", (socket) => {
    socket.on("update socket data", (id, room_id, name) => {
        console.log("Custom players before update: ", custom_players);
        // console.log("socket data before updated: ", socket);
        for (let i = 0; i < custom_players[`${room_id}`].length; i++) {
            if (custom_players[`${room_id}`][`${player_order[i]}`] == id) {
                custom_players[`${room_id}`][`${player_order[i]}`] = socket.id;
                custom_players[`${room_id}`][`${player_order[i]}_name`] = name;
            }
        }
        socket.room_id = room_id;
        socket.name = name;
        // console.log("socket data updated: ", socket.id);
        console.log("Custom players after update: ", custom_players);

    })
    // socket.on("check socket.id", (session_id) => {
    //     console.log("socket.id check = ", socket.id);
    //     console.log("session_id check = ", session_id);
    // })
    // console.log("User Connected", socket.id);
    // socket.on("change id", (id) => {
    //     console.log("socket.id received = ", socket.id);
    //     socket.id = id;
    //     console.log("socket.id = ", socket.id);

    // })
    // socket.on("change room_id", (room_id) => {
    //     console.log("socket.id received while room_id = ", socket.id);
    //     socket.room_id = room_id;
    //     console.log("socket.room_id while room_id = ", socket.id);
    //     Start_Custom_game(socket.room_id);
    // })
    socket.on("change name", (name) => {
        console.log("socket.id received while name = ", socket.id);
        socket.name = name;
        console.log("socket.room_id while name = ", socket.id);

    })
    socket.on("my_name", (name) => {
        // socket.name = name;
        // console.log("socket.id = ", socket.id);
        // console.log("socket.name = ", socket.name);
        // console.log("socket.roomm_id= ", socket.room_id);

        if (!current_players.red) {
            current_players.red = socket.id;
            current_players.red_name = name;
            console.log("red");
            socket.color = "red";
            socket.room_id = no_of_ongoing_games + 1;
            socket.join(`${no_of_ongoing_games + 1}`);
            // socket.join(`red_player`);
            socket.emit("player_color", "red");
        }
        else if (!current_players.green) {
            current_players.green = socket.id;
            current_players.green_name = name;
            console.log("green");
            socket.color = "green";
            socket.room_id = no_of_ongoing_games + 1;
            socket.join(`${no_of_ongoing_games + 1}`);
            // socket.join(`green_player`);
            socket.emit("player_color", "green");
        }
        else if (!current_players.yellow) {
            current_players.yellow = socket.id;
            current_players.yellow_name = name;
            console.log("yellow");
            socket.color = "yellow";
            socket.room_id = no_of_ongoing_games + 1;
            socket.join(`${no_of_ongoing_games + 1}`);
            // socket.join(`yellow_player`);
            socket.emit("player_color", "yellow");
        }
        else if (!current_players.blue) {
            current_players.blue = socket.id;
            current_players.game_id = current_players.red;
            current_players.blue_name = name;
            console.log("blue");
            socket.room_id = no_of_ongoing_games + 1;
            socket.join(`${no_of_ongoing_games + 1}`);
            socket.color = "blue";
            // socket.join(`blue_player`);
            // ongoing_game.push({ ...current_players });
            console.log("ongoing_game", ongoing_game);
            current_players.current_no = 0;
            console.log("current_players", current_players);
            // clear_current_players();
            socket.emit("player_color", "blue");
            // ongoing_game++;
            Start_Game(no_of_ongoing_games + 1);
        }
    })
    // socket.on("join_room", (my_color) => {
    //     socket.join("Game_room");
    //     socket.join(`${my_color}_player`);
    // });
    socket.on("join room", (room_id, name) => {
        console.log("join room request received with id: ", room_id);
        console.log("custom_players before = ", custom_players);
        if (custom_players[`${room_id}`] != undefined) {
            socket.name = name;
            socket.room_id = room_id;
            console.log("player added to room: ", socket.room_id);
            if (custom_players[`${room_id}`]["green"] == undefined) {
                custom_players[`${room_id}`]["green"] = `${socket.id}`;
                custom_players[`${room_id}`]["green_name"] = `${socket.name}`;
                socket.color = "green";
                socket.host = false;
                socket.join(`${room_id}`);
                console.log("socket.room_id: ", socket.room_id);
                socket.emit("show players", custom_players[`${room_id}`], room_id);
                io.to(`${room_id}`).emit("player added", custom_players[`${room_id}`]);
            }
            else if (custom_players[`${room_id}`]["yellow"] == undefined) {
                custom_players[`${room_id}`]["yellow"] = `${socket.id}`;
                custom_players[`${room_id}`]["yellow_name"] = `${socket.name}`;
                socket.color = "yellow";
                socket.host = false;
                socket.join(`${room_id}`);
                socket.emit("show players", custom_players[`${room_id}`], room_id);
                io.to(`${room_id}`).emit("player added", custom_players[`${room_id}`]);
            }
            else if (custom_players[`${room_id}`]["blue"] == undefined) {
                custom_players[`${room_id}`]["blue"] = `${socket.id}`;
                custom_players[`${room_id}`]["blue_name"] = `${socket.name}`;
                socket.color = "blue";
                socket.host = false;
                socket.join(`${room_id}`);
                socket.emit("show players", custom_players[`${room_id}`], room_id);
                socket.to(`${room_id}`).emit("player added", custom_players[`${room_id}`]);
                io.to(`${room_id}`).emit("copy id to local storage");
                io.to(`${room_id}`).emit("Start custom game");
                // Start_Custom_game(socket.room_id);

            }
            else {
                socket.emit("custom match full");
            }

        }
        else {
            console.log("Room not found!!");
            socket.emit("room not found");
        }
        console.log("custom_players after = ", custom_players);

    })

    const player_order = ["red", "green", "yellow", "blue"];

    socket.on("init custom game", (room_id) => {

    })

    socket.on("create_room", (name) => {
        // console.log()
        console.log("ongoing_game = ", ongoing_game);
        socket.room_id = no_of_ongoing_games + 1;
        socket.name = name;
        socket.color = "red";
        socket.join(`${no_of_ongoing_games + 1}`);
        console.log("Create room created = ", socket.room_id);
        no_of_ongoing_games++;
        socket.host = true;
        console.log("no_of_ongoing_games = ", no_of_ongoing_games);
        custom_players[`${socket.room_id}`] = {
            ...custom_players[`${socket.room_id}`], "red": `${socket.id}`, "red_name": `${socket.name}`
        };
        console.log("custom_players = ", custom_players);
        socket.emit("create_room_id", socket.room_id);
    })

    socket.on("dice_value", async (dice_value) => {
        // console.log("Draw_dice");
        let value = dice_value;
        console.log("dice_value recieved: ", value);
        let no = ongoing_game[`${socket.room_id}`]["current_no"];
        console.log("no = ", no);
        io.to(`${socket.room_id}`).emit("current_dice_value", `${player_order[ongoing_game[`${socket.room_id}`]["current_no"]]}_${value}`);
        // check_for_locked_pieces();
        allow_move(`${player_order[no]}`);
    })

    socket.on("moved_piece", (loc) => {
        let no = ongoing_game[`${socket.room_id}`][current_no];
        if (loc == "All locked") {
            if (no == 3) {
                ongoing_game[`${socket.room_id}`][current_no] = 0;
            }
            else {
                ongoing_game[`${socket.room_id}`][current_no]++;
            }
            draw_dice(`${player_order[ongoing_game[`${socket.room_id}`]["current_no"]]}`);
        }
        console.log("loc: ", loc);
        // let current_color;
        if (ongoing_game[`${socket.room_id}`]["current_no"] == 3) {
            ongoing_game[`${socket.room_id}`]["current_no"] = 0;
            current_color = player_order[0]
            draw_dice(`${player_order[ongoing_game[`${socket.room_id}`]["current_no"]]}`);
        }
        else {
            ongoing_game[`${socket.room_id}`]["current_no"]++;
            let current_color = player_order[ongoing_game[`${socket.room_id}`]["current_no"]];
            draw_dice(`${player_order[ongoing_game[`${socket.room_id}`]["current_no"]]}`);
            // draw_dice(player_order[`${current_no}`]);
        }
    })

    socket.on("next_turn", (color) => {
        console.log("socket.name = ", socket.name);
        // console.log(socket);
        console.log("next_turn received : color = ", color);
        ongoing_game[`${socket.room_id}`]["current_no"] = player_order.indexOf(color) + 1;
        console.log(`current_no = ${ongoing_game[`${socket.room_id}`]["current_no"]}, player_order[current_no] = ${ongoing_game[`${socket.room_id}`]["current_no"]}`);
        if (ongoing_game[`${socket.room_id}`]["current_no"] == 4) {
            console.log("current_no = 3");
            ongoing_game[`${socket.room_id}`]["current_no"] = 0;
            console.log("current_no = ", ongoing_game[`${socket.room_id}`]["current_no"]);
        }
        draw_dice(`${player_order[ongoing_game[`${socket.room_id}`]["current_no"]]}`);
    })
    socket.on("status of board", (status) => {
        console.log("socket.name = ", socket.name);
        console.log("status of board : ", status);
        io.to(`${socket.room_id}`).emit("current board status", status);
    })
    socket.on("extra chance for 6,death or home", (color) => {
        console.log("socket.name = ", socket.name);
        console.log("extra chance for 6,death or home : ", color);
        socket.emit("draw_dice", color);

    })
    // socket.on("status of board", (status) => {
    //     console.log("status of board : ", status);
    //     io.except(socket.id).emit("current board status", status);
    // })

    function Start_Custom_game(room_id) {
        console.log("Start_custom_game started");
        console.log("ongoing games: ", ongoing_game);
        console.log("custom games: ", custom_players);
        if (ongoing_game[`${socket.room_id}`] == undefined) {
            ongoing_game[`${socket.room_id}`] = {
                ...custom_players[`${socket.room_id}`],
                "current_no": 0
            };
        }

        console.log("ongoing games before: ", ongoing_game);
        console.log("custom games before: ", custom_players);
        clear_custom_players();
        console.log("custom_players after", custom_players);
        console.log("ongoing_games after", ongoing_game);
        // no_of_ongoing_games++;
        send_player_name();
        console.log("socket.room_id: ", socket.room_id);
        console.log("current_no: ", current_no);
        // console.log("ongoing_game[socket.room_id][current_no]", ongoing_game[socket.room_id][current_no]);
        // console.log("ongoing_game[socket.room_id][current_no]", ongoing_game[`${socket.room_id}`][`${current_no}`]);
        console.log("ongoing_game[socket.room_id][current_no]", ongoing_game[`${socket.room_id}`]["current_no"]);
        draw_dice(`${player_order[ongoing_game[`${socket.room_id}`]["current_no"]]}`);
    }
    function Start_Game(room_id) {
        console.log("Start_game");
        ongoing_game[`${socket.room_id}`] = {
            ...current_players
        };
        clear_current_players();
        console.log("current_players", current_players);
        console.log("ongoing_games", ongoing_game);
        no_of_ongoing_games++;
        send_player_name();
        console.log("socket.room_id: ", socket.room_id);
        console.log("current_no: ", current_no);
        // console.log("ongoing_game[socket.room_id][current_no]", ongoing_game[socket.room_id][current_no]);
        // console.log("ongoing_game[socket.room_id][current_no]", ongoing_game[`${socket.room_id}`][`${current_no}`]);
        console.log("ongoing_game[socket.room_id][current_no]", ongoing_game[`${socket.room_id}`]["current_no"]);

        draw_dice(`${player_order[ongoing_game[`${socket.room_id}`]["current_no"]]}`);
    }
    function send_player_name() {
        let names = "";
        for (let i = 0; i < 4; i++) {
            let player_name = ongoing_game[`${socket.room_id}`][`${player_order[i]}_name`];
            names = names + `${player_order[i]}-${player_name} `;
        }
        io.to(`${socket.room_id}`).emit("player_names", names);
    }

    function draw_dice(current_color) {
        console.log("Draw_dice : color : ", current_color);
        console.log("socket id = ", socket.id);
        io.to(`${ongoing_game[socket.room_id][current_color]}`).emit('draw_dice', current_color);
        io.to(`${socket.room_id}`).except(ongoing_game[`${socket.room_id}`][`${current_color}`]).emit("current_players_color", current_color);

    }
    function allow_move(current_color) {
        console.log("allow_move run : ", current_color);
        console.log("current no : ", ongoing_game[`${socket.room_id}`]["current_no"]);
        // io.to[current_players[`${player_order[current_no]}`]].emit('allow_move');
        io.to(ongoing_game[`${socket.room_id}`][`${current_color}`]).emit('allow_move', `${player_order[ongoing_game[`${socket.room_id}`]["current_no"]]}`);
    }
    function clear_current_players() {
        Object.keys(current_players).forEach(key => {
            delete current_players[key];
        });
    }
    function clear_custom_players() {
        Object.keys(custom_players).forEach(key => {
            delete custom_players[key];
        });
    }



})

server.listen(80, () => {
    console.log("Server Started");
})