const socket = io();
console.log("io = ", socket.id);
let player_color = ["blue", "yellow", "green", "red"];
const player_order = ["red", "green", "yellow", "blue"];
let working = false;
let dice = null;
let other_p_dice = null;
let my_color = null;
let my_id;
let custom = false;
let my_room_id;
let my_name;
let status_of_board;
if (sessionStorage.getItem("id") == null) {
    my_id = null;
}
else {
    console.log("sessionStorage.getItem('id'): ", sessionStorage.getItem("id"));
    socket.id = sessionStorage.getItem("id");
    my_room_id = sessionStorage.getItem("room_id");
    console.log("my_room_id: ", my_room_id);
    // socket.room_id = my_room_id;
    socket.emit("update socket data", sessionStorage.getItem("id"), sessionStorage.getItem("room_id"), sessionStorage.getItem("name"));
    // socket.emit("check socket.id", sessionStorage.getItem("id"));
    custom = true;
    // console.log("socket.id after changes: ", socket.id);
    my_name = sessionStorage.getItem("name");
}
// if (sessionStorage.getItem("room_id") == null) {
//     my_room_id = null;
// }
// else {
//     socket.emit("change room_id", sessionStorage.getItem("room_id"));
//     custom = true;
//     console.log("socket.room_id: ", socket.room_id);
// }

if (sessionStorage.getItem("name") == null) {
    my_name = prompt("Enter Your Name: ");
}
// else {
//     console.log("my_name: ", my_name);
//     socket.emit("change name", sessionStorage.getItem("name"));
//     socket.name = my_name;
//     console.log("socket.name : ", socket.name);

// }
let current_players_color = null;
let current_dice_value = null;

Create_board();
function Create_board() {
    console.log("Yo");
    for (let i = 0; i < 4; i++) {
        let k = 4, l = 1;
        let middle_path = document.getElementById(`middle_path_${i + 1}`);
        for (let j = 0; j < 18; j++) {
            let square = document.createElement("div");
            square.setAttribute("class", "square");
            square.setAttribute("data-pos", `${i},${j}`);
            square.setAttribute("id", `${i},${j}`);
            square.setAttribute("data-next", `${get_next_pos(i, j)}`);
            if (safe_satus(i, j)) { square.setAttribute("data-safe", `${safe_satus(i, j)}`) };
            if (colored_square(i, j)) { square.setAttribute("class", `square ${colored_square(i, j)}_square`) };
            // square.innerHTML = `(${i},${j})`
            middle_path.appendChild(square);
            let nxt_pos = get_next_pos(i, j);
        }
        // console.log(middle_path);
    }
    put_all_pieces();
}

