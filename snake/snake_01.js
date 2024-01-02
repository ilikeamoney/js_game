/**
 *
 * 스네이크 구현 단계
 *
 * 1. 맵 그리기 O
 * 2. 랜덤한 인덱스 위치에 먹이 생성 O
 * 3. 맵에 Snake 그리기 O
 * 4. 버튼을 누르면 게임 시작
 * 5. 키보드 방향키를 누르면 그 방향으로 움직이기
 * 6. 먹이를 먹으면 그 인덱스의 먹이는 사라지고 재배치
 * 7. 스네이크 길이가 길어진다.
 * **/

let size = 10;
let snakeSize = 4;

let data = [];
let yList = [0, 0, 0, 0];
let xList = [0, 1, 2, 3];
let item = 9;
let itemCount = 0;
let dir = 1;

let gameOver = false;
let count = 3;

let myInterval = null;
let myTimeOut = null;

// 테이블 랜덤 위치에 아이탬 생성
let setItem = () => {
    while (true) {
        // 랜덤 함수로 랜덤 인덱스 생성
        let y = Math.floor(Math.random() * size);
        let x = Math.floor(Math.random() * size);

        // 랜덤으로 나온 인덱스의 값이 0 이라면
        if (data[y][x] == 0) {
            // 그 인덱스에 item 을 넣는다.
            data[y][x] = item;
            // table 을 가져와서
            let $table = document.getElementById("snake");
            // 현재 랜덤 인덱스에 class 로 item 을 지정
            $table.children[y].children[x].setAttribute("class", "item");
            break;
        }
    }
}

// 테이블에 뱀그리기
let init = () => {
    // data 인덱스 전체에 0으로 초기화
    for (let i = 0; i < size; i++) {
        let temp = [];
        for (let j = 0; j < size; j++) {
            temp.push(0);
        }
        data.push(temp);
    }

    let $table = document.getElementById("snake");

    // 스네이크를 만드는 부분
    for (let i = 0; i < snakeSize; i++) {
        // data[0][0] = 1
        // data[0][1] = 2
        // data[0][2] = 3
        // data[0][3] = 4
        // snake = 1, 2, 3, 4
        // tr = 0, td = 0, 1, 2, 3
        // td 에 snakeBody 지정
        data[yList[i]][xList[i]] = i + 1;
        $table.children[yList[i]].children[xList[i]].setAttribute("class", "snake_body");
    }
    // yList[snakeSize - 1] = 0
    // xList[snakeSize - 1] = 4
    // tr = 0, td = 3
    // 마지막 요소에 snakeHead 지정
    $table.children[yList[snakeSize - 1]].children[xList[snakeSize - 1]].setAttribute("class", "snake_head");

    // 랜덤 아이탬 생성
    setItem();
}

// 테이블 그리기
let getTable = () => {
    let $myGame = document.getElementById("my_game");

    let $table = document.createElement("table");
    $table.id = "snake";

    for (let i = 0; i < size; i++) {
        let $tr = document.createElement("tr");
        for (let j = 0; j < size; j++) {
            let $td = document.createElement("td");
            $tr.append($td);
        }
        $table.append($tr);
    }

    $myGame.append($table);
    return $table;
}

