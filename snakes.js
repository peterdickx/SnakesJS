"use strict";
import context from "./scripts/context.js";
import * as Utils from "./scripts/utils.js";

let width = context.canvas.width;
let height = context.canvas.height;

window.onkeydown = keyPressed;

let x = [];
let y = [];
let direction = 2;
let size = 5;
let appleX = 1;
let appleY = 1;
let frameCount = 0;
let lastTime = 0;
let buttonsEnabled = true;
let gameOver = false;
let score = 0;
let speed = 30;

setup();
draw();

function setup() {
    context.textAlign = "center";
    context.fillRect(0, 0, 800, 600);
    resetSnake();
    placeApple();
}

function draw(currentTime) {
    frameCount++;
    if (frameCount % speed == 0) {
        if (gameOver) {
            gameOver = true;
            context.fillStyle = "red";
            context.fillRect(0, 0, 800, 600);
            context.fillStyle = "white";
            context.font = "bold 78pt Arial";
            context.fillText("GAME OVER", width / 2, height / 2 - 50);
            context.fillText("SCORE: " + score, width / 2, height / 2 + 100);
            drawWalls();
        } else {
            console.log(direction);
            context.fillStyle = "black";
            context.fillRect(0, 0, 800, 600);
            drawWalls();
            moveAndDrawSnake();
            drawApple();
            showFrameRate(currentTime);

        }
        buttonsEnabled = true;
    }

    requestAnimationFrame(draw);

}

function resetSnake() {
    size = 5;
    direction = 2;
    gameOver = false;
    speed = 30;
    score = 0;
    for (let i = 0; i < size; i++) {
        x[i] = 20 - i;
        y[i] = 15;
    }
}

function showFrameRate(currentTime) {
    let difference = (currentTime - lastTime) / 1000;
    let fps = Math.round(1 / difference) + " FPS";
    lastTime = currentTime;
    context.fillStyle = "yellow";
    context.font = "bold 12pt Arial";
    context.fillText(fps, 50, 50);
}

function placeApple() {
    appleX = Utils.randomNumber(1, 38);
    appleY = Utils.randomNumber(1, 28);
}

function drawApple() {
    context.fillStyle = "red";
    Utils.fillCircle(10 + appleX * 20, 10 + appleY * 20, 10);
}

function drawWalls() {
    context.fillStyle = "white";
    context.fillRect(0, 0, 40 * 20, 20);
    context.fillRect(0, 0, 20, 30 * 20);
    context.fillRect(39 * 20, 0, 20, 30 * 20);
    context.fillRect(0, 29 * 20, 40 * 20, 20);
}

function moveAndDrawSnake() {

    checkApple();

    context.fillStyle = "green";

    //move the tailblocks 
    for (let i = size; i > 0; i--) {
        if (i != 0) {
            x[i] = x[i - 1];
            y[i] = y[i - 1];
        }
        context.fillRect(x[i] * 20, y[i] * 20, 20, 20);
    }

    //change the direction/position of the head
    //0 = up, 1 = down, 2 = right, 3 = left
    if (direction == 0) {
        y[0] = y[0] - 1;
    } else if (direction == 1) {
        y[0] = y[0] + 1;
    } else if (direction == 2) {
        x[0] = x[0] + 1;
    } else if (direction == 3) {
        x[0] = x[0] - 1;
    }

    checkGameOver();
}

function checkGameOver() {
    //check if the head hits a wall
    if (x[0] < 1 || x[0] >= 39 || y[0] < 1 || y[0] >= 29) {
        gameOver = true;
    } else {
        //check if the head hits its own tail
        for (let i = 1; i <= size; i++) {
            if (x[0] == x[i] && y[0] == y[i]) {
                gameOver = true;
                break;
            }
        }
    }
}

function checkApple() {
    //check if the head eats the apple
    if (x[0] == appleX && y[0] == appleY) {
        size++;
        score++;
        speed--;
        placeApple();
    }
}

/**
 * 
 * @param {KeyboardEvent} e 
 */
function keyPressed(e) {
    if (buttonsEnabled) {
        //reset everything when the user pressed a key on the gameover screen
        if (gameOver) {
            resetSnake();
        }
    }

    //disable the keys until the snake has moved
    buttonsEnabled = false;

    //change direction
    //0 = up, 1 = down, 2 = right, 3 = left
    //dont allow changing in the opposite direction
    if (e.key == "ArrowUp") {
        if (direction != 1) {
            direction = 0;
        }
    } else if (e.key == "ArrowDown") {
        if (direction != 0) {
            direction = 1;
        }
    } else if (e.key == "ArrowRight") {
        if (direction != 3) {
            direction = 2;
        }
    } else if (e.key == "ArrowLeft") {
        if (direction != 2) {
            direction = 3;
        }
    }
}