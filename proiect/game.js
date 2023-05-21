const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var gridHeight = 10, gridWidth = 16;

canvas.height = 16 * gridHeight;
canvas.width = 16 * gridWidth;

/*
Type 0: Background;
Type 1: Damage (reset) Object;
Type 2: Pressure Plate;
Type 3: Pushable/Weighted Object;
Type 4: Obstacle/Barrier;
Type 5: On/Off Obstacle;
Type 6: Goal;
Type 7: Player.

(Array-ul objectList de mai jos va fi sortat în funcție de objType pentru rendering fără probleme vizuale pe canvas)
*/

var objectList = [],
soundList =
[
    "music.mp3",
    "pickupCoin.wav",
    "reset.wav",
    "walk.wav",
    "weird.wav"
],
soundBank = [];

for (var i = 0; i < soundList.length; i++)
{
    var sound = new Audio();
    sound.src = "sounds/" + soundList[i];
    soundBank.push(sound);
}
soundBank[0].loop = true;

var muteButton = document.getElementById("muteButton");
var audioMuted = false;

class object
{
    constructor(x, y, img)
    {
        this.img = new Image();
        this.img.src = "images/gameAssets/" + img + ".png";
        this.x = x;
        this.y = y;
        this.frameX = 0;
        this.frameY = 0;
        this.lerpedX = x * 16;
        this.lerpedY = y * 16;
        objectList.push(this);
    }
    /*checkAdjacency() // PUSHABLE OBJECT CONDITION CHECKER
    {

    }*/
    updateObj()
    {
        ctx.drawImage(this.img, 16 * this.frameX, 16 * this.frameY, 16, 16, Math.round(this.lerpedX), Math.round(this.lerpedY), 16, 16);
    }
};

class plrObj extends object
{
    constructor(x, y)
    {
        super(x, y, "character");
        this.moving = false;
    }
    updateObj()
    {
        this.lerpedX = lerp(this.lerpedX, this.x * 16, 0.1);
        this.lerpedY = lerp(this.lerpedY, this.y * 16, 0.1);

        if (Math.round(this.lerpedX) != this.x * 16 || Math.round(this.lerpedY) != this.y * 16)
        {
            this.moving = true;
        }
        else
        {
            this.moving = false;
        }

        if ((Math.round(this.lerpedX) != Math.round(lerp(this.lerpedX, this.x * 16, 0.1)) || 
        Math.round(this.lerpedY) != Math.round(lerp(this.lerpedY, this.y * 16, 0.1))))
        {
            if (Math.round(this.lerpedX) % 2 != 0 || Math.round(this.lerpedY) % 2 != 0)
            {
                if (this.frameX != 3 && this.moving)
                {
                    this.frameX++;
                }
                else
                {
                    this.frameX = 0;
                }
                
                soundBank[3].play();
            }
        }
        // ^^^ WEBXEL CHAR/PLAYER ANIMATION CODE ^^^

        if (!this.moving) // Fixes the animation stuck on walk issue :O
        {
            setTimeout(() =>
            {
                if (!this.moving)
                {
                    this.frameX = 0;
                }
            }, 100);
        }
        super.updateObj();
    }
}

/*class pushObj extends object
{
    updateObj()
    {
        super.updateObj();
    }
    checkAdjacency()
    {
    }
}*/

///// LOADING OBJECTS /////

const player = new plrObj(0, 0);

console.log(player.constructor.name);

objectList.sort((a, b) =>
{
    return a.objType - b.objType;
});

soundBank[0].play();

///// DIVERSE FUNCȚII /////

window.addEventListener("keydown", movePlayer, false);

muteButton.addEventListener("click", function()
{
    if (audioMuted)
    {
      audioMuted = false;
      muteButton.style = "background-position-x: 0px";
    }
    else
    {
      audioMuted = true;
      muteButton.style = "background-position-x: -40px";
    }
    for (var i = 0; i < soundList.length; i++)
    {
        soundBank[i].muted = audioMuted;
    }
});

function movePlayer(e)
{
    if (!player.moving)
    {
        player.moving = true;
        player.frameX = 0;
        switch(e.keyCode)
        {
            case 37: // STÂNGA
                if (player.x - 1 >= 0)
                {
                    player.x--;
                    player.frameY = 1;
                }
                break;
            case 38: // SUS
                if (player.y - 1 >= 0)
                {
                    player.y--;
                }
                break;
            case 39: // DREAPTA
                if (player.x + 1 <= canvas.width / 16 - 1)
                {
                    player.x++;
                    player.frameY = 0;
                }
                break;
            case 40: // JOS
                if (player.y + 1 <= canvas.height / 16 - 1)
                {
                    player.y++;
                }
                break;  
        }
    }
} 

function lerp(start, end, t)
{
    return start * (1 - t) + end * t;
}

///// UPDATE /////

let objLLen = objectList.length;

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < objLLen; i++)
    {
        objectList[i].updateObj();
    }

    requestAnimationFrame(draw);
}
draw();
