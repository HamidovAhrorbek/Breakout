const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;

let timerId;
let xDirection = -2;
let yDirection = 2;
let score = 0;

// Initial positions
const userStart = [230, 10];
let currentPosition = [...userStart];

const ballStart = [270, 40];
let ballCurrentPosition = [...ballStart];

// Block class
class Block {
    constructor(x, y) {
        this.bottomLeft = [x, y];
        this.bottomRight = [x + blockWidth, y];
        this.topLeft = [x, y + blockHeight];
        this.topRight = [x + blockWidth, y + blockHeight];
    }
}

// All blocks
let blocks = [
    // Row 1
    new Block(10, 270), new Block(120, 270), new Block(230, 270), new Block(340, 270), new Block(450, 270),
    // Row 2
    new Block(10, 240), new Block(120, 240), new Block(230, 240), new Block(340, 240), new Block(450, 240),
    // Row 3
    new Block(10, 210), new Block(120, 210), new Block(230, 210), new Block(340, 210), new Block(450, 210)
];

// Draw blocks
function addBlocks() {
    blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.classList.add('block');
        blockElement.style.left = block.bottomLeft[0] + 'px';
        blockElement.style.bottom = block.bottomLeft[1] + 'px';
        grid.appendChild(blockElement);
    });
}
addBlocks();

// Add user
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

// Add ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawBall();

// Draw functions
function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// Move user
function moveUser(e) {
    if (e.key === 'ArrowLeft' && currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
    } else if (e.key === 'ArrowRight' && currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
    }
}
document.addEventListener('keydown', moveUser);

// Move ball
function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}
timerId = setInterval(moveBall, 30);

// Collision Detection
function checkForCollisions() {
    // Block collision
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (
            ballCurrentPosition[0] + ballDiameter > block.bottomLeft[0] &&
            ballCurrentPosition[0] < block.bottomRight[0] &&
            ballCurrentPosition[1] + ballDiameter > block.bottomLeft[1] &&
            ballCurrentPosition[1] < block.topLeft[1]
        ) {
            const allBlocks = document.querySelectorAll('.block');
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.textContent = score;

            if (blocks.length === 0) {
                scoreDisplay.textContent = 'You win!';
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
            return; // prevent multiple collisions at once
        }
    }

    // Wall collisions
    if (
        ballCurrentPosition[0] <= 0 ||
        ballCurrentPosition[0] >= (boardWidth - ballDiameter)
    ) {
        xDirection *= -1;
    }

    if (ballCurrentPosition[1] >= (boardHeight - ballDiameter)) {
        yDirection *= -1;
    }

    // Paddle collision
    if (
        ballCurrentPosition[0] + ballDiameter > currentPosition[0] &&
        ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
        ballCurrentPosition[1] <= currentPosition[1] + blockHeight &&
        ballCurrentPosition[1] >= currentPosition[1]
    ) {
        yDirection *= -1;
    }

    // Game over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.textContent = 'You lose!';
        document.removeEventListener('keydown', moveUser);
    }
}

// Change direction helper (only called when block is hit)
function changeDirection() {
    xDirection *= -1;
    yDirection *= -1;
}
