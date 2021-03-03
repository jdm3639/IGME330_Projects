// #4 - UTILITY CODE
// Here's more code that should probably be in a separate file
// Maybe in abcLIB.js (if you are working on Project 1) or utils.js (if you are working on Project 2)
// Also check out `createLinearGradient()`, it's new and handy

function getRandomUnitVector() {
    let x = getRandom(-1, 1);
    let y = getRandom(-1, 1);
    let length = Math.sqrt(x * x + y * y);
    if (length == 0) { // very unlikely
        x = 1; // point right
        y = 0;
        length = 1;
    } else {
        x /= length;
        y /= length;
    }
    return { x: x, y: y };
}

export function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColor() {
    const getByte = _ => 35 + Math.round(Math.random() * 220);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
}

function createLinearGradient(ctx, startX, startY, endX, endY, colorStops) {
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
}

export function drawCircle(ctx, x, y, radius, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

export function drawCircleWithShadowFromPoint(ctx, x, y, radius, color, fromX = 0, fromY = 0) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    let angle = Math.atan2(y - fromY,x - fromX);
    //console.log(`y = ${y} x = ${x} fromX = ${fromX} fromY = ${fromY}`);
    console.log(`angle = ${angle}`);
    ctx.shadowOffsetX = Math.cos(dtr(angle)) * 5;
    ctx.shadowOffsetY = Math.sin(dtr(angle)) * 5;
    ctx.shadowColor = "#444444";
    ctx.shadowBlur = 1;
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

export function dtr(degrees) {
    return degrees * (Math.PI / 180);
}

function preloadImage(url, callback) {
    // 1 - create a new Image object
    let img = new Image();

    // 2 - set up event handlers for the Image object
    img.onload = _ => {
        // 4 - when the image shows up, call `init(img)`
        callback(img)
    };

    img.onerror = _ => {
        // 4B - called if there is an error
        console.log(`Image at url "${url}" wouldn't load! Check your URL!`);
    };

    // 3 - start downloading the image (it is located on an RIT server)
    img.src = url;
}


export {createLinearGradient, preloadImage, getRandomColor, getRandomUnitVector};