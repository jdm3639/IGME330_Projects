import * as utils from "./utils.js";
import * as main from "./main.js";

// #1 CLASS CODE
// we've put these Sprite classes in a separate <script> tag from the rest of the code, but this code should really be in another file
class Sprite {
    constructor(x = 0, y = 0, span = 10, fwd = { x: 1, y: 0 }, speed = 0, color = "black") {
        this.x = x;
        this.y = y;
        this.span = span;
        this.fwd = fwd;
        this.speed = speed;
        this.color = color;

        // #2 - Here's a cooler idiom to accomplish the same property assignment as above, 
        // with one line of code!
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
        //Object.assign(this,{x,y,span,fwd,speed,color});
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.rect(-this.span / 2, -this.span / 2, this.span, this.span);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    move() {
        this.x += this.fwd.x;
        this.y += this.fwd.y;
    }

    reflectX() {
        this.fwd.x *= -1;
    }

    reflectY() {
        this.fwd.y *= -1;
    }
}

class Bomb extends Sprite {
    constructor(x = 0, y = 0, radius = 10, fwd = { x: 1, y: 0 }, speed = 0, color = "black") {
        super(x,y,radius,fwd,speed,color)
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.span, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

class Phyllo {
    constructor(x = 0, y = 0, divergence = 137.5, spacing = 4, defaultRadius = 3, maxCircles = 100) {
        this.centerX = x;
        this.centerY = y;
        this.circles = [];
        this.divergence = divergence;
        this.spacing = spacing;
        this.rotation = 0;
        this.defaultRadius = defaultRadius;
        this.maxCircles = maxCircles;
    }

    move(moveX = 0, moveY = 0) {
        this.centerX += moveX;
        this.centerY += moveY;
    }

    rotate(rads = 0) {
        this.rotation += rads;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        for (let i = 0; i < this.circles.length; i++) {
            let localX = this.circles[i].x;
            let localY = this.circles[i].y;

            let realX = this.centerX + localX;
            let realY = this.centerY + localY;
            utils.drawCircleWithShadowFromPoint(ctx, this.circles[i].x, this.circles[i].y,this.circles[i].radius,this.circles[i].color, main.getPlayer().x, main.getPlayer().y, realX, realY);
        }
        ctx.restore();
    }

    addCircle(radius = this.defaultRadius, color = "black") {
        if (this.circles.length < this.maxCircles) {
            let a = this.circles.length * utils.dtr(this.divergence);
            let r = this.spacing * Math.sqrt(this.circles.length);

            let circleX = r * Math.cos(a);
            let circleY = r * Math.sin(a);

            //let aDegrees = (this.circles.length * this.divergence) % 361;
            //let color = `hsl(${this.circles.length/5 % 361},100%,50%)`;
            this.circles.push({ x: circleX, y: circleY, radius: radius, color: color });
        }
    }
}

export {Sprite, Bomb, Phyllo};
