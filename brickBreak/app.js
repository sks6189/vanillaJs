var canvas = document.getElementById('myCanvas');
let ballX, ballY, moveX, moveY, ballRadius, gameLevel;
let paddleBarWidth, paddleBarHeight, paddleX, paddleSpeed, leftPress, rightPress;
let bricksData, brickRow, brickLine, brickWidth, brickHeight;

const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// game
gameLevel = 2;
moveX = moveY = 1 * gameLevel;

// ball 
ballX = canvasWidth / 2;
ballY = canvasHeight - 55;
ballRadius = 5;

// paddle 
paddleBarWidth = 75;
paddleBarHeight = 10;
paddleX =  (canvasWidth - paddleBarWidth) / 2;
paddleSpeed = 7;

// brick
brickRow = 10;
brickLine = 5;
birckWidth = 45;
brickHeight = 10;

document.addEventListener('keydown',
    function(e){
        if(e.keyCode == 37){
            leftPress = true;
        }else if(e.keyCode == 39){
            rightPress = true;
        }
    }
)

document.addEventListener('keyup',
    function(e){
        if(e.keyCode == 37){
            leftPress = false;
        } else if(e.keyCode == 39){
            rightPress = false;
        }
    }
)

function drawGame(){
    drawBall();
    drawPaddle();
}
function drawBall(){
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.rect(paddleX, canvasHeight - 50, paddleBarWidth, paddleBarHeight);
    ctx.fill();
    ctx.strokeStyle='black';
    ctx.stroke();
    ctx.closePath();
}

function drawBricks(){
    for(let i=0; i<brickLine; i++){
        for(let j=0; j<brickRow; j++){
            ctx.beginPath();

            ctx.closePath();
        }
    }

    
}

function playGame(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGame();

    if(ballX + ballRadius >= canvasWidth || ballX - ballRadius < 0){
        moveX = -moveX;
    }

    if(ballY + ballRadius >= canvasHeight  || ballY - ballRadius < 0){
        moveY = -moveY;
    }

    if(leftPress && paddleX  > 0){
        paddleX -= paddleSpeed;
    }else if(rightPress && paddleX + paddleBarWidth < canvasWidth){
        paddleX += paddleSpeed;
    }

    if(ballY + ballRadius > canvasHeight - 50 && ballY - ballRadius  < canvasHeight - 50 + paddleBarHeight){
        if(ballX >= paddleX && ballX < paddleX + paddleBarWidth){
            moveY = (moveY < 0) ? -moveY : moveY;
        }
    }

    ballX += moveX; 
    ballY -= moveY; 
}   

// 실행
drawGame();    
playGame();
setInterval(playGame, 10);