function get_next_pos(i, j) {
    if (i == 1 || i == 3) {
        if (j < 5) {
            return `${i},${j + 1}`; // 0 -4
        }
        else if (j > 12) {
            return `${i},${j - 1}`; // 17-13
        }
        else if (i == 1 && j == 6) {
            return `${i},0`;
        }
        else if (i == 1 && j == 12) {
            return `${i},6`;
        }
        else if (i == 3 && j == 5) {
            return `${i},11`;
        }
        else if (i == 3 && j == 11) {
            return `${i},17`;
        }
        else if (i == 1 && j == 5) {
            return `${i + 1},5`;
        }
        else if (i == 3 && j == 12) {
            return `0,12`;
        }
        else {
            if (i == 1) {
                if (j == 11) { return `Home` }
                return `${i},${j + 1}`
            }
            else {
                if (j == 6) { return `Home` }
                return `${i},${j - 1}`
            }
        }

    }
    else if (i == 2 || i == 0) {
        if (j <= 5 && j > 0) {
            return `${i},${j - 1}`; // 0 -4
        }
        else if (j >= 12 && j < 17) {
            return `${i},${j + 1}`; // 17-13
        }
        else if (i == 2 && j == 0) {
            return `${i},6`;
        }
        else if (i == 2 && j == 6) {
            return `${i},12`;
        }
        else if (i == 0 && j == 17) {
            return `${i},11`;
        }
        else if (i == 0 && j == 11) {
            return `${i},5`;
        }
        else if (i == 0 && j == 0) {
            return `${i + 1},17`;
        }
        else if (i == 2 && j == 17) {
            return `3,0`;
        }
        else {
            if (i == 0) {
                if (j == 6) { return `Home` }
                return `${i},${j - 1}`
            }
            else {
                if (j == 11) { return `Home` }
                return `${i},${j + 1}`
            }
        }
    }
}
function safe_satus(i, j) {
    if (i == 1 || i == 3) {
        if (j == 7 || j == 8 || j == 9 || j == 10) { return `all` }
        else if (i == 1) {
            if (j == 1 || j == 14 || j == 11) { return `all` }
        }
        else if (i == 3) {
            if (j == 16 || j == 3 || j == 6) { return `all` }
        }
    }
    else if (i == 2 || i == 0) {
        if (j == 7 || j == 8 || j == 9 || j == 10) { return `all` }
        else if (i == 2) {
            if (j == 13 || j == 2 || j == 11) { return `all` }
        }
        else if (i == 0) {
            if (j == 4 || j == 15 || j == 6) { return `all` }
        }
    }
}
function colored_square(i, j) {
    if (i == 1 || i == 3) {
        if (j == 7 || j == 8 || j == 9 || j == 10) { return `${player_color[i]}` }
        else if (i == 1) {
            if (j == 1 || j == 11) { return `${player_color[i]}` }
        }
        else if (i == 3) {
            if (j == 16 || j == 6) { return `${player_color[i]}` }
        }
    }
    else if (i == 2 || i == 0) {
        if (j == 7 || j == 8 || j == 9 || j == 10) { return `${player_color[i]}` }
        else if (i == 2) {
            if (j == 13 || j == 11) { return `${player_color[i]}` }
        }
        else if (i == 0) {
            if (j == 4 || j == 6) { return `${player_color[i]}` }
        }
    }
}
function put_all_pieces() {
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j <= 4; j++) {
            let position = document.getElementById(`${player_color[i]}_piece_${j}_locked`);
            let piece = document.createElement("div");
            piece.setAttribute("data-piece", `${player_color[i]}_piece_${j}`);
            piece.setAttribute("data-color", `${player_color[i]}`);
            piece.setAttribute("id", `${player_color[i]}_${j}`);
            piece.setAttribute("class", `piece ${player_color[i]}_piece`);

            //             piece.setAttribute("onclick", `setInterval(() => {
            //     console.log("yo");
            //     move(1, ${player_color[i]}_${j});
            // }, 500);`);
            position.appendChild(piece);
        }
    }
}

function update_board(status) {
    let piece_data = status.split(" ");
    console.log("update board : ", piece_data);
    console.log("pos length: ", piece_data.length);
    for (let i = 0; i <= piece_data.length - 2; i++) {
        // console.log(pos[i]);
        console.log(piece_data[`${i}`], `${i}`);
        let piece_address = piece_data[`${i}`].split("-")[0];
        let pos_address = piece_data[`${i}`].split("-")[1];
        console.log(`piece : ${piece_address}, pos : ${pos_address}`);
        let piece = document.getElementById(`${piece_address}`);
        let pos = document.getElementById(`${pos_address}`);
        pos.appendChild(piece);
    }
}
function show_name(color, name) {
    let display = document.getElementById(`${color}_player_name`);
    display.innerHTML = name;
}


//Move Functions Below
function move(value, piece) {
    console.log("move : ", value, piece);
    if (value == null) {
        console.log("null");
        return;
    }
    else {
        console.log((piece.parentNode.getAttribute("data-pos")));
        if (piece.parentNode.getAttribute("data-pos").endsWith("locked")) {
            if (value == 6) {
                move_by_one(piece, 0);
                send_status_of_board();
                remove_piece_animation(my_color);
                dice = null;
                socket.emit("extra chance for 6,death or home", my_color);
                return;
            }
            else {
                send_status_of_board();
                return;
            }
        }
        else if (working === false) {
            working === true;
            let i = value;
            let id = setInterval(() => {
                console.log(i);
                if (i <= 0) {
                    clearInterval(id);
                } else {
                    if (i == 1) {
                        move_by_one(piece, true);
                        remove_piece_animation(my_color);
                        send_status_of_board();
                        if (value == 6) {
                            socket.emit("extra chance for 6,death or home", my_color);
                            dice = null;
                            console.log("if");
                        }
                        else {
                            console.log("else");
                            socket.emit("next_turn", my_color);
                            dice = null;
                        }

                    }
                    else {
                        move_by_one(piece, false);
                    }
                }
                i--;
                // async
            }, 200);
        }
    }
    // if(value == 6){
    //     console.log("value == 6 , So one more try");
    //     socket.emit("draw")
    // }
    remove_blink_piece_animation(my_color);
    working == false;
    value == null;    // }

}

