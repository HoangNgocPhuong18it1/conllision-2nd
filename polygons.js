import { GameObjectNew } from "./gameObject";
import { Coordinates } from "./coordinates";
class Polygons extends GameObjectNew {
    constructor(context, vtx= [] , vx, vy) {
        super();
       this.context = context;
       this.vx = vx;
       this.vy=vy;
        this.vtx= vtx;
        this.edge = [];
        this.setEdge();
        this.min = new Coordinates(0,0);
        this.max = new Coordinates(0,0);
        this.findMaxMin();
        this.G = new Coordinates(0,0);
        this.lineX = 0;
        this.lineY = 0;
    }
    findMaxMin(){
        let minX = this.vtx[0].x;
        let minY = this.vtx[0].y;
        let maxX = this.vtx[0].x;
        let maxY = this.vtx[0].y;
        for (let i = 1; i < this.vtx.length; i++) {
            if (minX > this.vtx[i].x)
            {
                minX = this.vtx[i].x;
            }
            if (minY> this.vtx[i].y)
            {
                minY = this.vtx[i].y;
            }
            if (maxX < this.vtx[i].x)
            {
                maxX = this.vtx[i].x;
            }
            if (maxY < this.vtx[i].y)
            {
                maxY = this.vtx[i].y;
            } 
            
        }
        this.min.x = minX;
        this.min.y = minY;
        this.max.x = maxX;
        this.max.y = maxY;
    }
    

    setEdge(){
        for (let i = 1; i < this.vtx.length; i++) {
            this.edge.push( new Coordinates(this.vtx[i].x -this.vtx[i-1].x, this.vtx[i].y -this.vtx[i-1].y ))
        }
        var lastVtx = this.vtx.length-1;
        this.edge.push( new Coordinates(this.vtx[lastVtx].x -this.vtx[0].x, this.vtx[lastVtx].y -this.vtx[0].y ))
    }
    draw(){
        this.context.beginPath();
        this.context.moveTo(this.vtx[0].x, this.vtx[0].y)
        for (let i = 1; i < this.vtx.length; i++) {
            this.context.lineTo(this.vtx[i].x,  this.vtx[i].y)
        }
        this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
        this.context.fill();
        this.context.beginPath();
        this.context.moveTo(this.G.x, this.G.y);
        this.context.lineTo(this.lineX, this.lineY );
        this.context.stroke();
    }
    update(secondsPassed, pointG){
        for (let key in this.vtx) {
            this.vtx[key].x += this.vx * secondsPassed;
            this.vtx[key].y += this.vy * secondsPassed;
        }

        let radians = Math.atan2(this.vy, this.vx);
        
        

        this.G.x = pointG.x;
        this.G.y = pointG.y;
        this.lineY = this.G.y + (Math.sin(radians) * 30);
        this.lineX = this.G.x + (Math.cos(radians) * 30);
        this.findMaxMin();
        this.isColliding = false;
    }
    clearCanvas(){
        this.context.clearRect(0, 0, 500, 500);
    }
}
export {Polygons}