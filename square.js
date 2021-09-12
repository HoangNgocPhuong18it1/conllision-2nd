class Square extends GameObjectNew {
    constructor(context, x, y , vx, vy) {
        super(context, x, y , vx, vy)
    }
    draw(){
        this.context.beginPath();
        // this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
        this.context.fillRect(this.x, this.y, 100, 100);
    }
    update(secondsPassed){
        // Move with set velocity
        // this.vy += g * secondsPassed;
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
        this.isColliding = false;
    }
    clearCanvas(){
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
}