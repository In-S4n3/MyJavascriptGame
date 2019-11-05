let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

// IMAGES
const alien8bit = new Image();
alien8bit.src = "./Images/alien.png"

const rectangle = new Image();
rectangle.src = "./Images/rectangle.png";

const fireBall = new Image();
fireBall.src = "./Images/fireball.png";

const lifesImg = new Image();
lifesImg.src = "./Images/png-heart-clipart.png";

const scoreImg = new Image();
scoreImg.src = "./Images/score.png";

const levelImg = new Image();
levelImg.src = "./Images/level_up.png";

const scoreHigh = new Image();
scoreHigh.src = "./Images/high-score-icon.png"



// Paddle 
const paddleWidth = 75;
const paddleHeight = 15;
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
  ctx.drawImage(rectangle, paddle.x, paddle.y, paddle.width, paddle.height)
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
  y: canvas.height - paddlePaddingBottom - paddle.height - radius -5,
}

// Drawing the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
  ctx.drawImage(fireBall, ball.x-12, ball.y-11, 28, 28)
  ctx.closePath();

  // Making the ball move
  ball.x += vx;
  ball.y += vy;

  // Ball agains the walls
  if (ball.x + radius > canvas.width || ball.x - radius < 0) {
    vx = -vx;
    borderSounds.play();
  }
  if (ball.y + radius > canvas.height || ball.y - radius < 0) {
    vy = -vy;
    borderSounds.play();
  }
  // Losing the game
  if (ball.y + radius > canvas.height) {
    dead.play();
    life--
    resetGame();
    if(life === 0) {
      dead.play();
      gameOver = true;
      document.getElementById("gameOver").style.display = "block";
      document.getElementById("game").style.display = "none";

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
   paddleHit.play();
  };
}

// Creating the aliens
const alien = {
  row: 1,
  column: 9,
  width: 45,
  height: 35,
  offSetLeft: 30,
  offSetTop: 20,
  marginTop: 50,
};

let aliens = [];

function createAliens() {
  for (let i = 0; i < alien.row; i++) {
    aliens[i] = [];
    for (let j = 0; j < alien.column; j++) {
      aliens[i][j] = {
        x: j * (alien.offSetLeft + alien.width) + alien.offSetLeft,
        y: i * (alien.offSetTop + alien.height) + alien.offSetTop + alien.marginTop,
        status: true
      };
    }
  }
}

createAliens();

// Drawing the aliens
function drawAliens() {
  for (let i = 0; i < alien.row; i++) {
    for (let j = 0; j < alien.column; j++) {
      let a = aliens[i][j];
      // if the alien isn't dead
      if (a.status == true) {

        ctx.drawImage(alien8bit, a.x, a.y, alien.width, alien.height)
      }
    }
  }
}

// Ball against alien
function collisionDetection() {
  for (let i = 0; i < alien.row; i++) {
    for (let j = 0; j < alien.column; j++) {
      let a = aliens[i][j];
      // if the alien isn't dead
      if (a.status == true) {
        if (
          ball.x + radius > a.x &&
          ball.x - radius < a.x + alien.width &&
          ball.y + radius > a.y &&
          ball.y - radius < a.y + alien.height
        ) {
          vy = -vy;
          a.status = false; // the alien is dead and disapears
          score++;
          // check high score
          if (score > highScore) {
            highScore = score;
            localStorage.setItem(saveScore, highScore)
          }
          if (score === 72) {
            youWin = true;
            document.getElementById("youWin").style.display = "block"; 
            document.getElementById("game").style.display = "none"
          }
          alienSounds.play();
        }
      }
    }
  }
}


// Game variables
const saveScore = 'highPontuation';

// Game Variables and Conditions 
let life = 3;
let level = 1;
let score = 0;
let highScore = localStorage.getItem(saveScore);
let gameOver = false;
let youWin = false;

// Save High Score
let scoreStr = localStorage.getItem(saveScore);
if(scoreStr === null) {
  highScore = 0;
} else {
  highScore = parseInt(scoreStr);
}

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
  for(let i = 0; i < alien.row; i++){
      for(let j = 0; j < alien.column; j++){
        levelComplete = levelComplete && ! aliens[i][j].status;
      }
  }
  
  if(levelComplete){
      alien.row++;
      createAliens();
      resetGame()
      vy+=1
      level++;
      levelPassed.play();
  }
}

// Game Sounds
const borderSounds = new Audio();
borderSounds.src = './Sounds/wall.mp3';

const alienSounds = new Audio();
alienSounds.src = './Sounds/boom.mp3';

const dead = new Audio();
dead.src = './Sounds/game_over.mp3'

const levelPassed = new Audio();
levelPassed.src = './Sounds/win.mp3'

const paddleHit = new Audio();
paddleHit.src = './Sounds/paddle_hit.mp3'


// Draw in the the Canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  movePaddle();
  drawBall();
  ballAgainstPaddle();
  drawAliens();
  collisionDetection();
  levelUp();

  // Score
  showGameStats(score, 50, 35, scoreImg, 5, 5);
  // High Score
  showGameStats(highScore, 165, 35, scoreHigh, 120, 5);
  // Life
  showGameStats(life, canvas.width-60, 35, lifesImg, canvas.width-45, 5);
  // level
  showGameStats(level, canvas.width-165, 35, levelImg, canvas.width-145, 5);


  if (!gameOver || !youWin) {
    requestAnimationFrame(draw);
  }
}


function startGame() {
  gameOver = false;
  youWin = false;
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("youWin").style.display = "none"; 
  document.getElementById("game").style.display = "block"; 
  document.getElementById("mainPage").style.display = "none"; 

  draw();
}

function restart() {
  window.location.reload();
}

// let enter = document.getElementById('buttonClick');
// enter.addEventListener('keydown', function (e) {
//   var key = e.which || e.keyCode
//   if (key === 13) {
//     document.getElementById('buttonClick').click();
//   }
// }, true)



