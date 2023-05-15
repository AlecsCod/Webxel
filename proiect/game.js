const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 160;
canvas.height = 160;

const keys = [];

const player = {
    x: 0,
    y: 0,
    width: 16,
    height: 16,
    frameX: 0,
    frameY: 0,
    speed: 8,
    moving: false
};

const playerSprite = new Image();
playerSprite.src = "images/gameAssets/character.png";
const background = new Image();
background.src = "images/gameAssets/tiles.png";

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

var currentKey;

window.addEventListener("keydown", (keyyy) => {
    currentKey = keyyy.key;
    player.moving = true;
    console.log(currentKey);
});
window.addEventListener("keyup", (keyyy) => {
    currentKey = null;
    player.moving = false;
});

function movePlayer()
{
    switch(currentKey)
    {
        case "w":
            if (player.y > 100)
            {
                player.y -= player.speed;
                player.frameY = 3;
                player.moving = true;
            }
        case "a":
            if (player.x > 0)
            {
                player.x -= player.speed;
                player.frameY = 1;
                player.moving = true;
            }
        case "s":
            if (player.y < canvas.height - player.height) {
                player.y += player.speed;
                player.frameY = 0;
                player.moving = true;
            }
        case "d":
            if (player.x < canvas.width - player.width)
            {
                player.x += player.speed;
                player.frameY = 2;
                player.moving = true;
            }
    }
}

function handlePlayerFrame() {
    if (player.frameX < 3 && player.moving) player.frameX++
    else player.frameX = 0;
}

let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps){
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate()
}

function animate(){
    requestAnimationFrame(animate)
    now = Date.now();
    elapsed = now - then;
    movePlayer();
    if (elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var pat = ctx.createPattern(background, 'repeat');
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pat;
        ctx.fill();

        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
        
        handlePlayerFrame();
    }
}
startAnimating(60);