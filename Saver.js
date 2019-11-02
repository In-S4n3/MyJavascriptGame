let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

// Paddle 
const paddleWidth = 75;
const paddleHeight = 10;
const paddlePaddingBottom = 20;

const paddle = {
  x: canvas.width/2 - paddleWidth/2,
  y: canvas.height - paddlePaddingBottom - paddleHeight,
  width: paddleWidth,
  height: paddleHeight
}

// Drawing the Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.fillStyle = '#8fabc2'
  ctx.strokeStyle = 'blue'
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.stroke();
  ctx.fill();
}

// Move the paddle
let moveLeft = false;
let moveRight = false; 

document.addEventListener('keydown', function(e) {
  if(e.keyCode == 37) {
    moveLeft = true;
  } else if(e.keyCode == 39) {
    moveRight = true;
  }
})

document.addEventListener('keyup', function(e) {
  if(e.keyCode == 37) {
    moveLeft = false;
  } else if(e.keyCode == 39) {
    moveRight = false;
  }  
})

function movePaddle() {
  if(moveRight && paddle.x + paddle.width < canvas.width) {
    paddle.x += 6;
  } else if(moveLeft && paddle.x > 0) {
    paddle.x -= 6;
  }
}



// Ball
const radius = 10;
let vx = 3.5;
let vy = -3.5;

const ball = {
  x: canvas.width/2,
  y: canvas.height - paddlePaddingBottom - paddleHeight - radius -5,
}

// Drawing the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#" + Math.floor(Math.random() * 25542195).toString(16);
  ctx.fill();
  ctx.closePath();

  // Making the ball move
  ball.x += vx;
  ball.y += vy;

  // Ball agains the walls
  if (ball.x + radius > canvas.width || ball.x - radius < 0) {
    vx = -vx;
  }
  if (ball.y + radius > canvas.height || ball.y - radius < 0) {
    vy = -vy;
  }
  // Losing the game
  if (ball.y + radius > canvas.height) {
    life--
    resetGame();
    if(life === 0) {
      alert('Game Over');
    }
  }
}

// Starting the Game after losing
function resetGame() {
  ball.x = canvas.width/2;
  ball.y = canvas.height - paddlePaddingBottom - paddleHeight - radius -5;
  paddle.x = canvas.width/2 - paddleWidth/2;
  paddle.y = canvas.height - paddlePaddingBottom - paddleHeight;
}

// Ball collision with the paddle
function ballAgainstPaddle() {
  if(ball.x + radius < paddle.x + paddle.width && ball.x - radius > paddle.x && paddle.y < paddle.y + paddle.height && ball.y + radius > paddle.y) {
   vx = vx;
   vy = -vy
  };
}

// Creating the bricks
const brick = {
  row: 1,
  column: 9,
  width: 55,
  height: 20,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 50,
  fillColor: "#d6c8e3",
  strokeColor: "purple"
};

let bricks = [];

function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
        status: true
      };
    }
  }
}

createBricks();

// Drawing the bricks
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status == true) {
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(b.x, b.y, brick.width, brick.height);

        ctx.strokeStyle = brick.strokeColor;
        ctx.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

// Ball against brick
function collisionDetection() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status == true) {
        if (
          ball.x + radius > b.x &&
          ball.x - radius < b.x + brick.width &&
          ball.y + radius > b.y &&
          ball.y - radius < b.y + brick.height
        ) {
          vy = -vy;
          b.status = false; // the brick is broken and disapears
          score++;
        }
      }
    }
  }
}


// Game variables
const lifesImg = new Image();
lifesImg.src = "/Images/png-heart-clipart.png";

const scoreImg = new Image();
scoreImg.src = "/Images/score.png";

const levelImg = new Image();
levelImg.src = "/Images/level_up.png";

// Game Stats
let life = 3;
let level = 1;
let score = 0;

function showGameStats(text, textX, textY, img, imgX, imgY) {
  ctx.font = "30px Germania One";
  ctx.fillStyle = "#c160d6";
  ctx.fillText(text, textX, textY);
  ctx.drawImage(img, imgX, imgY,width=40, height=40);
}

// Level up
function levelUp(){
  let levelComplete = true;
  
  // check if all the bricks are broken
  for(let r = 0; r < brick.row; r++){
      for(let c = 0; c < brick.column; c++){
        levelComplete = levelComplete && ! bricks[r][c].status;
      }
  }
  
  if(levelComplete){
      brick.row++;
      createBricks();
      resetGame()
      level++;
  }
}


// Draw in the the Canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  movePaddle();
  drawBall();
  ballAgainstPaddle();
  drawBricks();
  collisionDetection();
  levelUp();

  // Score
  showGameStats(score, 50, 35, scoreImg, 5, 5);
  // Life
  showGameStats(life, canvas.width-60, 35, lifesImg, canvas.width-45, 5);
  // level
  showGameStats(level, canvas.width/2, 35, levelImg, canvas.width/2-40, 5);

  
  requestAnimationFrame(draw);
  
}

function startGame() {
  draw()
}
