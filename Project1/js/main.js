import * as utils from "./utils.js";
import * as classes from "./classes.js";

let ctx, canvas;
let gradient;
let player;
export let sprites = [];
const canvasWidth = 1280, canvasHeight = 620;
export let spriteImage = undefined;

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
    window.addEventListener('keydown', move);
    //window.addEventListener("keydown", move);
    moveAndDrawSprites(ctx);
}

function move(e) {
    if(e.keyCode == 37) { 
        console.log("Go left");
        ctx.save();
        ctx.translate(10, 0);
        player.draw(ctx);
        ctx.restore();
	}
	if(e.keyCode == 39) {
        console.log("Go right");
        ctx.save();
        player.fwd.x = 1;
        player.fwd.y = 0;
        player.move();
        player.draw(ctx);
        ctx.restore();
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

function createImageSprites(num, image) {
    let array = [];

    for (let i = 0; i < num; i++) {
        let x = Math.random() * (canvasWidth - 100) + 50;
        let y = Math.random() * (canvasHeight - 100) + 50;
        let span = 15 + Math.random() * 25;
        let fwd = utils.getRandomUnitVector();
        let speed = Math.random() + 2;
        let s = new ImageSprite(x, y, span, fwd, speed, image);

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

export {init, startLoop};