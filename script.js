const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const gridSize = 16;
let count = 0;
let isArrowKeysLocked = false;
let isGameActive = false;
let applesCollected = 0;

const snake = {
    x: 160,
    y: 160,
    dx: gridSize,
    dy: 0,
    cells: [],
    maxCells: 4
};

const apple = {
    x: 320,
    y: 320
};

let direction = { x: gridSize, y: 0 };

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const resetGame = () => {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    direction = { x: gridSize, y: 0 };
    apple.x = getRandomInt(0, 25) * gridSize;
    apple.y = getRandomInt(0, 25) * gridSize;
    applesCollected = 0;
};

const appleImage = new Image();
appleImage.src = 'star.png';

const gameLoop = () => {
    if (applesCollected === 5) {
        const gameOverMessage = document.getElementById('game-over-message');
        gameOverMessage.classList.remove('d-none');
        gameOverMessage.classList.add('d-flex');
        isArrowKeysLocked = false;
        isGameActive = false;
        return;
    }

    requestAnimationFrame(gameLoop);

    if (++count < 4) return;
    count = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += direction.x;
    snake.y += direction.y;

    if (snake.x < 0) snake.x = canvas.width - gridSize;
    else if (snake.x >= canvas.width) snake.x = 0;

    if (snake.y < 0) snake.y = canvas.height - gridSize;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) snake.cells.pop();

    context.drawImage(appleImage, apple.x, apple.y, gridSize, gridSize);

    context.fillStyle = 'green';
    snake.cells.forEach((cell, index) => {
        context.fillRect(cell.x, cell.y, gridSize - 1, gridSize - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            applesCollected++;
            apple.x = getRandomInt(0, 25) * gridSize;
            apple.y = getRandomInt(0, 25) * gridSize;
        }

        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame();
            }
        }
    });
};

const feedbackSection = document.getElementById('feedback');
feedbackSection.addEventListener('mouseenter', () => {
    if (isGameActive) {
        isArrowKeysLocked = true;
    }
});

feedbackSection.addEventListener('mouseleave', () => {
    if (!isGameActive) {
        isArrowKeysLocked = false;
    }
});

document.addEventListener('keydown', (event) => {
    if (isArrowKeysLocked) {
        if (isGameActive) {
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    if (direction.y === 0) direction = { x: 0, y: -gridSize };
                    break;
                case 'ArrowDown':
                case 's':
                    if (direction.y === 0) direction = { x: 0, y: gridSize };
                    break;
                case 'ArrowLeft':
                case 'a':
                    if (direction.x === 0) direction = { x: -gridSize, y: 0 };
                    break;
                case 'ArrowRight':
                case 'd':
                    if (direction.x === 0) direction = { x: gridSize, y: 0 };
                    break;
            }
            event.preventDefault();
        } else {
            event.preventDefault();
        }
    }
});

resetGame();
isGameActive = true;
requestAnimationFrame(gameLoop);

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction.x === 0) {
            direction = { x: gridSize, y: 0 };
        } else if (diffX < 0 && direction.x === 0) {
            direction = { x: -gridSize, y: 0 };
        }
    } else {
        if (diffY > 0 && direction.y === 0) {
            direction = { x: 0, y: gridSize };
        } else if (diffY < 0 && direction.y === 0) {
            direction = { x: 0, y: -gridSize };
        }
    }
}, false);

function updateInputWidth() {
    const nameInputElement = document.getElementById("name");
    if (window.innerWidth <= 1024) {
        nameInputElement.classList.remove("w-25");
        nameInputElement.classList.add("w-50");
    } else {
        nameInputElement.classList.remove("w-50");
        nameInputElement.classList.add("w-25");
    }

    const emailInputElement = document.getElementById("email");
    if (window.innerWidth <= 1024) {
        emailInputElement.classList.remove("w-25");
        emailInputElement.classList.add("w-50");
    } else {
        emailInputElement.classList.remove("w-50");
        emailInputElement.classList.add("w-25");
    }

    const additionalFeedbackInputElement = document.getElementById("additional_feedback");
    if (window.innerWidth <= 1024) {
        additionalFeedbackInputElement.classList.remove("w-25");
        additionalFeedbackInputElement.classList.add("w-50");
    } else {
        additionalFeedbackInputElement.classList.remove("w-50");
        additionalFeedbackInputElement.classList.add("w-25");
    }
}

window.addEventListener("resize", updateInputWidth);
window.addEventListener("DOMContentLoaded", updateInputWidth);