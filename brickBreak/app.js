const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let game = {
    level : 20,
    score : 0,
    startWidth : 0,
    startHeight : 30
};

let ball = {
    x : canvas.width / 2,
    y : canvas.height - 55, 
    moveX : 0.5 + (game.level * 0.5),
    moveY : 0.5 + (game.level * 0.5),
    radius : 5
};

let paddle = {
    width : 75,
    height : 10,
    x : canvas.width / 2,
    y : canvas.height - 50,
    speed : 7,
    leftPress : false,
    rightPress : false
}

let bricksData = [];
let brick = {
    row : 10,
    line : 10,
    width : 40,
    height : 20,
    startX : 50,
    startY : 50,
    status : 1,
    score : 100
}

document.addEventListener('keydown',
    function(e){
        if(e.keyCode == 37){
            paddle.leftPress = true;
        }else if(e.keyCode == 39){
            paddle.rightPress = true;
        }
    }
)

document.addEventListener('keyup',
    function(e){
        if(e.keyCode == 37){
            paddle.leftPress = false;
        } else if(e.keyCode == 39){
            paddle.rightPress = false;
        }
    }
)

function drawGame(){
    drawScore();
    drawBall();
    drawPaddle();
    drawBricks();
}

function drawScore(){
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0, 0, canvas.width, game.startHeight);
    ctx.fill();
    ctx.font = "normal 20px Verdana";
    ctx.strokeStyle = "#ffffff";

    ctx.strokeText('Score : ' + game.score, canvas.width - 100 - (game.score.toString().length * 10) , 20);
    ctx.strokeText('Level : ' + game.level, 10, 20);
    ctx.closePath();
}

function drawBall(){
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fill();
    ctx.strokeStyle='black';
    ctx.stroke();
    ctx.closePath();
}

function drawBricks(){
    for(var i=0; i<brick.line; i++){
        if(!bricksData[i]){
            bricksData[i] = [];
        }
        for(var j=0; j<brick.row; j++){
            if(!bricksData[i][j]){
                bricksData[i][j] = {x : brick.startX + (brick.width * j), y : brick.startY + (brick.height * i),  width : brick.width, height : brick.height, status : 1};
            }

            if(bricksData[i][j].status == 1){
                ctx.beginPath();
                ctx.fillStyle = "lightblue";
                ctx.rect(brick.startX + (brick.width * j), brick.startY + (brick.height * i), brick.width, brick.height);
                ctx.fill();
                ctx.strokeStyle = 'black';
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function brickTouch(_data){  
    // left touch
    if(_data.x <= (ball.x + ball.radius)
        && (ball.x + ball.radius) <= _data.x + 1 
        && _data.y <= (ball.y + ball.radius) 
        && (ball.y - ball.radius) <= _data.y + _data.height 
        && ball.moveX > 0){
            console.log('left touch');
            ball.moveX = ball.moveX * -1;
            return true;
    }

    // right touch 
    if(_data.x + (_data.width - 1) <= (ball.x - ball.radius)
        && (ball.x - ball.radius) <= _data.x + _data.width 
        && _data.y <= (ball.y + ball.radius) 
        && (ball.y - ball.radius) <= _data.y + _data.height 
        && ball.moveX < 0
        ){
            console.log('right touch');
            // clearInterval(play)
            ball.moveX = ball.moveX * -1;
            return true;
    }

    // top touch
    if(_data.y <= (ball.y + ball.radius)
        && (ball.y + ball.radius) <  _data.y + (_data.height / 2) 
        && (_data.x + 1) < (ball.x + ball.radius)
        && (ball.x - ball.radius) <  (_data.x + _data.width - 1) 
        && ball.moveY < 0){
            ball.moveY = ball.moveY * -1;
            console.log('top touch');
            return true;
    }

    // bottom touch
    if( _data.y + (_data.height / 2) <= ball.y - ball.radius 
        && ball.y - ball.radius <= _data.y + _data.height
        && (_data.x + 1) < (ball.x + ball.radius)
        && (ball.x - ball.radius) < _data.x + (_data.width - 1) 
        && ball.moveY > 0){
            console.log('bottom touch');
            ball.moveY = ball.moveY * -1;
            return true;
    }
}

function playGame(){
    if(brick.row * brick.line * brick.score == game.score){
        clearInterval(playBall);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGame();

    if(ball.x + ball.radius >= canvas.width || ball.x - ball.radius < 0){
        ball.moveX = -ball.moveX;
    }

    if(ball.y + ball.radius >= canvas.height  || ball.y - ball.radius < game.startHeight){
        ball.moveY = -ball.moveY;
    }

    if(paddle.leftPress && paddle.x  > 0){
        paddle.x -= paddle.speed;
    }else if(paddle.rightPress && paddle.x + paddle.width < canvas.width){
        paddle.x += paddle.speed;
    }

    // ball + paddle
    brickTouch(paddle);

    // ball + brick
    for(var i in bricksData){
        for(var j in bricksData[i]){
            var _bricksData = bricksData[i][j];
            var _bricks = {
                width :  _bricksData.width,
                height : _bricksData.height,
                x : _bricksData.x,
                y : _bricksData.y
            };

            if(bricksData[i][j].status > 0){
                if(brickTouch(_bricks)){
                    bricksData[i][j].status -= 1;
                    game.score += brick.score;
                }
            }
        }
    }

    ball.x += ball.moveX; 
    ball.y -= ball.moveY; 
}   

// 실행
drawGame();    
playGame();
var playBall = setInterval(playGame, 10);

//clearInterval(game);