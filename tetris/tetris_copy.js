let row = 22; // 세로
let col = 12; // 가로
let dataList = []; // 테트리스 블럭 저장 리스트
let colorList = ["white", "green", "red", "purple", "orange", "blue", "yellow", "skyblue", "gray", "black"];

// 자주 사용하는 값을 상수화
const WHITE = 0;
const GRAY = 8;
const BLACK = 9;
const BLOCK = GRAY;

let currentY = 0;
let currentX = 0;
let currentBlock = null;

let gameOver = null;
let intervalId = null;

let blockList = [
    {
        name: "s",
        color: 1,
        shape: [
            [0, 0, 0],
            [0, 1, 1],
            [1, 1, 0],
        ]
    },
    {
        name: "z",
        color: 2,
        shape: [
            [0, 0, 0],
            [1, 1, 0],
            [0, 1, 1],
        ]
    },
    {
        name: "t",
        color: 3,
        shape: [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ]
    },
    {
        name: "l",
        color: 4,
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ]
    },
    {
        name: "j",
        color: 5,
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ]
    },
    {
        name: "o",
        color: 6,
        shape: [
            [1, 1],
            [1, 1],
        ]
    },
    {
        name: "i",
        color: 7,
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    },
]

// 초기화
let init = () => {
    // 테트리스 표 그리기, dataList 0으로 채우기
    let $target = document.getElementById("tetrisCenter");
    let $table = document.createElement("table");
    $table.id = "my_tetris";

    // 테트리스 테이블 만들기
    // dataList 에 0 채우기
    for (let i = 0; i < row; i++) {
        let temp = [];
        let $tr = document.createElement("tr");
        for (let j = 0; j < col; j++) {
            let $td = document.createElement("td");
            $tr.append($td);
            temp.push(0);
        }
        $table.append($tr);
        dataList.push(temp);
    }
    $target.append($table);

    // 테트리스 세로 벽그리기
    for (let i = 0; i < row; i++) {
        dataList[i][0] = GRAY;
        dataList[i][col - 1] = GRAY;

        $table.children[i].children[0].className = colorList[GRAY];
        $table.children[i].children[col - 1].className = colorList[GRAY];
    }

    // 테트리스 가로 벽그리기
    for (let i = 1; i < col - 1; i++) {
        dataList[0][i] = GRAY;
        dataList[row - 1][i] = GRAY;

        $table.children[0].children[i].className = colorList[GRAY];
        $table.children[row - 1].children[i].className = colorList[GRAY];
    }

    // 데이터를 테이블에 표시
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            $table.children[i].children[j].innerText = dataList[i][j];
        }
    }

    intervalId = setInterval(playGame, 500);
};

// 처음 생성되는 블럭
let setNewBlock = () => {
    // 블럭이 그려질 인덱스
    currentY = 1;
    currentX = 4;

    let r = Math.floor(Math.random() * blockList.length);

    currentBlock = blockList[r];
    let shape = currentBlock.shape;

    // 게임 종료 여부
    isGameOver();

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] == 1) {
                // 블럭을 그린다.
                dataList[currentY + i][currentX + j] = blockList[r].color;
            }
        }
    }
}

// 그리기
let draw = () => {
    let $myTetris = document.getElementById("my_tetris");

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let index = dataList[i][j];

            $myTetris.children[i].children[j].className = colorList[index];
            $myTetris.children[i].children[j].innerText = dataList[i][j];
        }
    }
}


// 왼쪽 이동
let left = () => {
    let nextY = 0;
    let nextX = -1;

    console.log("lol L");

    let shape = currentBlock.shape;
    let realBlock = getRealBlock(shape);
    let moveAble = isMoveAble(realBlock, nextY, nextX);

    if (moveAble == true) {
        setData(realBlock, 0, 0, WHITE);
        setData(realBlock, nextY, nextX, currentBlock.color);

        currentX -= 1;
    }
}

// 오른쪽 이동
let right = () => {
    let nextY = 0;
    let nextX = 1;
    console.log("lol R");

    let shape = currentBlock.shape;
    let realBlock = getRealBlock(shape);
    let moveAble = isMoveAble(realBlock, nextY, nextX);

    if (moveAble == true) {
        setData(realBlock, 0, 0, WHITE);
        setData(realBlock, nextY, nextX, currentBlock.color);

        currentX += 1;
    }
}

// 아래 이동
let down = () => {
    let nextY = 1;
    let nextX = 0;

    let shape = currentBlock.shape;
    let realBlock = getRealBlock(shape);
    let moveAble = isMoveAble(realBlock, nextY, nextX);

    if (moveAble == true) {
        setData(realBlock, 0, 0, WHITE);
        setData(realBlock, nextY, nextX, currentBlock.color);

        currentY += 1;
    } else if (moveAble == false) {
        setData(realBlock, 0, 0, BLACK);
    }

    return moveAble;
}

