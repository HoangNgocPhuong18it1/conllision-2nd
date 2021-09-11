class CircleNew extends GameObjectNew
{   
    constructor (context, x, y, vx, vy,radius){
        super(context, x, y, vx, vy,radius);
        // Set default width and height
        this.mass = this.radius/2;
        this.degreesold = 180 *(Math.atan2(this.vy, this.vx))/ Math.PI
        this.restitution2 = 1.1; 
        this.lineX = 0;
        this.lineY = 0;
    }
    draw(){
        // // Draw a simple Circle
        this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
        this.context.beginPath();
        // this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fill();
        // this.context.drawImage(img, this.x - this.radius*1.2, this.y - this.radius * 1.1, this.radius * 2.5, this.radius * 2.62);
        context.beginPath();
        context.moveTo(this.x,this.y);
        context.lineTo(this.lineX,this.lineY);
        context.stroke();
    }
   

    update(secondsPassed){
        // Move with set velocity
        // this.vy += g * secondsPassed;
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
        // Calculate the angle (vy before vx)
        let radians = Math.atan2(this.vy, this.vx);
        // Convert to degrees
        let degrees = 180 * radians / Math.PI;
        // console.log("số:",degrees)
        this.lineY = this.y + (Math.sin(radians) * this.radius);
        this.lineX = this.x + (Math.cos(radians) * this.radius);
        this.isColliding = false;
    }
    clearCanvas(){
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
}