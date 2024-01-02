/**
 *
 * 소코반
 * 1. 맵그리기
 * 2. 플레이어, 이동할 벽돌, 클리어 위치
 * 3. 방향키를 누르면 플레이어 이동시키기
 * 4, 벽돌 밀기
 * **/

let $target = document.getElementById("container");
let $img = document.createElement("img");
let $main = null;
let $goalMain = null;

let map = [];
let goalMap = [];
let mapNum = 1;
let field = null;
let goal = null;

let dir = 0;
let north = 0;
let east = 1;
let south = 2;
let west = 3;

let space = 0;
let wall = 1;
let outOfMap = 2;
let block = 5;
let goalPoint = 7;
let player = 8;

let goalIdx = [];
let curPosY = 0;
let curPosX = 0;

// 스테이지
let stageOne = [
    [2, 2, 1, 1, 1, 2, 2, 2],
    [2, 2, 1, 0, 1, 2, 2, 2],
    [2, 2, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 5, 8, 5, 0, 1],
    [1, 0, 0, 5, 5, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 2, 2],
    [2, 2, 2, 1, 0, 1, 2, 2],
    [2, 2, 2, 1, 1, 1, 2, 2],
];

let stageTwo = [
    [1, 1, 1, 1, 1, 2, 2, 2, 2],
    [1, 8, 0, 0, 1, 2, 2, 2, 2],
    [1, 0, 5, 5, 1, 2, 1, 1, 1],
    [1, 0, 5, 0, 1, 2, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1],
    [2, 1, 1, 0, 0, 0, 0, 0, 1],
    [2, 1, 0, 0, 0, 1, 0, 0, 1],
    [2, 1, 0, 0, 0, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 2, 2, 2],
]

let stageThree = [
    [2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 1, 1, 0, 0, 1, 0, 0, 1],
    [2, 2, 1, 0, 5, 0, 1, 0, 0, 1],
    [2, 2, 1, 0, 5, 0, 0, 8, 0, 1],
    [2, 2, 1, 0, 5, 1, 1, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// 골 포인트만 있는 스테이지
let goalStageOne = [
    [2, 2, 1, 1, 1, 2, 2, 2],
    [2, 2, 1, 7, 1, 2, 2, 2],
    [2, 2, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 7, 1],
    [1, 7, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 2, 2],
    [2, 2, 2, 1, 7, 1, 2, 2],
    [2, 2, 2, 1, 1, 1, 2, 2],
];

let goalStageTwo = [
    [1, 1, 1, 1, 1, 2, 2, 2, 2],
    [1, 0, 0, 0, 1, 2, 2, 2, 2],
    [1, 0, 0, 0, 1, 2, 1, 1, 1],
    [1, 0, 0, 0, 1, 2, 1, 7, 1],
    [1, 1, 1, 0, 1, 1, 1, 7, 1],
    [2, 1, 1, 0, 0, 0, 0, 7, 1],
    [2, 1, 0, 0, 0, 1, 0, 0, 1],
    [2, 1, 0, 0, 0, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 2, 2, 2],
]

let goalStageThree = [
    [2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 1, 1, 0, 0, 1, 0, 0, 1],
    [2, 2, 1, 0, 0, 0, 1, 0, 0, 1],
    [2, 2, 1, 0, 0, 0, 0, 0, 0, 1],
    [2, 2, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 7, 7, 7, 0, 0, 0, 0, 1, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let init = () => {
    $main = document.createElement("table");
    $goalMain = document.createElement("table");
    $main.setAttribute("id", "main");
    $goalMain.setAttribute("id", "goal-main");
    $img.src = "./socoban_img/player_up.png";

    field = map[mapNum];
    goal = goalMap[mapNum];

    for (let i = 0; i < field.length; i++) {
        let $tr = document.createElement("tr");
        for (let j = 0; j < field[i].length; j++) {
            let $td = document.createElement("td");
            if (field[i][j] == space) {
                $td.setAttribute("class", "space");
            } else if (field[i][j] == wall) {
                $td.setAttribute("class", "wall");
            } else if (field[i][j] == outOfMap) {
                $td.setAttribute("class", "out_of_map");
            } else if (field[i][j] == block) {
                $td.setAttribute("class", "block");
            } else if (field[i][j] == player) {
                $td.setAttribute("class", "player");
            }
            $tr.append($td);
        }
        $main.append($tr);
    }

    for (let i = 0; i < goal.length; i++) {
        let $tr = document.createElement("tr");
        for (let j = 0; j < goal[i].length; j++) {
            let $td = document.createElement("td");
            if (goal[i][j] == space) {
                $td.setAttribute("class", "space");
            } else if (goal[i][j] == wall) {
                $td.setAttribute("class", "wall");
            } else if (goal[i][j] == outOfMap) {
                $td.setAttribute("class", "out_of_map");
            } else if (goal[i][j] == goalPoint) {
                $td.setAttribute("class", "goal_point");
            }
            $tr.append($td);
        }
        $goalMain.append($tr);
    }
    $target.append($main);
    $target.append($goalMain);

    let $character = document.querySelector(".player");
    $character.append($img);

    findGoalIdx();
    findPlayer();
}

// 플레이어 인덱스 찾기
let findPlayer = () => {
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j] == player) {
                curPosY = i;
                curPosX = j;
                break;
            }
        }
    }
}

