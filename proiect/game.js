const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gridHeight = 10, gridWidth = 16;

canvas.height = 16 * gridHeight;
canvas.width = 16 * gridWidth;

/*
Type 0: Background/Undefined;
Type 1: Damage (reset) Object;
Type 2: Button;
Type 3: Pushable Object;
Type 4: Obstacle/Barrier;
Type 5: Gate;
Type 6: Goal;
Type 7: Gem;
Type 8: Player.

(Array-ul objectList de mai jos va fi sortat în funcție de objType pentru rendering fără probleme vizuale pe canvas)
*/

let mapJSON = {"x": [], "y": [], "objType": []},
objectList = [],
soundList =
[
    "music.mp3",
    "pickupCoin.wav",
    "reset.wav",
    "walk.wav",
    "weird.wav",
    "buttonClick.wav"
],
soundBank = [],
gemArray = [],
pushableArray = [],
buttonArray = [],
frameSpeedHandler = 0,
muteButton = document.getElementById("muteButton"),
addButton = document.getElementById("addButton"),
removeButton = document.getElementById("removeButton"),
xInput = document.getElementById("xInput"),
yInput = document.getElementById("yInput"),
options = document.getElementById("options"),
testButton = document.getElementById("testButton"),
scoreDisplay = document.getElementById("scoreDisplay"),
audioMuted = false,
collectedGems = 0,
playing = false;

for (var i = 0; i < soundList.length; i++)
{
    var sound = new Audio();
    sound.src = "sounds/" + soundList[i];
    soundBank.push(sound);
}
soundBank[0].loop = true;

class object
{
    constructor(x, y, img, objType)
    {
        this.initX = x;
        this.initY = y;
        this.objType = objType;
        this.img = new Image();
        this.img.src = "images/gameAssets/" + img + ".png";
        this.x = x;
        this.y = y;
        this.frameX = 0;
        this.frameY = 0;
        this.lerpedX = x * 16;
        this.lerpedY = y * 16;
        this.solidObject = false;
        objectList.push(this);
    }
    updateObj()
    {
        ctx.drawImage(this.img, 16 * this.frameX, 16 * this.frameY, 16, 16, Math.round(this.lerpedX), Math.round(this.lerpedY), 16, 16);
    }
};

