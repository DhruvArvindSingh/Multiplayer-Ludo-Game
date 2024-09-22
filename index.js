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
// const home =  require("../Client/views/home.ejs");

// import { Start_Game, draw_dice, allow_move } from "./routes/Board_func.js";
//below line actually lets us use ejs file for views folder
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

//below line actually lets us use different css and js file for views folder
app.use(express.static(path.join(__dirname, "public")));

let check_custom_players = {};
let online_players = {};
let current_players = {};
let custom_players = {};
let ongoing_game = {};
let no_of_ongoing_games = 0;
let no_of_ongoing_custom_games = 0;

app.use((req, res, next) => {
    // console.log("req:", req);
    // console.log("\n\n\n");
    console.log("req_method:", req.method);
    console.log("req.path = :", req.path);
    console.log("req.date = :", req.date);
    console.log("req.timestamp = :", req.timestamp);
    next();
})

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
    console.log("socket.id = ", socket.id + " connected");
    socket.on("update socket data", (id, room_id, name) => {
        socket.room_prev_id = `${room_id}_home`;
        socket.room_id = `${room_id}_home`;
        socket.name = name;
        console.log("Custom players before update: ", custom_players);
        console.log("socket data before updated: ", socket);
        for (let i = 0; i < 4; i++) {
            console.log("custom_players[`${room_id}`][`${player_order[i]}`] = ", custom_players[`${socket.room_prev_id}`][`${player_order[i]}`]);
            console.log("id = ", id);
            socket.join(`${socket.room_prev_id}`);
            if (custom_players[`${socket.room_prev_id}`][`${player_order[i]}`] == id) {
                console.log("if statement worked");
                let ob = check_custom_players[`${room_id}`];
                console.log("ob = ", ob);
                if (ob == undefined) {
                    check_custom_players[`${room_id}`] = [player_order[i]];
                }
                else {
                    check_custom_players[`${room_id}`] = [...ob, player_order[i]];
                }
                console.log("check_custom_players: ", check_custom_players);
                custom_players[`${socket.room_prev_id}`][`${player_order[i]}`] = socket.id;
                custom_players[`${socket.room_prev_id}`][`${player_order[i]}_name`] = name;
            }
        }
        // console.log("socket data updated: ", socket.id);
        console.log("Custom players after update: ", custom_players);
        ob = check_custom_players[`${room_id}`];
        console.log("ob before check = ", ob);
        console.log("player_order before check = ", player_order);
        check_count = 0;
        for (let i = 0; i < 4; i++) {
            if (ob.includes(player_order[i])) {
                console.log("condition satisfied");
                check_count++;
            }
        }
        console.log("check_count = ", check_count);
        if (check_count == 4) {
            console.log("check_custom_players[`${room_id}`] = ", check_custom_players[`${room_id}`]);
            console.log("player_order = ", player_order);
            Start_Custom_game(socket.room_prev_id);
        }
        else {
            check_count = 0
        }

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
        console.log("online players before: ", online_players);
        let need_a_player = false;
        let need_a_player_id = null;
        // () => {
        if (Object.keys(ongoing_game).length != 0) {

            for (let key in ongoing_game) {
                console.log("key = ", key);
                console.log("ongoing_game[key] = ", ongoing_game[`${key}`]);
                console.log("ongoing_game[key].length = ", Object.keys(ongoing_game[`${key}`]).length);
                if (Object.keys(ongoing_game[`${key}`]).length < 9) {
                    need_a_player = true;
                    need_a_player_id = key;
                    break;
                }
            }
        }
        console.log("need_a_player = ", need_a_player);
        // }
        if (need_a_player == true) {
            console.log("return true for if statement");
            let color;
            for (let i = 0; i < 4; i++) {
                console.log("ongoing_game[`${need_a_player_id}`][`${player_order[i]}`] = ", ongoing_game[`${need_a_player_id}`][`${player_order[i]}`]);
                if (ongoing_game[`${need_a_player_id}`][`${player_order[i]}`] == undefined) {
                    color = player_order[i];
                    break;
                }
            }
            ongoing_game[`${need_a_player_id}`][`${color}`] = socket.id;
            ongoing_game[`${need_a_player_id}`][`${color}_name`] = name;
            socket.emit("player_color", "blue");
            socket.room_id = need_a_player_id;
            socket.join(`${need_a_player_id}`);
            socket.name = name;
            socket.color = color;
            send_player_name();
            // io.to(`${need_a_player_id}`).emit("show new players", ongoing_game[`${need_a_player_id}`], need_a_player_id);
            io.to(`${need_a_player_id}`).except(`${socket.id}`).emit("player added", ongoing_game[`${need_a_player_id}`]);
            io.to(`${need_a_player_id}`).except(`${socket.id}`).emit("add pieces", color);
            need_a_player = false;
        }
        else {



            if (!current_players.red) {
                current_players.red = socket.id;
                current_players.red_name = name;
                console.log("red");
                socket.color = "red";
                socket.room_id = no_of_ongoing_games + 1;
                online_players[`${socket.id}`] = `${socket.room_id}`;
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
                online_players[`${socket.id}`] = `${socket.room_id}`;
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
                online_players[`${socket.id}`] = `${socket.room_id}`;
                socket.join(`${no_of_ongoing_games + 1}`);
                // socket.join(`yellow_player`);
                socket.emit("player_color", "yellow");
            }
            else if (!current_players.blue) {
                current_players.blue = socket.id;
                // current_players.game_id = current_players.red;
                current_players.blue_name = name;
                console.log("blue");
                socket.room_id = no_of_ongoing_games + 1;
                online_players[`${socket.id}`] = `${socket.room_id}`;
                // for (let i = 0; i < 4; i++) {
                //     io.to[current_players[`${player_order[i]}`]].join(`${no_of_ongoing_games + 1}`);
                // }
                socket.join(`${no_of_ongoing_games + 1}`);
                socket.color = "blue";
                // socket.join(`blue_player`);
                // ongoing_game.push({ ...current_players });
                console.log("ongoing_game", ongoing_game);
                current_players.current_no = 0;
                console.log("current_players", current_players);
                // clear_current_players();
                socket.emit("player_color", "blue");
                no_of_ongoing_games++;
                Start_Game(no_of_ongoing_games);
            }
            console.log("online players after: ", online_players);
        }
    })
    // socket.on("join_room", (my_color) => {
    //     socket.join("Game_room");
    //     socket.join(`${my_color}_player`);
    // });
    socket.on("join room", (room_id, name) => {

        console.log("join room request received with id: ", room_id);
        console.log("custom_players before = ", custom_players);
        console.log("online players before : ", online_players);
        if (custom_players[`${room_id}_home`] != undefined) {
            socket.name = name;
            socket.room_id = `${room_id}_home`;
            online_players[`${socket.id}`] = `${socket.room_id}`;
            console.log("player added to room: ", socket.room_id);
            if (custom_players[`${socket.room_id}`]["green"] == undefined) {
                custom_players[`${socket.room_id}`]["green"] = `${socket.id}`;
                custom_players[`${socket.room_id}`]["green_name"] = `${socket.name}`;
                socket.color = "green";
                socket.host = false;
                socket.join(`${socket.room_id}`);
                console.log("socket.room_id: ", socket.room_id);
                socket.emit("show players", custom_players[`${socket.room_id}`], room_id);
                io.to(`${socket.room_id}`).emit("player added", custom_players[`${socket.room_id}`]);
            }
            else if (custom_players[`${socket.room_id}`]["yellow"] == undefined) {
                custom_players[`${socket.room_id}`]["yellow"] = `${socket.id}`;
                custom_players[`${socket.room_id}`]["yellow_name"] = `${socket.name}`;
                socket.color = "yellow";
                socket.host = false;
                socket.join(`${socket.room_id}`);
                socket.emit("show players", custom_players[`${socket.room_id}`], room_id);
                io.to(`${socket.room_id}`).emit("player added", custom_players[`${socket.room_id}`]);
            }
            else if (custom_players[`${socket.room_id}`]["blue"] == undefined) {
                custom_players[`${socket.room_id}`]["blue"] = `${socket.id}`;
                custom_players[`${socket.room_id}`]["blue_name"] = `${socket.name}`;
                socket.color = "blue";
                socket.host = false;
                socket.join(`${socket.room_id}`);
                socket.emit("show players", custom_players[`${socket.room_id}`], room_id);
                socket.to(`${socket.room_id}`).emit("player added", custom_players[`${socket.room_id}`]);
                // for (let i = 0; i < 4; i++) {

                // }
                io.to(`${room_id}_home`).emit("copy id to local storage");
                io.to(`${room_id}_home`).emit("Start custom game");
                // io.sockets.in(`${room_id}`).leave(`${room_id}`)
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
        console.log("online players after: ", online_players);
        console.log("custom_players after = ", custom_players);

    })

    const player_order = ["red", "green", "yellow", "blue"];

    socket.on("create_room", (name) => {
        // console.log()
        console.log("ongoing_game = ", ongoing_game);
        console.log("online players before: ", online_players);
        socket.room_id = `${no_of_ongoing_custom_games + 1}_home`;
        online_players[`${socket.id}`] = `${socket.room_id}`;
        socket.name = name;
        socket.color = "red";
        socket.join(`${no_of_ongoing_custom_games + 1}_home`);
        console.log("Create room created = ", socket.room_id);
        no_of_ongoing_custom_games++;
        socket.host = true;
        console.log("no_of_ongoing_custom_games = ", no_of_ongoing_custom_games);
        console.log("socket.room_id = ", socket.room_id);
        custom_players[`${socket.room_id}`] = {
            ...custom_players[`${socket.room_id}`], "red": `${socket.id}`, "red_name": `${socket.name}`
        };
        console.log("custom_players = ", custom_players);
        socket.emit("create_room_id", no_of_ongoing_custom_games);
        console.log("online players after: ", online_players);
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
        ongoing_game[`${socket.room_id}`]["status_of_board"] = status;
        io.to(`${socket.room_id}`).emit("current board status", status);
    })
    socket.on("extra chance for 6,death or home", (color) => {
        console.log("socket.name = ", socket.name);
        console.log("extra chance for 6,death or home : ", color);
        socket.emit("draw_dice", color);

    })
    socket.on("leave_room", (room_id) => {
        console.log("online players before update: ", online_players);
        console.log("leave room request received with id: ", socket.id + " and room_id = ", room_id);
        socket.leave(`${online_players[`${socket.id}`]}`);
        delete online_players[`${socket.id}`];

        console.log("online players after update: ", online_players);
    })
    socket.on("disconnect", () => {
        // console.log("socket.color = ", socket.color);
        // console.log("socket.name = ", socket.name);
        console.log("socket.id = ", socket.id + "------ disconnected");
        console.log("online_players[`${socket.id}`]: ", online_players[`${socket.id}`]);
        if (online_players[`${socket.id}`] != undefined) {
            // () => {
            // console.log("if statement worked");
            console.log("ongoing_game before= ", ongoing_game);
            console.log("socket.room_id ", socket.room_id);
            console.log("socket.color= ", socket.color);
            socket.leave(`${online_players[`${socket.id}`]}`);
            let o = player_disconnected(socket.id);
            delete online_players[`${socket.id}`];
            for (let key in current_players) {
                if (current_players[`${key}`] == socket.id) {
                    console.log("current_players contains disconnected player: ", current_players[`${key}`]);
                    delete current_players[`${key}`];
                    delete current_players[`${key}_name`];
                    break;
                }

            }
            if (ongoing_game[`${socket.room_id}`] != undefined) {
                delete ongoing_game[`${socket.room_id}`][`${socket.color}`];
                delete ongoing_game[`${socket.room_id}`][`${socket.color}_name`];
            }
            console.log("ongoing_game after = ", ongoing_game);
            console.log("current_players after = ", current_players);
            // }

        };
    })
    // socket.on("status of board", (status) => {
    //     console.log("status of board : ", status);
    //     io.except(socket.id).emit("current board status", status);
    // })

    function Start_Custom_game(room_id) {
        // io.sockets.clients(`${room_id}`).forEach(function (s) {
        //     console.log(`socket clients ${room_id} = `, s.id);
        // });
        console.log("Start_custom_game started");
        console.log("ongoing games: ", ongoing_game);
        console.log("custom games: ", custom_players);
        if (ongoing_game[`${socket.room_id}`] == undefined) {
            ongoing_game[`${socket.room_id}`] = {
                ...custom_players[`${socket.room_prev_id}`],
                "current_no": 0
            };
        }
        clear_custom_players();
        // console.log("ongoing games before: ", ongoing_game);
        // console.log("custom games before: ", custom_players);
        console.log("custom_players after", custom_players);
        console.log("ongoing_games after", ongoing_game);
        // no_of_ongoing_games++;
        send_custom_player_color(socket.room_id);
        send_player_name();
        console.log("socket.room_id: ", socket.room_id);
        console.log("socket.room_prev_id: ", socket.room_prev_id);
        console.log("current_no: ", current_no);
        // console.log("ongoing_game[socket.room_id][current_no]", ongoing_game[socket.room_id][current_no]);
        // console.log("ongoing_game[socket.room_id][current_no]", ongoing_game[`${socket.room_id}`][`${current_no}`]);
        console.log("ongoing_game[socket.room_id][current_no]", ongoing_game[`${socket.room_id}`]["current_no"]);
        draw_dice(`${player_order[ongoing_game[`${socket.room_id}`]["current_no"]]}`);
    }
    function Start_Game(room_id) {
        console.log("Start_game");
        console.log("room_id = ", room_id);
        ongoing_game[`${room_id}`] = {
            ...current_players
        };

        clear_current_players();
        console.log("current_players", current_players);
        console.log("ongoing_games", ongoing_game);
        // no_of_ongoing_games++;
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
    function send_custom_player_color(room_id) {
        console.log("send_custom_player_color");
        for (let i = 0; i < 4; i++) {
            io.to(`${ongoing_game[`${room_id}`][`${player_order[i]}`]}`).emit("player_color", player_order[i]);
        }

    }
    function player_disconnected(id) {
        console.log("player_disconnected");
        io.to(`${online_players[`${id}`]}`).emit("player_disconnected", socket.color);
        return 1;
    }



})

server.listen(80, () => {
    console.log("Server Started");
})