// 골지점 인덱스 찾기
let findGoalIdx = () => {
    for (let i = 0; i < goal.length; i++) {
        for (let j = 0; j < goal[i].length; j++) {
            if (goal[i][j] == goalPoint) {
                goalIdx.push(i);
                goalIdx.push(j);
            }
        }
    }
}


// 오른쪽 회전
let turnRight = () => {
    let character = document.querySelector(".player");

    dir += 1;

    if (dir > west) {
        dir = north;
    }

    if (dir == east) {
        $img.src = "./socoban_img/player_right.png";
        character.append($img);
    } else if (dir == south) {
        $img.src = "./socoban_img/player_down.png";
        character.append($img);
    } else if (dir == west) {
        $img.src = "./socoban_img/player_left.png";
        character.append($img);
    } else if (dir == north) {
        $img.src = "./socoban_img/player_up.png";
    }
}

// 왼쪽 회전
let turnLeft = () => {
    let character = document.querySelector(".player");

    dir -= 1;

    if (dir < north) {
        dir = west;
    }

    if (dir == east) {
        $img.src = "./socoban_img/player_right.png";
        character.append($img);
    } else if (dir == south) {
        $img.src = "./socoban_img/player_down.png";
        character.append($img);
    } else if (dir == west) {
        $img.src = "./socoban_img/player_left.png";
        character.append($img);
    } else if (dir == north) {
        $img.src = "./socoban_img/player_up.png";
    }
}

// 무브 함수
let move = () => {
    if (dir == east || west == dir) {
        moveBlock();
        moveAbleX();
    } else if (dir == north || south == dir) {
        moveBlock();
        moveAbleY();
    }

    if (endCheck()) {
        alert("Stage Clear !!");
        window.location.reload();
    }
}

// 오른쪽 왼쪽
let moveAbleX = () => {
    let tempX = curPosX;
    if (dir === east) {
        tempX += 1;
        if (field[curPosY][tempX] == space){
            field[curPosY][curPosX] = space;
            $main.children[curPosY].children[curPosX].setAttribute("class", "space");

            field[curPosY][tempX] = player;
            $main.children[curPosY].children[tempX].setAttribute("class", "player");
            $main.children[curPosY].children[tempX].append($img);
            curPosX = tempX;
        }
    } else if (dir === west) {
        tempX -= 1;
        if (field[curPosY][tempX] == space) {
            field[curPosY][curPosX] = space;
            $main.children[curPosY].children[curPosX].setAttribute("class", "space");

            field[curPosY][tempX] = player;
            $main.children[curPosY].children[tempX].setAttribute("class", "player");
            $main.children[curPosY].children[tempX].append($img);
            curPosX = tempX;
        }
    }
}

