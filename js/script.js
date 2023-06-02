const gameBoard = document.querySelector('.board');
const scoreElement = document.querySelector('.score');
const maxScoreElement = document.querySelector('.maxScore');
const maxScore = document.querySelector('.maxScore2');
const controls = document.querySelectorAll(".controls span");
const messageBox = document.querySelector(".message");
const form = document.getElementById("myForm");
const menu = document.querySelector(".menuContainer");
const game = document.querySelector(".container");

let gameOver = false;
let foodX, foodY;
let snakeX =12, snakeY=12;
let veloX=0, veloY=0;
let snakeTail = [];
let speed ;
let point;
let setIntervalId;
let score = 0;
let pause = false;

let highScore = localStorage.getItem('higherScore') || 0;
maxScoreElement.innerText = "High Score: " + highScore;
maxScore.innerText = "High Score: " + highScore;

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    scoreElement.innerText = "Score: " + score;
    speed = e.srcElement.elements.dificulty.value;
    speed==300 ? point=1 : speed==200 ? point=2 : point=3;
    menu.classList.toggle('active');
    game.classList.toggle('active');
    automateFoodPosition();
    automateSnakePosition();
    setIntervalId = setInterval(runGame, speed);
});

const restartGame = () =>{
    messageBox.classList.remove('active');
    scoreElement.innerText = "Score: " + score;
    automateFoodPosition();
    automateSnakePosition();
    setIntervalId = setInterval(runGame, speed);
}

const exitGame = () =>{
    maxScore.innerText = "High Score: " + highScore;
    messageBox.classList.remove('active');
    menu.classList.toggle('active');
    game.classList.toggle('active');
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    gameOver = false;
    veloX=0, veloY=0;
    snakeTail = [];
    score = 0;
    pause = false;
    messageBox.classList.toggle('active');
}

//function for set random position for food
const automateFoodPosition = () =>{
    foodX = Math.floor(Math.random()*30)+1;
    foodY = Math.floor(Math.random()*30)+1;
}
const automateSnakePosition = () =>{
    snakeX = Math.floor(Math.random()*30)+1;
    snakeY = Math.floor(Math.random()*30)+1;
}

const changeDirection = (e)=>{
    if(e.key === "ArrowUp" && veloY != 1){
        veloX = 0;
        veloY = -1;
        gameBoard.classList.add('up');
        gameBoard.classList.remove('down');
        gameBoard.classList.remove('left');
        gameBoard.classList.remove('right');
    }else if(e.key === "ArrowDown" && veloY != -1){
        veloX = 0;
        veloY = 1;
        gameBoard.classList.add('down');
        gameBoard.classList.remove('up');
        gameBoard.classList.remove('left');
        gameBoard.classList.remove('right');
    }else if(e.key === "ArrowLeft" && veloX != 1){
        veloX = -1;
        veloY = 0;
        gameBoard.classList.add('left');
        gameBoard.classList.remove('down');
        gameBoard.classList.remove('up');
        gameBoard.classList.remove('right');
    }else if(e.key === "ArrowRight" && veloX != -1){
        veloX = 1;
        veloY = 0;
        gameBoard.classList.add('right');
        gameBoard.classList.remove('down');
        gameBoard.classList.remove('left');
        gameBoard.classList.remove('up');
    }else if(e.code === "Space"){
        pause = !pause;
        pause ? clearInterval(setIntervalId) : setIntervalId = setInterval(runGame, speed);
        // setTimeout(() => {
        //     setIntervalId = setInterval(runGame, speed);
        // }, 5000);
    }
}



controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
});

const runGame = () =>{

    //when snake eat the food
    if(snakeX===foodX && snakeY===foodY){
        automateFoodPosition();

        //update snake size
        snakeTail.push([foodX, foodY]);
        score += point;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem('higherScore', highScore);
        maxScoreElement.innerText = "High Score: " + highScore;
        scoreElement.innerText = "Score: " + score;
    }

    //set food in game board
    let htmlElement = `<div class="food" style="grid-area: ${foodY} / ${foodX};"></div>`;
    
    //make tail update with previos position. this makes tail follow head of snake
    for (let i = snakeTail.length - 1; i > 0 ; i--) {
        snakeTail[i] = snakeTail[i-1];
    }

    // posible value of velo 0 , 1 , -1. this makes snake move
    snakeX += veloX;
    snakeY += veloY;
    
    //maintain snake head position
    snakeTail[0] = [snakeX, snakeY];

    //make div elemet for every item in snakeTail array
    for (let i = 0; i < snakeTail.length; i++) {
        htmlElement += `<div class="snakeHead" style="grid-area: ${snakeTail[i][1]} / ${snakeTail[i][0]};"></div>`;

        //check wether head of snake hit the it self tail
        if(i !== 0 && snakeTail[0][1]===snakeTail[i][1] && snakeTail[0][0]===snakeTail[i][0]){
            gameOver = true;
        }
    }
    
    

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }
    if(gameOver) return handleGameOver();
    gameBoard.innerHTML = htmlElement;
}

// automateFoodPosition();

// every speed time of second rungame function run
// setIntervalId = setInterval(runGame, speed);

document.addEventListener("keydown", changeDirection);