class plrObj extends object
{
    constructor(x, y)
    {
        super(x, y, "character", 8);
        this.moving = false;
        this.solidObject = true;
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
    moveMisc() // Anim. reset, sunet
    {
        this.moving = true;
        this.frameX = 0;
        playSound(3);
    }
    blockedCheck(direction) // Verifică dacă personajul jucătorului este blocat de un obiect solid (inclusiv marginile canvas-ului) la o anumită direcție
    {
        for(var i = 0; i < objectList.length; i++)
            if(objectList[i].solidObject)
            {
                if(direction == 1 && ((objectList[i].x == this.x - 1 && objectList[i].y == this.y) || this.x == 0)) // LA STÂNGA
                    return true;
                if(direction == 2 && ((objectList[i].y == this.y - 1 && objectList[i].x == this.x) || this.y == 0)) // DEASUPRA
                    return true;
                if(direction == 3 && ((objectList[i].x == this.x + 1 && objectList[i].y == this.y) || this.x == gridWidth - 1)) // LA DREAPTA
                    return true;
                if(direction == 4 && ((objectList[i].y == this.y + 1 && objectList[i].x == this.x) || this.y == gridHeight - 1)) // DEDESUBT
                    return true;
            }
        return false;
    }
}

class gemObj extends object
{
    constructor(x, y)
    {
        super(x, y, "gem", 7);
        this.collected = false;
        gemArray.push(this);
    }
    updateObj()
    {
        if (frameSpeedHandler % 8 == 0)
        {
            if (this.frameX != 15)
            {
                this.frameX++;
            }
            else
            {
                this.frameX = 0;
            }
        }

        if (player.x == this.x && player.y == this.y && !this.collected && playing)
        {
            collectedGems++;
            updateScore();
            playSound(1);
            this.collected = true;
            this.frameY = 1;
        }

        super.updateObj();
    }
}

class pushObj extends object
{
    constructor(x, y)
    {
        super(x, y, "box", 3);
        this.collected = false;
        this.solidObject = true;
        pushableArray.push(this);
    }
    updateObj()
    {
        this.lerpedX = lerp(this.lerpedX, this.x * 16, 0.1);
        this.lerpedY = lerp(this.lerpedY, this.y * 16, 0.1);

        super.updateObj();
    }
    plrAdjacency() // Verifică dacă personajul jucătorului este adiacent cu obiectul și la ce direcție
    {
        if(player.x == this.x - 1 && player.y == this.y) // PLR. LA STÂNGA
            return 1;
        if(player.y == this.y - 1 && player.x == this.x) // PLR. DEASUPRA
            return 2;
        if(player.x == this.x + 1 && player.y == this.y) // PLR. LA DREAPTA
            return 3;
        if(player.y == this.y + 1 && player.x == this.x) // PLR. DEDESUBT
            return 4;
        return 0;
    }
    blockedCheck(direction) // Verifică dacă obiectul este blocat de un obiect solid (inclusiv marginile canvas-ului) la o anumită direcție
    {
        for(var i = 0; i < objectList.length; i++)
            if(objectList[i].solidObject)
            {
                if(direction == 1 && ((objectList[i].x == this.x - 1 && objectList[i].y == this.y) || this.x == 0)) // LA STÂNGA
                    return true;
                if(direction == 2 && ((objectList[i].y == this.y - 1 && objectList[i].x == this.x) || this.y == 0)) // DEASUPRA
                    return true;
                if(direction == 3 && ((objectList[i].x == this.x + 1 && objectList[i].y == this.y) || this.x == gridWidth - 1)) // LA DREAPTA
                    return true;
                if(direction == 4 && ((objectList[i].y == this.y + 1 && objectList[i].x == this.x) || this.y == gridHeight - 1)) // DEDESUBT
                    return true;
            }
        return false;
    }
}

class buttonObj extends object
{
    constructor(x, y)
    {
        super(x, y, "button", 2);
        this.active = false;
        buttonArray.push(this);
    }
    updateObj()
    {
        if (this.checkPressed())
        {
            if (!this.active)
            {
                this.active = true;
                playSound(5);
            }
        }
        else this.active = false

        super.updateObj();
    }
    checkPressed()
    {
        var pressed = false;
        if (player.x == this.x && player.y == this.y)
        {
            pressed = true;
        }
        else for(var i = 0; i < pushableArray.length; i++)
        {
            if (pushableArray[i].x == this.x && pushableArray[i].y == this.y)
            {
                pressed = true;
            }
        }
        return pressed;
    }
}

class gateObj extends object
{
    constructor(x, y)
    {
        super(x, y, "gate", 5);
        this.solidObject = true;
    }
    updateObj()
    {
        var check = 0;

        for(var i = 0; i < buttonArray.length; i++)
            if (buttonArray[i].active)
                check++;
        
        if (check == buttonArray.length)
        {
            this.solidObject = false;
            this.frameY = 1;
        }
        else
        {
            this.solidObject = true;
            this.frameY = 0;
        }

        super.updateObj();
    }
}

class wallObj extends object
{
    constructor(x, y)
    {
        super(x, y, "metal_plate", 4);
        this.solidObject = true;
    }
    updateObj()
    {
        super.updateObj();
    }
}

///// LOADING OBJECTS /////

const player = new plrObj(0, 0);

for (var i = 2; i <= 6; i++)
{
    for (var j = 2; j <= 4; j++)
    {
        new pushObj(i*2, j);
    }
}

for (var i = 12; i <= 15; i++)
{
    for (var j = 8; j <= 9; j++)
    {
        new gemObj(i, j);
    }
}

for (var i = 1; i <= 3; i++)
{
    new wallObj(11, i + 6);
    new wallObj(i + 12, 7);
}

for (var i = 1; i <= 4; i++)
{
    new buttonObj((i-1)*2, 9);
    for (var j = 1; j <= 3; j++)
    {
        new wallObj(i*2-1, j + 6);
    }
}


console.log(JSON.parse(JSON.stringify(objectList[2])));
console.log(objectList[2]);

new gateObj(12, 7);

/*objectList.sort((a, b) =>
{
    return a.objType - b.objType;
});*/

//soundBank[0].play();

///// DIVERSE FUNCȚII /////

window.addEventListener("keydown", movePlayer, false);

addButton.addEventListener("click", function()
{
    if(!playing)
    {
        var valX = parseInt(xInput.value), valY = parseInt(yInput.value), valO = parseInt(options.value), newObj;
        switch (parseInt(valO))
        {
            case 8:
                player.x = player.initX = valX; 
                player.y = player.initY = valY;
                break;
            case 7:
                console.log(1);
                newObj = new gemObj(valX, valY);
                //sortObj();
                break;
            case 5:
                newObj = new gateObj(valX, valY);
                break;
            case 4:
                newObj = new wallObj(valX, valY);
                break;
            case 3:
                newObj = new pushObj(valX, valY);
                break;
            case 2:
                newObj = new buttonObj(valX, valY);
                break;
        }
        sortObj();
        console.log(newObj);
    }
});

testButton.addEventListener("click", function()
{
    if(!playing)
    {
        testButton.innerHTML = "Stop";
        soundBank[0].play();
        if (!audioMuted) soundBank[0].muted = false;
        else soundBank[0].muted = true;
        playing = true;
    }
    else
    {
        testButton.innerHTML = "Test";
        soundBank[0].muted = true;
        resetLevel();
        playing = false;
    }
});

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
    if (!player.moving && playing)
    {
        switch(e.keyCode)
        {
            case 37: // STÂNGA
                movePushable(3);
                if(!player.blockedCheck(1))
                {
                    player.x--;
                    player.frameY = 1;
                    player.moveMisc();
                }
                break;
            case 38: // SUS
                movePushable(4);
                if(!player.blockedCheck(2))
                {
                    player.y--;
                    player.moveMisc();
                }
                break;
            case 39: // DREAPTA
                movePushable(1);
                if(!player.blockedCheck(3))
                {
                    player.x++;
                    player.frameY = 0;
                    player.moveMisc();
                    
                }
                break;
            case 40: // JOS
                movePushable(2);
                if(!player.blockedCheck(4))
                {
                    player.y++;
                    player.moveMisc();
                }
                break;  
        }
    }
} 

