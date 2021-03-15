import * as utils from "./utils.js";
import * as main from "./main.js";

class Sprite {
    constructor(x = 0, y = 0, span = 10, fwd = { x: 1, y: 0 }, speed = 0, color = "black") {
        this.x = x;
        this.y = y;
        this.span = span;
        this.fwd = fwd;
        this.speed = speed;
        this.color = color;
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

class Orb extends Sprite {
    constructor(x = 0, y = 0, radius = 10, fwd = { x: 1, y: 0 }, speed = 0, color = "black") {
        super(x, y, radius, fwd, speed, color);
        this.radius = radius;
        this.hasBeenCollected = false;
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

    isCollidingCheck(point = { x: 0, y: 0 }, radius = 1, id = 0) {
        let distanceBetween = Math.hypot(this.x - point.x, this.y - point.y);
        let totalRaduis = this.radius + radius;

        if (distanceBetween < totalRaduis && !this.hasBeenCollected) {
            this.hasBeenCollected = true;
            return true;
        }

        return false;
    }
}

class Phyllo {
    constructor(x = 0, y = 0, fwd = { x: 1, y: 0 }, divergence = 137.5, spacing = 4, defaultRadius = 3, maxCircles = 100) {
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

        let centerPoint = { x: this.circles[0].x, y: this.circles[0].x };

        //ctx.rotate(this.rotation);
        for (let i = 0; i < this.circles.length; i++) {
            let point = utils.rotateAroundPoint(centerPoint.x, centerPoint.y, this.rotation, { x: this.circles[i].x, y: this.circles[i].y }, false);

            if (i == 0) {
                //point = utils.rotateAroundPoint(centerPoint.x, centerPoint.y, this.rotation, { x: this.circles[i].x, y: this.circles[i].y }, true);
                this.circles[i].color = "#FF555C";
            }
            let localX = point.x;
            let localY = point.y;

            let realX = this.centerX + localX;
            let realY = this.centerY + localY;
            utils.drawCircleWithShadowFromPoint(ctx, localX, localY, this.circles[i].radius, this.circles[i].color, main.getPlayer().x, main.getPlayer().y, realX, realY);

            this.circles[i].realX = realX;
            this.circles[i].realY = realY;
        }
        ctx.restore();
    }

    reflectX() {
        this.fwd.x *= -1;
    }

    reflectY() {
        this.fwd.y *= -1;
    }

    addCircle(radius = this.defaultRadius, color = "black") {
        if (this.circles.length < this.maxCircles) {
            let a = this.circles.length * utils.dtr(this.divergence);
            let r = this.spacing * Math.sqrt(this.circles.length);

            let circleX = r * Math.cos(a);
            let circleY = r * Math.sin(a);

            //let aDegrees = (this.circles.length * this.divergence) % 361;
            //let color = `hsl(${this.circles.length/5 % 361},100%,50%)`;
            this.circles.push({ x: circleX, y: circleY, radius: radius, color: color, realX: 0, realY: 0 });
        }
    }

    isCollidingCheck(point = { x: 0, y: 0 }, radius = 1) {
        for (let i = 0; i < this.circles.length; i++) {
            let circle = this.circles[i];

            let distanceBetween = Math.hypot(circle.realX - point.x, circle.realY - point.y);
            let totalRaduis = circle.radius + radius;

            // if (i == 0) {
            //     console.log("distance " + distanceBetween);
            //     utils.drawCircle(ctx, circle.realX, circle.realY, 4, "green");
            //     utils.drawCircle(ctx, point.x, point.y, 4, "green");
            // }

            if (distanceBetween < totalRaduis) {
                // console.log("Hit " + i);
                circle.color = "blue";
                return { id: i };
            }
        }
        // console.log("no Hit");
        return null;
    }
}

export { Sprite, Orb, Phyllo };