function move_by_one(piece, death) {
    let next_pos;
    let current_pos = piece.parentNode;
    let current_pos_address = piece.parentNode.getAttribute("data-pos");
    let color = piece.getAttribute("data-color");
    let next_pos_address = current_pos.getAttribute("data-next");
    if ((next_pos_address == "1,11") || (next_pos_address == "0,6") || (next_pos_address == "2,11") || (next_pos_address == "3,6")) {
        if (next_pos_address) { }
    }
    if ((current_pos_address == "0,11" && color == "blue") || (current_pos_address == "1,6" && color == "yellow") || (current_pos_address == "2,6" && color == "green") || (current_pos_address == "3,11" && (color == "red"))) {
        if (current_pos_address == "0,11" && color == "blue") {
            next_pos = document.getElementById("0,10");
        }
        else if (current_pos_address == "1,6" && color == "yellow") {
            next_pos = document.getElementById("1,7");
        }
        else if (current_pos_address == "2,6" && color == "green") {
            next_pos = document.getElementById("2,7");
        }
        else if (current_pos_address == "3,11" && (color == "red")) {
            next_pos = document.getElementById("3,10");
        }
    }
    else {
        next_pos = document.getElementById(next_pos_address);
    }
    if (next_pos.hasChildNodes()) {
        console.log("hasChildNodes");
        if (next_pos.hasAttribute("data-safe")) {
            next_pos.appendChild(piece);
            console.log("hasChildNodes1");
        }
        else {
            console.log("hasChildNodes2");

            console.log("next_pos.childElementCount = " + next_pos.childElementCount);
            let ex_piece = next_pos.firstChild;
            if (ex_piece.getAttribute("data-piece").startsWith(piece.getAttribute("data-color"))) {
                next_pos.appendChild(piece);
                console.log("Same_piece");
            }
            else {
                console.log("dead : ", death);
                if (death == true) {
                    while (next_pos.childNodes.length != 0) {
                        let dead_piece = next_pos.childNodes[0];
                        let locked_pos = document.getElementById(`${dead_piece.getAttribute("data-piece")}_locked`);
                        locked_pos.appendChild(dead_piece);
                        // if (!next_pos.hasChildNodes) { break; }
                    }
                    remove_piece_animation(my_color);
                    socket.emit("extra chance for 6,death or home", my_color);
                }
                console.log("append");
                next_pos.appendChild(piece);

            }
        }
    }
    else {
        next_pos.appendChild(piece);
    }
    send_status_of_board();


}

