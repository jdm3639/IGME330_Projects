import * as utils from "./utils.js";
import * as classes from "./classes.js";

let ctx, canvas;
let gradient;
let player;
let sprites = [];
let orbs = [];
let phyllo = [];
let keysDown = [];
let timeTillNextOrb = 0;

let collectedOrbs = 0;
let requiredOrbs = 5;
let score = 0;
let frames = 0;
let seconds = 0;
let timer = 60;

let timerTillNextEnterForMenu = 0;

const Scenes = { "Menu": 1, "Game": 2, "Endgame": 3, "Win": 4 };

let currentScene = Scenes.Menu;

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

    for (let i = 0; i < 100; i++) {
        keysDown.push(false);
    }

    setupUI();

    loop();
}

function buildGameScene() {
    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    player = new classes.Sprite(50, canvasHeight / 2, 12, { x: 0, y: 0 }, 0, "pink");
    player.draw(ctx);

    orbs = [];
    phyllo = [];
    phyllo.push(new classes.Phyllo(1200, 350, utils.getRandomUnitVector, 137.5, 50, 30));
    phyllo.push(new classes.Phyllo(200, 350, utils.getRandomUnitVector, 137.5, 50, 30));

    timer = 60;
    seconds = 0;
    frames = 0;
    collectedOrbs = 0;
    score = 1000;
}

function loop() {
    requestAnimationFrame(loop);

    window.addEventListener('keyup', keyUpHandler, false);
    window.addEventListener('keydown', keyDownHandler, false);

    timerTillNextEnterForMenu -= 0.01;

    switch (currentScene) {
        case Scenes.Menu:
            menuLoop();
            break;
        case Scenes.Game:
            gameLoop();
            break;
        case Scenes.Endgame:
            endgameLoop();
            break;
        case Scenes.Win:
            winLoop();
            break;
    }
}

function menuLoop() {
    // draw background
    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    ctx.save();
    ctx.font = "100px Arial";
    ctx.fillStyle = "lightgreen";
    ctx.textAlign = "center";
    ctx.fillText("Phyllostroids", (canvasWidth / 2), 140);

    ctx.font = "30px Arial";
    ctx.fillStyle = "gold";
    ctx.textAlign = "center";
    ctx.fillText("Press ENTER to start", (canvasWidth / 2), 200);

    ctx.font = "30px Arial";
    ctx.fillStyle = "pink";
    ctx.textAlign = "center";
    ctx.fillText("Press T to play tutorial", (canvasWidth / 2), 250);
    
    const howToPlay = `Controls:\n
[W] : Move Player Up\n
[A] : Move Player Left\n
[S] : Move Player Down\n
[D] : Move Player Right\n\n
Objective:\n
Navigate the Player (pink square) across the screen from left to right.\n
Avoid colliding with the Asteroids (white, black, or red circles).\n
Collect 5 (or more) Orbs (gold circles) before reaching the right side.\n
Reach the right side with 5 Orbs before the timer runs out to win.`;

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    let lines = howToPlay.split("\n");
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 100, 300 + (i * 13));
    }   
    ctx.restore();

    if (keysDown[13] && timerTillNextEnterForMenu < 0) {
        timerTillNextEnterForMenu = 1;
        currentScene = Scenes.Game;
        buildGameScene();
    }
}

function winLoop() {
    // draw background
    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    ctx.save();
    ctx.font = "100px Arial";
    ctx.fillStyle = "lightgreen";
    ctx.textAlign = "center";
    ctx.fillText("You win", (canvasWidth / 2), 140);

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Press enter to return to the menu", (canvasWidth / 2), 200);

    ctx.font = "70px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Score\n${Math.floor(score)}`, (canvasWidth / 2), 500);
    ctx.restore();

    if (keysDown[13] && timerTillNextEnterForMenu < 0) {
        timerTillNextEnterForMenu = .5;
        currentScene = Scenes.Menu;
    }
}

function endgameLoop() {
    // draw background
    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    ctx.save();
    ctx.font = "100px Arial";
    ctx.fillStyle = "#FF555C";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", (canvasWidth / 2), 140);

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Press enter to return to the menu", (canvasWidth / 2), 200);
    ctx.restore();

    if (keysDown[13] && timerTillNextEnterForMenu < 0) {
        timerTillNextEnterForMenu = .5;
        currentScene = Scenes.Menu;
    }
}

