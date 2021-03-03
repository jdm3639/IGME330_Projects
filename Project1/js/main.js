import * as utils from "./utils.js";
import * as classes from "./classes.js";

let ctx, canvas;
let gradient;
let player;
let sprites = [];
let bombs = [];
let phyllo = [];
let keysDown = [];
let timeTillNextBomb = 0;
export const canvasWidth = 1280, canvasHeight = 620;

// NOTES:
// * make phyllos bounce 
// * HUD -do now-
// * Start button
// * collison calculate -do now-
// * end game -do now-
// * (possible) fix shadows
// * (possible) background image
// * (possible) sound effects
// * (possible) music
// * css file (fonts, format, etc.)
// * missles > orbs (make collectable) -do now-

function init() {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    //gradient = utils.createLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: "blue" }, { percent: .25, color: "green" }, { percent: .5, color: "yellow" }, { percent: .75, color: "red" }, { percent: 1, color: "magenta" }])

    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    player = new classes.Sprite(canvasWidth / 2, (canvasHeight / 8) * 7, 12, {x: 0, y:0},0,"pink");
    player.draw(ctx);

    phyllo.push(new classes.Phyllo(1200, 350, 137.5, 50, 30));
    phyllo.push(new classes.Phyllo(200, 350, 137.5, 50, 30));

    for (let i = 0; i < 100; i++) {
        keysDown.push(false);
    }

    setupUI();

    loop();
}

function loop() {
    requestAnimationFrame(loop);

    // draw background
    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    window.addEventListener('keyup', keyUpHandler, false);
    window.addEventListener('keydown', keyDownHandler , false);

    ctx.save();
    ctx.translate(player.fwd.x, player.fwd.y);
    player.draw(ctx);
    ctx.restore();

    bombSpawner();

    phyllo[0].addCircle(utils.getRandom(6, 15), "white");
    phyllo[0].move(-.3, 0);
    phyllo[0].rotate(.002);

    phyllo[1].addCircle(utils.getRandom(6, 15), "black");
    phyllo[1].move(.3, 0);
    phyllo[1].rotate(.002);

    //utils.drawCircleWithShadowFromPoint(ctx, 100,100,5,"red",getPlayer().x, getPlayer().y)

    movePlayer();
    

    //window.addEventListener("keydown", move);
    moveAndDrawSprites(ctx);
}

function keyDownHandler(e) {
    
    if (e.keyCode < 100)
        keysDown[e.keyCode] = true;
}

function keyUpHandler(e) {
    if (e.keyCode < 100)
        keysDown[e.keyCode] = false;
}

function bombSpawner() {
    if (timeTillNextBomb < 0) {
        let bomb = new classes.Bomb(utils.getRandom(0, canvasWidth), 15, 5, { x: 0, y: 1 }, 1,"lightgreen");
        bombs.push(bomb);
        sprites.push(bomb);
        timeTillNextBomb = 1;
    }
    
    timeTillNextBomb -= 0.01;
    
}

export function getPlayer() {
    return player;
}

function movePlayer() {
    //console.log(`Key pressed: ${e.keyCode}`);
    if(keysDown[65]) { 
        player.x -= 1.5;
	}
	if(keysDown[68]) {
        player.x += 1.5;
	}
    if(keysDown[83]) {
        player.y += 1.5;
	}
    if(keysDown[87]) {
        player.y -= 1.5;
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
    for (let p of phyllo) {
        p.draw(ctx);
    }

    ctx.restore();
}

export {init};