function send_status_of_board() {
    status_of_board = get_status_of_board();
    // console.log("status_of_board : ", status_of_board);
    socket.emit("status of board", status_of_board);
}
function pause(time) {
    let old_time = new Date;
    while ((new Date) - old_time <= time) { }
}
function get_status_of_board() {
    let status = "";
    for (let i = 0; i < 4; i++) {
        let c = player_order[i];
        for (let j = 1; j <= 4; j++) {
            piece = document.getElementById(`${c}_${j}`);
            status = status + `${c}_${j}-${piece.parentNode.getAttribute("data-pos")} `;

        }
    }
    // console.log("status : ", status);
    return status;
}
function show_dice_value(color) {
    console.log("show_dice_value : ", color);
    let value = Math.floor(Math.random() * 6) + 1;
    let display = document.getElementById(`${color}_random_num`);
    console.log("display", display);
    let btn = document.getElementById(`${color}_random_btn`);
    dice = value;
    display.innerText = `${value}`;
    btn.removeAttribute("onclick");
    let no = null;
    switch (color) {
        case "red": no = 4;
            break;
        case "green": no = 3;
            break;
        case "yellow": no = 2;
            break;
        case "blue": no = 1;
            break;
        default: no = null;
            break;
    }
    let player_area_color = document.getElementById(`player_container_${no}`)
    remove_background_animation(player_area_color);
    remove_blink_animation(btn);
    remove_blink_animation(display);
    // piece.setAttribute("onclick", `move(${dice},${player_color[i]}_${j})`);
    socket.emit("dice_value", value);
    // allow_move(color);
}
function remove_dice_value(color) {
    let p_color;
    if (color == "red") {
        p_color = "blue";
    }
    else if (color == "green") {
        p_color = "red";
    }
    else if (color == "yellow") {
        p_color = "green";
    }
    else if (color == "blue") {
        p_color = "yellow";
    }
    setTimeout(() => {
        let display = document.getElementById(`${p_color}_random_num`);
        display.innerHTML = "";
    }, 2000);
}
function clear_all_dice_value() {
    console.log("clear_all_dice_value");
    for (let i = 0; i < 4; i++) {
        document.getElementById(`${player_color[i]}_random_num`).innerText = "";
    }
}
function remove_piece(color) {
    console.log("remove_piece received", color);
    for (let i = 0; i < 4; i++) {
        let piece = document.getElementById(`${color}_${i + 1}`);
        console.log("remove_piece : ", piece);
        piece.style.display = "none";
    }

}

function add_blink_animation(box) {
    console.log("add_blink_animation");
    console.log("box =  ", box);
    box.classList.add("blink_animation");
}
function add_blink_piece_animation(color) {
    console.log("add_blink_piece_animation called");
    for (let i = 1; i <= 4; i++) {
        let piece = document.getElementById(`${color}_${i}`);
        piece.classList.add("blink_animation");
    }
}

function remove_blink_piece_animation(color) {
    console.log("remove_blink_piece_animation called");
    for (let i = 1; i <= 4; i++) {
        let piece = document.getElementById(`${color}_${i}`);
        piece.classList.remove("blink_animation");
    }
}
function add_background_animation(box) {
    console.log("add_background_animation");
    box.classList.add("background_animation");
}
function remove_blink_animation(box) {
    console.log("remove_blink_animation");
    box.classList.remove("blink_animation");
}
function remove_piece_animation(color) {
    console.log("remove_piece_animation, color =", color);
    for (let i = 1; i <= 4; i++) {
        let piece = document.getElementById(`${color}_${i}`);
        piece.classList.remove("big-small_animation");
    }
}
function remove_background_animation(box) {
    console.log("remove_background_animation");
    box.classList.remove("background_animation");
}
function check_for_locked_pieces() {
    let ans = 0;
    for (let i = 1; i <= 4; i++) {
        let piece = document.getElementById(`${my_color}_${i}`);
        if (piece.parentNode.getAttribute("data-pos").endsWith("locked")) {
            ans++;
        };
    }
    return ans;
};
function add_outline_animation(color) {
    console.log("color = ", color);
    
    let player_area = document.getElementById(`player_container_${ player_color.indexOf(`${color}`) + 1 }`);
    // console.log("index ofplayer_color[`${color}`] = ", player_color.indexOf(`${color}`));
    // console.log("index ofplayer_order[`${color}`] = ", player_color.indexOf(`${color}`));
    console.log("player_area = ", player_area);
    if (player_area.classList != null) {
        player_area.classList.add("outline_animation");
    }
    else {
        player_area.setAttribute("class", "outline_animation");
    }
}
function remove_outline_animation(color) {
    console.log("color = ", color);
    let prev_color;
    if (color == "red") {
        prev_color = "blue";
    }
    else {
        prev_color = player_order[player_order.indexOf(`${color}`) - 1];
    }
    console.log("prev_color = ", prev_color);
    let player_area = document.getElementById(`player_container_${ player_color.indexOf(`${prev_color}`) + 1 }`);
    // console.log("index ofplayer_color[`${color}`] = ", player_color.indexOf(`${color}`));
    // console.log("index ofplayer_order[`${color}`] = ", player_color.indexOf(`${color}`));
    console.log("player_area = ", player_area);
    if (player_area.classList != null) {
        player_area.classList.remove("outline_animation");
    }
}

