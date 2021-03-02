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

// #3 - Inheritance example. Note that `RingSprite` is using all the methods of Sprite 
// except for `draw()`, which it is replacing (overriding) with its own implementation
class RingSprite extends Sprite {
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.span / 2, 0, Math.PI * 2, false);
        ctx.arc(0, 0, this.span / 4, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

}

class ImageSprite extends Sprite {
    constructor(x, y, span, fwd, speed, image) {
        super(x, y, span, fwd, speed);
        this.image = image;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - .5) * 5;
    }

    draw(ctx) {
        this.rotation += (Math.random() / 60) * this.rotationSpeed * this.speed;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.drawImage(this.image, -this.span / 2, -this.span / 2, this.span, this.span);
        ctx.closePath();
        ctx.restore();
    }

}

export {Sprite, RingSprite, ImageSprite};
