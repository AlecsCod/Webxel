const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 240;
canvas.height = 160;

/*
Type 0: Background;
Type 1: Damage (reset) Object;
Type 2: Pressure Plate;
Type 3: Pushable/Weighted Object;
Type 4: Obstacle/Barrier;
Type 5: On/Off Obstacle;
Type 6: Goal;
Type 7: Player.

(Z Index va lua valoarea tipului obiectului)
*/

var objectNr = 0;
const objectList = [];

class object
{
    constructor(x, y, objType, img)
    {
        this.img = new Image();
        this.img.src = "images/gameAssets/" + img + ".png";
        this.x = x;
        this.y = y;
        this.objType = objType;
        this.frameX = 0;
        this.frameY = 0;
        objectList.push(this);
        this.lerpedX = x * 16;
        this.lerpedY = y * 16;
    }
    updateObj()
    {
        if (this.lerpedX != this.x || this.lerpedY != this.y)
        {
            this.lerpedX = lerp(this.lerpedX, this.x * 16, 0.1);
            this.lerpedY = lerp(this.lerpedY, this.y * 16, 0.1);
        }

        ctx.drawImage(this.img, 0, 0, 16, 16, Math.round(this.lerpedX), Math.round(this.lerpedY), 16, 16);
        //console.log(this.lerpedX + " " + this.lerpedY + " " + this.x + " " + this.y);
    }
};

///// LOADING /////

const background = new Image();
background.src = "images/gameAssets/metal_plate.png";

const player = new object(0, 0, 7, "character");

objectList.sort((a, b) =>
{
    return a.objType - b.objType;
});

///// DIVERSE FUNCȚII /////

window.addEventListener("keydown", movePlayer, false);

function movePlayer(e)
{
    switch(e.keyCode)
    {
        case 37: // STÂNGA
            if (player.x - 1 >= 0)
            {
                player.x--;
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

function lerp(start, end, t)
{
    return start * (1 - t) + end * t;
}

///// UPDATE /////

let objLLen = objectList.length, pat = ctx.createPattern(background, 'repeat');

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pat;
    ctx.fill();

    for (var i = 0; i < objLLen; i++)
    {
        objectList[i].updateObj();
    }

    requestAnimationFrame(draw);
}
draw();
