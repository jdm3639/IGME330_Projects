// #4 - UTILITY CODE
// Here's more code that should probably be in a separate file
// Maybe in abcLIB.js (if you are working on Project 1) or utils.js (if you are working on Project 2)
// Also check out `createLinearGradient()`, it's new and handy

export function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

export function createLinearGradient(ctx, startX, startY, endX, endY, colorStops) {
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

export function drawCircleWithShadowFromPoint(ctx, x, y, radius, color, fromX = 0, fromY = 0, realX = 0, realY = 0) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    let angle = Math.atan2(realY - fromY,realX - fromX);
    //console.log(`y = ${y} x = ${x} fromX = ${fromX} fromY = ${fromY}`);
    //console.log(`angle = ${angle}`);
    ctx.shadowOffsetX = Math.cos(angle) * 7;
    ctx.shadowOffsetY = Math.sin(angle) * 7;
    ctx.shadowColor = "#444444";
    ctx.shadowBlur = 1;
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

export function toDegrees(degrees) {
    return degrees * (Math.PI / 180);
}

export function rotateAroundPoint(cx, cy, angle, p, debug)
{
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    p.x -= cx;
    p.y -= cy;

    let xnew = p.x * c - p.y * s;
    let ynew = p.x * s + p.y * c;

    p.x = xnew + cx;
    p.y = ynew + cy;
    return p;
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