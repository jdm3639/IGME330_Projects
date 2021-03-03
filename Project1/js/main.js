import * as utils from "./utils.js";
import * as classes from "./classes.js";

let ctx, canvas;
let gradient;
let player;
let sprites = [];
let bombs = [];
let timeTillNextBomb = 0;
const canvasWidth = 1280, canvasHeight = 620;

function init() {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    gradient = utils.createLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: "blue" }, { percent: .25, color: "green" }, { percent: .5, color: "yellow" }, { percent: .75, color: "red" }, { percent: 1, color: "magenta" }])

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    player = new classes.Sprite(canvasWidth / 2, (canvasHeight / 8) * 7, 12);
    player.draw(ctx);

    setupUI();

    loop();
}

function loop() {
    requestAnimationFrame(loop);

    // draw background
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    window.addEventListener('keydown', move);

    ctx.save();
    ctx.translate(player.fwd.x, player.fwd.y);
    player.draw(ctx);
    ctx.restore();

    bombSpawner();

    //window.addEventListener("keydown", move);
    moveAndDrawSprites(ctx);
}

// let n = 0;
// const divergence = 137.5;
// const c = 4;

// function loop() {
//     setTimeout(loop, 1000 / 30);

//     // each frame draw a new dot
//     // `a` is the angle
//     // `r` is the radius from the center (e.g. "Pole") of the flower
//     // `c` is the "padding/spacing" between the dots
//     let a = n * dtr(divergence);
//     let r = c * Math.sqrt(n);
//     //console.log(a, r);

//     // now calculate the `x` and `y`
//     let x = r * Math.cos(a) + canvasWidth / 2;
//     let y = r * Math.sin(a) + canvasHeight / 2;
//     //console.log(x, y);

//     let aDegrees = (n * divergence) % 361;
//     let color = `hsl(${n/5 % 361},100%,50%)`;
//     drawCircle(ctx, x, y, aDegrees / 100, color);

//     n++;
// }

// // helpers
// function dtr(degrees) {
//     return degrees * (Math.PI / 180);
// }

// function drawCircle(ctx, x, y, radius, color) {
//     ctx.save();
//     ctx.fillStyle = color;
//     ctx.beginPath();
//     ctx.arc(x, y, radius, 0, Math.PI * 2);
//     ctx.closePath();
//     ctx.fill();
//     ctx.restore();
// }

function bombSpawner() {
    if (timeTillNextBomb < 0) {
        let bomb = new classes.Bomb(utils.getRandom(0, canvasWidth), 15, 5, { x: 0, y: 1 }, 1,"black");
        bombs.push(bomb);
        sprites.push(bomb);
        timeTillNextBomb = 1;
    }
    
    timeTillNextBomb -= 0.01;
    
}

function move(e) {
    if(e.keyCode == 37) { 
        player.fwd.x -= 4.5;
	}
	if(e.keyCode == 39) {
        player.fwd.x += 4.5;
	}
}

function setupUI() {
    let radioButtons = document.querySelectorAll("input[type=radio][name=speed]");
    for (let r of radioButtons) {
        r.onchange = function (e) {
            let speed = Number(e.target.value);
            for (let s of sprites) {
                s.speed = Math.random() + speed;
            }
        }
    }
}

function createSprites(num = 5, classRef = Sprite) {
    let array = [];

    for (let i = 0; i < num; i++) {
        let x = Math.random() * (canvasWidth - 100) + 50;
        let y = Math.random() * (canvasHeight - 100) + 50;
        let span = 15 + Math.random() * 25;
        let fwd = utils.getRandomUnitVector();
        let speed = Math.random() + 2;
        let color = utils.getRandomColor();
        let s = new classRef(x, y, span, fwd, speed, color);

        array.push(s);
    }
    return array;
}

function moveAndDrawSprites(ctx) {
    ctx.save();
    for (let s of sprites) {
        s.move();

        if (s.x <= s.span / 2 || s.x >= canvasWidth - s.span / 2) {
            s.reflectX();
            s.move();
        }
        if (s.y <= s.span / 2 || s.y >= canvasHeight - s.span / 2) {
            s.reflectY();
            s.move();
        }
        s.draw(ctx);
    }
    ctx.restore();
}

export {init};