// 위 아래
let moveAbleY = () => {
    let tempY = curPosY;

    if (dir === north) {
        tempY -= 1;

        if (field[tempY][curPosX] == space) {
            field[curPosY][curPosX] = space;
            $main.children[curPosY].children[curPosX].setAttribute("class", "space");

            field[tempY][curPosX] = player;
            $main.children[tempY].children[curPosX].setAttribute("class", "player");
            $main.children[tempY].children[curPosX].append($img);
            curPosY = tempY;
        }
    } else if (dir === south) {
        tempY += 1;

        if (field[tempY][curPosX] == space) {
            field[curPosY][curPosX] = space;
            $main.children[curPosY].children[curPosX].setAttribute("class", "space");

            field[tempY][curPosX] = player;
            $main.children[tempY].children[curPosX].setAttribute("class", "player");
            $main.children[tempY].children[curPosX].append($img);
            curPosY = tempY;
        }
    }
}


// 블럭 이동
let moveBlock = () => {
    let tempY = curPosY;
    let tempX = curPosX;

    if (dir == north) {
        tempY -= 1;
    } else if (dir == east) {
        tempX += 1;
    } else if (dir == south) {
        tempY += 1;
    } else if (dir == west) {
        tempX -= 1;
    }

    if (field[tempY][tempX] == block){
        let check = false;

        let tempBlockY = tempY;
        let tempBlockX = tempX;

        if (dir == north && space == field[tempY - 1][tempX]) {
            check = true;
            tempBlockY -= 1;
        } else if (dir == east && space == field[tempY][tempX + 1]) {
            check = true;
            tempBlockX += 1;
        } else if (dir == south && space == field[tempY + 1][tempX]) {
            check = true;
            tempBlockY += 1;
        } else if (dir == west && space == field[tempY][tempX - 1]) {
            check = true;
            tempBlockX -= 1;
        }

        if (check) {
            field[curPosY][curPosX] = space;
            $main.children[curPosY].children[curPosX].setAttribute("class", "space");

            field[tempY][tempX] = player;
            $main.children[tempY].children[tempX].append($img);
            $main.children[tempY].children[tempX].setAttribute("class", "player");

            field[tempBlockY][tempBlockX] = block;
            $main.children[tempBlockY].children[tempBlockX].setAttribute("class", "block");

            curPosY = tempY;
            curPosX = tempX;
        }
    }
}

// 필드에 블럭이 골 지점에 모두 있는지 확인
let endCheck = () => {
    let check = true;

    for (let i = 0; i < goalIdx.length; i += 2) {
        if (field[goalIdx[i]][goalIdx[i + 1]] != block) {
            check = false;
            break;
        }
    }

    return check;
}

// 키보드 이벤트
window.addEventListener("keydown", function (e) {
    let key = e.key;

    if (key == "ArrowRight") {
        turnRight();
    } else if (key == "ArrowLeft") {
        turnLeft();
    } else if (key == "ArrowDown") {
        move();
    }
});

// 플레이어 맵, 골 맵 셋팅
let setMap = () => {
    map.push(stageOne);
    map.push(stageTwo);
    map.push(stageThree);

    goalMap.push(goalStageOne);
    goalMap.push(goalStageTwo);
    goalMap.push(goalStageThree);
}

// 스테이지 바꾸기
let clickStageOne = () => {
    mapNum = 0;
    let $main = document.getElementById("main");
    let $goalMain = document.getElementById("goal-main");
    if ($main != null) {
        $main.remove();
        $goalMain.remove();
        goalIdx = [];
    }
    init();
}
let clickStageTwo = () => {
    mapNum = 1;
    let $main = document.getElementById("main");
    let $goalMain = document.getElementById("goal-main");
    if ($main != null) {
        $main.remove();
        $goalMain.remove();
        goalIdx = [];
    }
    init();
}
let clickStageThree = () => {
    mapNum = 2;
    let $main = document.getElementById("main");
    let $goalMain = document.getElementById("goal-main");
    if ($main != null) {
        $main.remove();
        $goalMain.remove();
        goalIdx = [];
    }
    init();
}

setMap();
init();





