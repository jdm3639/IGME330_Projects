import * as utils from "./utils.js";
import * as classes from "./classes.js";

// MAIN CODE

let ctx, canvas;
let gradient;
let player;
export let sprites = [];
const canvasWidth = 1280, canvasHeight = 720;
export let spriteImage = undefined;

function init() {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    gradient = utils.createLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: "blue" }, { percent: .25, color: "green" }, { percent: .5, color: "yellow" }, { percent: .75, color: "red" }, { percent: 1, color: "magenta" }])

    // #5 - make 2 different kinds of sprites and use `array.concat()` to append them to 
    // the `sprites` array
    //sprites = sprites.concat(sprites, createSprites(10, classes.Sprite));
    //sprites = sprites.concat(sprites, createSprites(20, classes.RingSprite));

    // draw background
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // init player
    player = new classes.Sprite(canvasWidth / 2, (canvasHeight / 8) * 7, 12);
    player.draw(ctx);


    // But cool kids use the spread operator instead of `array.concat()`
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    // sprites =  [...createSprites(10,Sprite), ...createSprites(20,RingSprite)];

    // hook up event handlers
    setupUI();

    // kick off animation loop
    load();
}

function load() {
    utils.preloadImage("https://www.pngkey.com/png/full/54-548095_oreo-oreo-cookies.png", function (image) {
        startLoop(image);
    });
}

function startLoop(image) {
    spriteImage = image;
    //sprites = sprites.concat(sprites, createImageSprites(10, spriteImage));

    console.log("Start loop");
    loop();
}

function loop() {
    // schedule a call to loop() in 1/60th of a second
    requestAnimationFrame(loop);

    // draw background
    // ctx.save();
    // ctx.fillStyle = gradient;
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // ctx.restore();

    document.onkeydown = move;
    //window.addEventListener("keydown", move);

    // move and draw sprites
    moveAndDrawSprites(ctx);
}

function move(e) {
    if(e.keyCode == 37) { 
        ctx.save();
        player.x = -1;
        player.y = 0;
        player.move();
        ctx.restore();
	}
	if(e.keyCode == 39) {
        ctx.save();
        player.x = 1;
        player.y = 0;
        player.move();
        ctx.restore();
		//player.x += player.speed;	
	}
}

function setupUI() {
    // #6 - note the attribute selector we are using here
    let radioButtons = document.querySelectorAll("input[type=radio][name=speed]");
    for (let r of radioButtons) {
        r.onchange = function (e) {
            // #7 - form values are returned as Strings, so we have to convert them to a Number
            let speed = Number(e.target.value);
            for (let s of sprites) {
                s.speed = Math.random() + speed;
            }
        }
    }
}

// #8 - Note that here we take a Class as a function to an argument
// That means that in JS, classes (as well as functions) are "first class" types like
// String, Number etc in that they can be passed as arguments to functions, and also
// returned from functions.
function createSprites(num = 5, classRef = Sprite) {
    // create array to hold all of our sprites
    let array = [];

    // make some sprites
    for (let i = 0; i < num; i++) {
        // determine random properties and instantiate new sprite
        let x = Math.random() * (canvasWidth - 100) + 50;
        let y = Math.random() * (canvasHeight - 100) + 50;
        let span = 15 + Math.random() * 25;
        let fwd = utils.getRandomUnitVector();
        let speed = Math.random() + 2;
        let color = utils.getRandomColor();
        let s = new classRef(x, y, span, fwd, speed, color);

        // add to end of array
        array.push(s);
    } // end for

    return array;
}

function createImageSprites(num, image) {
    // create array to hold all of our sprites
    let array = [];

    // make some sprites
    for (let i = 0; i < num; i++) {
        // determine random properties and instantiate new sprite
        let x = Math.random() * (canvasWidth - 100) + 50;
        let y = Math.random() * (canvasHeight - 100) + 50;
        let span = 15 + Math.random() * 25;
        let fwd = utils.getRandomUnitVector();
        let speed = Math.random() + 2;
        let s = new ImageSprite(x, y, span, fwd, speed, image);

        // add to end of array
        array.push(s);
    } // end for

    return array;
}

// #9 - standard "move and check world boundaries" code
function moveAndDrawSprites(ctx) {
    ctx.save();
    for (let s of sprites) {
        // move sprite
        s.move();

        // check sides and bounce
        if (s.x <= s.span / 2 || s.x >= canvasWidth - s.span / 2) {
            s.reflectX();
            s.move();
        }
        if (s.y <= s.span / 2 || s.y >= canvasHeight - s.span / 2) {
            s.reflectY();
            s.move();
        }

        // draw sprite
        s.draw(ctx);

    } // end for
    ctx.restore();
}

export {init, startLoop};