function remove_player(color) {
    let left_player = document.getElementById(`${color}_player_name`);
    let name = left_player.innerText;
    alert(`${name} has left the game`);
    console.log("name: ", name);
    left_player.innerText = "";
    remove_piece(color);
}
//Player Cards Function Below
if (custom == false) {
    socket.emit("my_name", my_name);
}
else {
    socket.emit("init custom game", my_room_id);
}

socket.on("player_color", (color) => {
    my_color = color;
    console.log(color);
    // show_name(color);
});

console.log("my_color", my_color);

socket.on("player_names", (all_names) => {
    console.log("Players name request received: ", all_names);
    names = all_names.split(" ");
    let game_page = document.getElementById("Game_page");
    let loading_page = document.getElementById("Loading_page");
    game_page.style.display = "block";
    loading_page.style.display = "none";
    for (let i = 0; i <= names.length - 2; i++) {
        p_color = names[i].split("-")[0];
        p_name = names[i].split("-")[1];
        console.log(`p_color = ${p_color} p_name = ${p_name}`);
        show_name(p_color, p_name);
    }
})

socket.on("draw_dice", (color) => {
    remove_outline_animation(color);
    clear_all_dice_value();
    console.log("draw_dice color: ", color);
    if (color == my_color) {
        let no = null;
        let btn = document.getElementById(`${color}_random_btn`);
        let display = document.getElementById(`${color}_random_num`);
        switch (color) {
            case "red": no = 4;
                break;
            case "green": no = 3;
                break;
            case "yellow": no = 2;
                break;
            case "blue": no = 1;
                break;
            default: no = null;
                break;
        }
        let player_area_color = document.getElementById(`player_container_${no}`)
        // if (color == my_color) {
        add_blink_animation(btn);
        add_background_animation(player_area_color);
        add_blink_animation(display);
        // player_box.classList.add("blink_animation");
        btn.setAttribute("onclick", `show_dice_value("${color}")`);
        // }
        // else {
        //     btn.classList.add("border_animation");
        //     player_box.classList.add("border_animation");
        // }

        // console.log("draw dice");
    }


})
socket.on("allow_move", (color) => {
    console.log("allow move receiveed");
    let h = check_for_locked_pieces();
    if (h == 4 && dice < 6) {
        socket.emit("next_turn", my_color);
        return;
    }
    add_blink_piece_animation(color);
    console.log("allow_move : color =", color);
    if (color == my_color) {
        for (let i = 1; i <= 4; i++) {
            console.log(`${color}_${i}  && move(${dice},${color}_${i})`);
            piece = document.getElementById(`${color}_${i}`);
            // piece.style.border = "none";
            // if (piece.parentNode.getAttribute("data-pos").endsWith("locked")) {
            //     locket_p++;
            // }
            piece.setAttribute("onclick", `move(dice,${color}_${i})`);
            // if(piece.parentNode.getAttribute("data-pos") == ){};
            if (color == my_color) {
                piece.classList.add("big-small_animation");
            }
        }
        // socket.emit("moved_piece", "(1,2)");
    }
})
socket.on("current board status", (status) => {
    console.log("current board status");
    update_board(status);
})

socket.on("current_dice_value", (value) => {
    current_dice_value = value;
    let p_color = value.split("_")[0], p_value = value.slice(value.indexOf("_") + 1);
    console.log("current_dice_value");
    console.log(value, " = ", p_color, " : ", p_value);
    let dicee = document.getElementById(`${p_color}_random_num`);
    dicee.innerText = p_value;
    // allow_move(p_color);
})
socket.on("current_players_color", async(color) => {
    setTimeout(() => {
        clear_all_dice_value();
    }, 2000);
    remove_outline_animation(color);
    add_outline_animation(color);
    current_players_color = color;
})

socket.on("add pieces", (color,status) => {
    console.log("add_piece received", color);
    for (let i = 0; i < 4; i++) {
        let piece = document.getElementById(`${color}_${i + 1}`);
        console.log("add_piece : ", piece);
        if(piece.style.display = "none"){
            piece.style.display = "flex";
        }
    }
    update_board(status);
})

socket.on("player_disconnected", (color) => {
    console.log("player_disconnected color: ", color);
    remove_player(color);
})


