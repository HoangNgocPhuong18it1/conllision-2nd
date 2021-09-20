import { GameObjectNew } from "./gameObject";
class CircleNew extends GameObjectNew
{   
    constructor (context, vtx, vx, vy,radius){
        super(context, vtx, vx, vy,radius);
        // Set default width and height
        this.vtx= vtx;
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
        this.context.arc(this.vtx.x, this.vtx.y, this.radius, 0, 2 * Math.PI);
        this.context.fill();
        // this.context.drawImage(img, this.x - this.radius*1.2, this.y - this.radius * 1.1, this.radius * 2.5, this.radius * 2.62);
        this.context.beginPath();
        this.context.moveTo(this.vtx.x, this.vtx.y);
        this.context.lineTo(this.lineX,this.lineY);
        this.context.stroke();
    }
   

    update(secondsPassed){
        // Move with set velocity
        // this.vy += g * secondsPassed;
        this.vtx.x += this.vx * secondsPassed;
        this.vtx.y += this.vy * secondsPassed;
        // Calculate the angle (vy before vx)
        let radians = Math.atan2(this.vy, this.vx);
        // Convert to degrees
        let degrees = 180 * radians / Math.PI;
        // console.log("số:",degrees)
        this.lineY = this.vtx.y + (Math.sin(radians) * this.radius);
        this.lineX = this.vtx.x + (Math.cos(radians) * this.radius);
        this.isColliding = false;
       
    }
    clearCanvas(){
        this.context.clearRect(0, 0, 500,  500);
    }
}
export {CircleNew};