let rotate = () => {
    let currentShape = currentBlock.shape;
    let nextShape = getNextShape(currentShape);

    // 회전하기 전 블럭 인덱스
    let realBlock = getRealBlock(currentShape);

    // 회전한 후 블럭 인덱스
    let nextRealBlock = getRealBlock(nextShape);

    // 충돌 없이 회전이 가능한지 검사
    let moveAble = isMoveAble(nextRealBlock, 0, 0);

    // 가능하다면
    if (moveAble == true) {
        // 기존 블럭 인덱스 지우고
        setData(realBlock, 0, 0, WHITE);

        // 회전 블럭 인덱스 그린다.
        setData(nextRealBlock, 0, 0, currentBlock.color);

        // 전역변수에 현재 블럭을 회전한 모양으로 업데이트
        currentBlock.shape = nextShape;
    }
}

let getNextShape = (currentShape) => {
    let tempBlock = [];
    for (let i = 0; i < currentShape.length; i++) {
        let temp = [];
        for (let j = 0; j < currentShape[i].length; j++) {
            temp.push(0)
        }
        tempBlock.push(temp);
    }

    let index = currentShape.length - 1;

    for (let i = 0; i < currentShape.length; i++) {
        for (let j = 0; j < currentShape[i].length; j++) {
            tempBlock[j][index] = currentShape[i][j];
        }
        index -= 1;
    }


    return tempBlock;
}

// 블럭 인덱스를 가져오는 함수
let getRealBlock = (shape) => {
    let realBlock = [];

    // 현재 currentY = 1, currentX = 4 값이 들어있다.
    // 초기에 블럭이 그려진 인덱스 이다.
    // 여기서 파라미터로 받은 블럭의 모양이 아래의 모양이라고 가정하면
    // [0, 0, 0]
    // [1, 1, 1]
    // [0, 1, 0]
    // 여기서 블럭 인덱스 값이 1인 인덱스를 정의하면
    // i = 1 , 2
    // j = 0, 1, 2, 1

    // 따라서 그 인덱스를 전역변수에 더하고 리스트에 추가하면
    // [2, 4]
    // [2, 5]
    // [2, 6]
    // [3, 5]
    // 값이 들어온다. 현재 맵에 그려져있는 블럭 인덱스 i, j 가 동일하다.

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape.length; j++) {
            if (shape[i][j] == 1) {
                realBlock.push([currentY + i, currentX + j]);
            }
        }
    }

    // 블럭이 그려져 있는 인덱스 리스트를 반환
    return realBlock;
}

// 그리기전 이동가능한지 그려보는 함수
let isMoveAble = (realBlock, nextY, nextX) => {
    for (let i = 0; i < realBlock.length; i++) {
        for (let j = 0; j < realBlock[i].length; j++) {
            let y = realBlock[i][0];
            let x = realBlock[i][1];

            if (dataList[y + nextY][x + nextX] >= BLOCK) {
                return false;
            }
        }
    }

    return true;
}

// 이동 종료 dataList 값 변경
let setData = (realBlock, nextY, nextX, color) => {
    // 받아온 파라미터 그대로 map 에 지우고 다시 그린다.
    for (let i = 0; i < realBlock.length; i++) {
        let y = realBlock[i][0];
        let x = realBlock[i][1];

        dataList[y + nextY][x + nextX] = color;
    }
}

// 블럭 삭제
let lineClear = () => {
    let del = [];
    for (let i = 1; i < row - 1; i++) {
        let count = 0;
        for (let j = 1; j < col - 1; j++) {
            if (dataList[i][j] == BLACK) {
                count += 1;
            }
        }
        if (count == 10) {
            del.push(i);
        }
    }

    for (let i = 0; i < del.length; i++) {
        dataList.splice(del[i], 1);
        dataList.splice(0, 1);

        dataList.unshift([BLOCK,WHITE,WHITE,WHITE,WHITE,WHITE,WHITE,WHITE,WHITE,WHITE,WHITE,BLOCK]);
        dataList.unshift([BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK]);
    }
}

let playGame = () => {
    if (gameOver == true) {
        clearInterval(intervalId);

        alert("Game Over");
        init();
        setNewBlock();
        draw();

        return;
    }

    if (down() == false) {
        lineClear();
        setNewBlock();
    }
    draw();
}

let isGameOver = () => {
    let realBlock = getRealBlock(currentBlock.shape);

    for (let i = 0; i < realBlock.length; i++) {
        if (dataList[realBlock[i][0]][realBlock[i][1]] == BLACK) {
            gameOver = true;
            break;
        }
    }
}

// 이벤트 등록
document.addEventListener("keydown", function (e) {
    let key = e.code;

    if (key == "ArrowLeft") {
        left()
    } else if (key == "ArrowRight") {
        right()
    } else if (key == "ArrowDown") {
        if (down() == false) {
            lineClear();
            setNewBlock();
        }
    } else if (key == "ArrowUp") {
        // 회전
        rotate();
    } else if (key == "Space") {
        while (down()) {
        }
        lineClear();
        setNewBlock();
    }

    draw();
});

init();
setNewBlock();
draw();