function updateScore()
{
    if(gemArray[0] != null)
    {
        scoreDisplay.innerHTML = collectedGems + "/" + gemArray.length + " Gems";
    }
    else scoreDisplay.innerHTML = "";
}

function playSound(number)
{
    soundBank[number].currentTime = 0;
    soundBank[number].play();
}

function lerp(start, end, t)
{
    return start * (1 - t) + end * t;
}

function movePushable(fromDir)
{
    if (pushableArray[0] != null) for (var i = 0; i < pushableArray.length; i++)
    {
        if (pushableArray[i].plrAdjacency() == fromDir) switch (pushableArray[i].plrAdjacency())
        {
            case 0:
                break;
            case 1:
                if (fromDir == 1 && !pushableArray[i].blockedCheck(3)) // SPRE DREAPTA
                    pushableArray[i].x++;
            case 2:
                if (fromDir == 2 && !pushableArray[i].blockedCheck(4)) // ÎN JOS
                    pushableArray[i].y++;
            case 3:
                if (fromDir == 3 && !pushableArray[i].blockedCheck(1)) // SPRE STÂNGA
                    pushableArray[i].x--;
            case 4:
                if (fromDir == 4 && !pushableArray[i].blockedCheck(2)) // ÎN SUS
                    pushableArray[i].y--;
            default:
                break;
        }
    }
}

function resetLevel()
{
    if (objectList[0] != null) for (var i = 0; i < objectList.length; i++)
    {
        objectList[i].x = objectList[i].initX;
        objectList[i].y = objectList[i].initY;
    }

    if (gemArray[0] != null) for (var i = 0; i < gemArray.length; i++)
    {
        gemArray[i].collected = false;
        gemArray[i].frameY = 0;
    }

    if (buttonArray[0] != null) for (var i = 0; i < buttonArray.length; i++)
    {
        buttonArray[i].active = false;
    }

    collectedGems = 0;
    updateScore();
}

function sortObj()
{
    objectList.sort((a, b) =>
    {
        return a.objType - b.objType;
    });
}

///// DRAW /////

sortObj();

for (i in objectList)
{
    mapJSON.x[i] = objectList[i].x;
    mapJSON.y[i] = objectList[i].y;
    mapJSON.objType[i] = objectList[i].objType;
}

console.log(mapJSON);

updateScore();

let objLLen = objectList.length;

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (frameSpeedHandler % 16 != 0)
    {
        frameSpeedHandler++;
    }
    else
    {
        frameSpeedHandler = 1;
    }

    for (var i = 0; i < objLLen; i++)
    {
        objectList[i].updateObj();
    }

    requestAnimationFrame(draw);
}
draw();
