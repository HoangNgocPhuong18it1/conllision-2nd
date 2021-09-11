class GameObjectNew {
    constructor (context, x, y, vx, vy, radius){
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.isColliding = false;
    }
}