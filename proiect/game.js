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

const player =
{
    x: 0,
    y: 0,
    frameX: 0,
    frameY: 0
};

var objectNr = 0;
const objectList = []

class object
{
    constructor(x, y, objType, texture)
    {
        this.img = new Image();
        this.img.src = "images/gameAssets/" + texture + ".png";
        this.x = x;
        this.y = y;
        this.objType = objType;
    }
};