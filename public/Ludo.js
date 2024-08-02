let player_color = ["blue", "yellow", "green", "red"];
let working = false;
let dice = null;
let my_color = null;
let my_name = prompt("Please enter your name: ");
const socket = io();
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


//Move Functions Below
function move(value, piece, death) {
    if (value == null) {
        console.log("null");
        return;
    }
    else {
        console.log((piece.parentNode.getAttribute("data-pos")));
        if (piece.parentNode.getAttribute("data-pos").endsWith("locked")) {
            if (value == 6) {
                move_by_one(piece, 0);
            }
            else {
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
    working == false;
    value == null;    // }

}

function move_by_one(piece, death) {
    let next_pos;
    let current_pos = piece.parentNode;
    let current_pos_address = piece.parentNode.getAttribute("data-pos");
    let color = piece.getAttribute("data-color");
    let next_pos_address = current_pos.getAttribute("data-next");
    if ((current_pos_address == "0,11" && color == "blue") || (current_pos_address == "1,6" && color == "yellow") || (current_pos_address == "2,6" && color == "green") || (current_pos_address == "3,11" && color == "red")) {
        if (current_pos_address == "0,11" && color == "blue") {
            next_pos = document.getElementById("0,10");
        }
        else if (current_pos_address == "1,6" && color == "yellow") {
            next_pos = document.getElementById("1,7");
        }
        else if (current_pos_address == "2,6" && color == "green") {
            next_pos = document.getElementById("2,7");
        }
        else if (current_pos_address == "3,11" && color == "red") {
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

            console.log(next_pos.childElementCount);
            let ex_piece = next_pos.firstChild;
            if (ex_piece.getAttribute("data-piece").startsWith(piece.getAttribute("data-color"))) {
                next_pos.appendChild(piece);
                console.log("Same_piece");
            }
            else {
                console.log("dead", death);
                if (death == true) {
                    while (next_pos.childNodes.length != 0) {
                        let dead_piece = next_pos.childNodes[0];
                        let locked_pos = document.getElementById(`${dead_piece.getAttribute("data-piece")}_locked`);
                        locked_pos.appendChild(dead_piece);
                        // if (!next_pos.hasChildNodes) { break; }
                    }
                }
                console.log("append");
                next_pos.appendChild(piece);

            }
        }
    }
    else {
        next_pos.appendChild(piece);

    }
}

function pause(time) {
    let old_time = new Date;
    while ((new Date) - old_time <= time) { }
}
function allow_move(color) {
    for (let i = 0; i < 4; i++) {
        piece = document.getElementById(`${color}_${i}`);
        piece.setAttribute("onclick", `move(${dice},${player_color[i]}_${i})`);
        if(color == my_color){
            piece.classList.add("rotating-border", "rotating-border--black-white", "rotating-border--reverse");
        }
    }

}

function show_dice_value(color) {
    let value = Math.floor(Math.random() * 6) + 1;
    let display = document.getElementById(`${color}_dice_value`);
    dice = value;
    display.innerText = value;
    piece.setAttribute("onclick", `move(${dice},${player_color[i]}_${j})`);
    socket.emit("dice_value", value);
    allow_move(color);
}


//Player Cards Function Below

socket.on("player_color", (color) => {
    my_color = color;
    console.log(color);
    // show_name(color);
});

socket.emit("my_name", my_name);

console.log("my_color", my_color);

socket.on("draw_dice", (color) => {
    let btn = document.getElementById(`${color}_random_btn`);
    let player_box = document.getElementById(`${color}_details`);
    if (color == my_color) {
        btn.classList.add("blink_animation");
        player_box.classList.add("blink_animation");
        btn.setAttribute("onclick", `show_dice_value(${color})`);
    }
    else {
        btn.classList.add("border_animation");
        player_box.classList.add("border_animation");
    }

    console.log("draw dice");


})
socket.on("allow_move", () => {
    console.log("allow_move");
    socket.emit("moved_piece", "(1,2)");
})