function gameLoop() {
    // draw background
    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // draw exit area
    ctx.save();
    ctx.fillStyle = collectedOrbs >= requiredOrbs ? "lightgreen" : "#FF555C";
    ctx.fillRect(canvasWidth - 50, 0, 50, canvasHeight);
    ctx.restore();

    orbSpawner();

    phyllo[0].addCircle(utils.getRandom(6, 15), "white");
    phyllo[0].move(-.3, 0);
    phyllo[0].rotate(.002);

    phyllo[1].addCircle(utils.getRandom(6, 15), "black");
    phyllo[1].move(.3, 0);
    phyllo[1].rotate(.002);

    moveAndDrawSprites(ctx);

    // utils.drawCircleWithShadowFromPoint(ctx, 100,100,5,"red",getPlayer().x, getPlayer().y)

    movePlayer();

    // draw player
    ctx.save();
    ctx.translate(player.fwd.x, player.fwd.y);
    player.draw(ctx);
    ctx.restore();

    // check to see if the player is completing the game
    if (collectedOrbs >= requiredOrbs && player.x > canvasWidth - 50) {
        currentScene = Scenes.Win;
    }

    // check collision on phyllos
    for (let i = 0; i < phyllo.length; i++) {
        if (phyllo[i].isCollidingCheck({ x: player.x, y: player.y }, 10) != null) {
            currentScene = Scenes.Endgame;
            // console.log("player hit a phyllo!");
            break;
        }
    }

    // check collisions on orbs
    for (let i = 0; i < orbs.length; i++) {
        if (orbs[i].isCollidingCheck({ x: player.x, y: player.y }, 10, i) == true) {
            // console.log("player hit an orb!");
            orbs[i].color = "grey";
            collectedOrbs++;
            score += 100;
            break;
        }
    }

    // HUD
    frames++;
    seconds = Math.floor(frames / 60);
    score -= .1;

    ctx.font = "40px Arial";
    ctx.fillStyle = "lightgreen";
    ctx.fillText("Score: " + Math.floor(score), 10, 40);

    ctx.font = "30px Arial";
    ctx.fillText(`Timer: ${(timer - seconds)}s`, 30, 80);
    ctx.fillText(`Orbs: ${collectedOrbs} / ${requiredOrbs}`, 30, 120);
}

function keyDownHandler(e) {
    if (e.keyCode < 100)
        keysDown[e.keyCode] = true;
}

function keyUpHandler(e) {
    if (e.keyCode < 100)
        keysDown[e.keyCode] = false;
}

function orbSpawner() {
    if (timeTillNextOrb < 0) {
        let orb = new classes.Orb(utils.getRandom(0, canvasWidth), 15, 5, { x: 0, y: 1 }, 1, "gold");
        orbs.push(orb);
        timeTillNextOrb = 1;
    }

    timeTillNextOrb -= 0.01;
}

export function getPlayer() {
    return player;
}

function movePlayer() {
    //console.log(`Key pressed: ${e.keyCode}`);
    if (keysDown[65]) {
        player.x -= 1.5;
    }
    if (keysDown[68]) {
        player.x += 1.5;
    }
    if (keysDown[83]) {
        player.y += 1.5;
    }
    if (keysDown[87]) {
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
    for (let orb of orbs) {
        orb.move();
        orb.draw(ctx);
    }

    // for (let s of sprites) {
    //     s.move();

    //     if (s.x <= s.span / 2 || s.x >= canvasWidth - s.span / 2) {
    //         s.reflectX();
    //         s.move();
    //     }
    //     if (s.y <= s.span / 2 || s.y >= canvasHeight - s.span / 2) {
    //         s.reflectY();
    //         s.move();
    //     }
    //     s.draw(ctx);
    // }
    for (let p of phyllo) {

        if (p.x <= p.span / 2 || p.x >= canvasWidth - p.span / 2) {
            p.reflectX();
        }
        if (p.y <= p.span / 2 || p.y >= canvasHeight - p.span / 2) {
            p.reflectY();
        }

        p.draw(ctx);
    }

    ctx.restore();
}


export { init };