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
        if (this.objType == 3 || this.objType == 7)
        {
            if (this.objType == 7)
            {
                if (Math.round(this.lerpedX) != Math.round(lerp(this.lerpedX, this.x * 16, 0.1)) || 
                Math.round(this.lerpedY) != Math.round(lerp(this.lerpedY, this.y * 16, 0.1)))
                {
                    if (this.frameX != 3)
                    {
                        this.frameX++
                    }
                    else
                    {
                        this.frameX = 0;
                    }
                }
                else if (Math.round(this.lerpedX) == this.x * 16 && Math.round(this.lerpedY) == this.y * 16)
                {
                    this.frameX = 0;
                }
            }

            //console.log(Math.round(this.lerpedX) + " " + Math.round(lerp(this.lerpedX, this.x * 16, 0.1)) + " " + Math.round(this.lerpedY) + " " + Math.round(lerp(this.lerpedY, this.x * 16, 0.1)) + " " + this.moving);

            this.lerpedX = lerp(this.lerpedX, this.x * 16, 0.1);
            this.lerpedY = lerp(this.lerpedY, this.y * 16, 0.1);

            ctx.drawImage(this.img, 16 * this.frameX, 16 * this.frameY, 16, 16, Math.round(this.lerpedX), Math.round(this.lerpedY), 16, 16);
            //console.log(this.lerpedX + " " + this.lerpedY + " " + this.x + " " + this.y);
        }

    }
};

///// LOADING /////

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
