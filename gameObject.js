class GameObjectNew {
    constructor (context, coordinates = new Coordinates(0, 0), vx, vy, radius){
        this.context = context;

        this.vx = vx;
        this.vy = vy;
        this.coordinates = coordinates;
        this.isColliding = false;
        this.radius= radius;
    }
}