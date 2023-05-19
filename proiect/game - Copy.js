const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 240;
canvas.height = 160;

const keys = [];

const player = {
    x: 0,
    y: 0,
    width: 16,
    height: 16,
    frameX: 0,
    frameY: 0,
    speed: 1,
    moving: false
};

const box = {
    x: 32,
    y: 32,
    width: 16,
    height: 16,
    frameX: 0,
    frameY: 0,
};

const playerSprite = new Image();
playerSprite.src = "images/gameAssets/character.png";
const background = new Image();
background.src = "images/gameAssets/metal_plate.png";
const boxSprite = new Image();
boxSprite.src = "images/gameAssets/box.png";

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}


window.addEventListener("keydown", function (keyEvent) {
    keys[keyEvent.keyCode] = true;
    if (keyEvent.keyCode >= 39 && keyEvent.keyCode <= 40) player.moving = true;
});

window.addEventListener("keyup", function(keyEvent) {
    delete keys[keyEvent.keyCode];
    player.moving = false;
});

function movePlayer()
{
    if (keys[38] && player.y > 0)
    {
        player.y -= player.speed;
        //player.frameY = 3;
        player.moving = true;
    }
    if (keys[37] && player.x > 0)
    {
        player.x -= player.speed;
        player.frameY = 1;
        player.moving = true;
    }
    if (keys[40] && player.y < canvas.height - player.height) {
        player.y += player.speed;
        //player.frameY = 0;
        player.moving = true;
    }
    if (keys[39] && player.x < canvas.width - player.width)
    {
        player.x += player.speed;
        player.frameY = 2;
        player.moving = true;
    }
}

function moveBox()
{
    if (keys[38] && box.y + 16 == player.y && player.x + 16 >= box.x && box.x + 16 > player.x && box.y > 16)
    {
        box.y -= player.speed;
    }
    if (keys[37] && box.x + 16 == player.x && player.y + 16 >= box.y && box.y + 15 > player.y && box.x > 16)
    {
        box.x -= player.speed;
    }
    if (keys[40] && player.y + 16 == box.y && box.x + 16 >= player.x && player.x + 15 > box.x && box.y < canvas.height - box.height - 16) {
        box.y += player.speed;
    }
    if (keys[39] && player.x + 16 == box.x && box.y + 16 >= player.y && player.y + 15 > box.y && box.x < canvas.width - box.width - 16)
    {
        box.x += player.speed;
    }
}

function handlePlayerFrame() {
    if (player.frameX < 3 && player.moving) player.frameX++
    else player.frameX = 0;
}

let fps, fpsInterval, startTime, now, then, elapsed, sinceStart = 0;

function startAnimating(fps){
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate()
}

function animate(){
    now = Date.now();
    elapsed = now - then;
    requestAnimationFrame(animate);
    
    if (elapsed > fpsInterval){
        sinceStart++;
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var pat = ctx.createPattern(background, 'repeat');
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pat;
        ctx.fill();

        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
        drawSprite(boxSprite, box.width * box.frameX, box.height * box.frameY, box.width, box.height, box.x, box.y, box.width, box.height);
        movePlayer();
        moveBox();

        if (sinceStart / 2 % 4 == 0){
            handlePlayerFrame();
        }
    }
}
startAnimating(60);