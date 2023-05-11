const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const keys = [];

const player = {
    x: 0,
    y: 0,
    width: ???,
    height: ???,
    frameX: 0,
    frameY: 0,
    speed: 8,
    moving: false
};

const playerSprite = new Image();
playerSprite.src = "images/gameAssets/character.png"