let moveSnake = () => {
    if (gameOver) {
        console.log("Game Over");

        setCount()

        clearInterval(myInterval);
    }

    let $table = document.getElementById("snake");

    // 뱀 머리 저장
    let tempY = yList[snakeSize - 1];
    let tempX = xList[snakeSize - 1];

    console.log("y = " + tempY);
    console.log("x = " + tempX);

    // 키보드 이벤트에 따라 변화는 방향
    if (dir == 0) {
        // 북
        tempY -= 1;
    } else if (dir == 1) {
        // 동
        tempX += 1;
    } else if (dir == 2) {
        // 남
        tempY += 1;
    } else if (dir == 3) {
        // 서
        tempX -= 1;
    }

    // Y 범위가 map 을 초과한 경우
    if (size <= tempY || tempY < 0) {
        gameOver = true;
        return;
    }

    // X 범위가 map 을 초과한 경우
    if (size <= tempX || tempX < 0) {
        gameOver = true
        return;
    }

    // 맵의 인덱스 값 = 0
    // 아이템 값 = 9
    // 이 두가지가 모두 해당이 안되는 경우
    if (data[tempY][tempX] != 0 && data[tempY][tempX] != item) {
        gameOver = true;
        return;
    }

    // 기존 위치 초기화
    // yList = [0, 0, 0, 0];
    // xList = [0, 1, 2, 3];
    for (let i = 0; i < snakeSize; i++) {
        $table.children[yList[i]].children[xList[i]].setAttribute("class", "");
        data[yList[i]][xList[i]] = 0;
    }
    $table.children[yList[snakeSize - 1]].children[xList[snakeSize - 1]].setAttribute("class", "");

    if (data[tempY][tempX] == item) {
        yList.unshift(tempY);
        xList.unshift(tempX);

        // 스네이크 사이즈 증가
        snakeSize += 1;

        // 아이탬 카운트 증가
        itemCount += 1;

        document.getElementById("total_count").innerText = itemCount;

        // 랜덤 아이탬 배치
        setItem();
    }

    for (let i = 1; i < snakeSize; i++) {
        // 즉 방향키를 눌러서 이동방향을 바꾸면
        // 한쪽 방향은 고정이 된다.
        // 반대로 나머지 한쪽값은 증가시키고 뒤로밀면서 배열의 값이 순차적으로 증가한다.
        // 이 로직에서 table 에 snake body head 나눠서 클래스를 적용하고 색상을 입히면
        // 이동하는 것처럼 보인다.

        // ex
        // y = [0, 0, 0, 0] x = [0, 1, 2, 3] 방향키 아래
        // y = [0, 0, 0, 1]
        // x = [1, 2, 3, 3]
        //
        // y = [0, 0, 1 2]
        // x = [2, 3, 3, 3]
        //
        // y = [0, 1, 2, 3]
        // x = [3, 3, 3, 3]
        yList[i - 1] = yList[i];
        xList[i - 1] = xList[i];
    }
    yList[snakeSize - 1] = tempY;
    xList[snakeSize - 1] = tempX;


    // yList 또는 xList 값을 한칸 뒤로 민 값을
    // 다시 테이블에 그리기
    for (let i = 0; i < snakeSize; i++) {
        $table.children[yList[i]].children[xList[i]].setAttribute("class", "snake_body");
        data[yList[i]][xList[i]] = i + 1;
    }
    $table.children[yList[snakeSize - 1]].children[xList[snakeSize - 1]].setAttribute("class", "snake_head");
}

let setCount = () => {

    // 카운트가 0보다 크거나 같다면
    if (count >= 0) {
        // Game Over + count
        document.getElementById("msg").innerHTML = "Game Over<br>" + count;
    } else {
        // count == 0
        // 재귀호출 종료
        clearInterval(myTimeOut);

        // index.html 로 리다이렉트
        location.href = "snake_01.html";
    }

    // 1초 마다 재귀호출
    myTimeOut = setTimeout(setCount, 1000);

    // 카운트 변화 3 -> 2 -> 1 -> 0
    count -= 1;
}

let startGame = () => {
    myInterval = setInterval(moveSnake, 100);

    document.getElementById("playBtn").setAttribute("disable", true);
}

// 윈도우 키보드 입력 이벤트
window.addEventListener("keydown", function (e) {
    let key = e.key;

    if (key == "ArrowUp") {
        dir = 0;
    } else if (key == "ArrowDown") {
        dir = 2
    } else if (key == "ArrowRight") {
        dir = 1
    } else if (key == "ArrowLeft") {
        dir = 3;
    }
});

getTable();
init();

let makeTwoArr = (arr, size) => {
    let list = [];
    let index = 0;

    for (let i = 0; i < size; i++) {
        let temp = [];
        let count = 0;
        for (let j = index; j < arr.length; j++) {
            temp.push(arr[j]);
            count += 1;
            index += 1;

            if (count == size) {
                j = index;
                break;
            }
        }
        list.push(temp);
    }
    return list;
}
