let canvas ;
const canvasWidth = 500;
const canvasHeight = 500;
let context;

let circleObjects;

let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 50;

let squareWidth = 100;
const g = 9.81;
const restitution = 1;
window.onload = init;
function init() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    circle = new CircleNew(context, 150, 300, 150, -150 ,30)
    square = new Square(context, 150, 200, -150, 150 )
    window.requestAnimationFrame(gameLoop);
}
function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // // Loop over all game objects
    // for (let i = 0; i < circleObjects.length; i++) {
    //     circleObjects[i].update(secondsPassed);
    // }
    circle.update(secondsPassed);
    square.update(secondsPassed)
    detectEdgeCollisions();
    detectCollisions();


    circle.clearCanvas();
    square.clearCanvas();
   

    circle.draw();
    square.draw();

    window.requestAnimationFrame(gameLoop);
}
function detectCollisions(){
    let obj1;
    let obj2;
   
    obj1 = circle;
    obj2 = square;

    let radians = Math.atan2(obj1.vy, obj1.vx);
    let dobjx1 = obj1.x + (Math.cos(radians) * obj1.radius);
    let dobjy1 = obj1.y + (Math.sin(radians) * obj1.radius);

    if ( obj1.y + obj1.radius > obj2.y  && obj1.y - obj1.radius < obj2.y +100 && obj1.x +obj1.radius > obj2.x && obj1.x- obj1.radius <obj2.x +100) {
        // if (obj1.x < obj2.x + 100 && obj1.x > obj2.x) {
        //     obj1.isColliding = true;
        //     obj2.isColliding = true;
        //     console.log("chạm ")
        // }
        
        let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
        let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
        let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
        let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
        obj1.vx -= (speed * vCollisionNorm.x);
        obj1.vy -= (speed * vCollisionNorm.y);
        obj2.vx += (speed * vCollisionNorm.x);
        obj2.vy += (speed * vCollisionNorm.y);
        obj1.isColliding = true;
        obj2.isColliding = true;
        console.log("chạm ")
    
    }
    
    else if (dobjx1 > obj2.x && dobjy1 < obj2.y + squareWidth && dobjx1 < obj2.x +squareWidth && dobjy1 > obj2.y && dobjx1 <obj2.x +squareWidth && dobjy1 < obj2.y && dobjx1 >obj2.x && dobjy1 > obj2.y) {
        let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
        let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
        let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
        let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
        
        obj1.vx -= (speed * vCollisionNorm.x);
        obj1.vy -= (speed * vCollisionNorm.y);
        obj2.vx += (speed * vCollisionNorm.x);
        obj2.vy += (speed * vCollisionNorm.y);
        obj1.isColliding = true;
        obj2.isColliding = true;
        console.log("chạm góc")
    }
}
function circleIntersect(x1, y1, r1, x2, y2, r2) {

    // Calculate the distance between the two circles
    let CircleDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return CircleDistance <= ((r1 + r2) * (r1 + r2))
}
function detectEdgeCollisions() {
    let obj;
    let obj2;
   
        obj = circle;
        obj2 = square;
         // Check for left and right
         if (obj.x < obj.radius){
            obj.vx = Math.abs(obj.vx) * restitution;
            obj.x = obj.radius;
        }else if (obj.x > canvasWidth - obj.radius){
            obj.vx = -Math.abs(obj.vx) * restitution;
            obj.x = canvasWidth - obj.radius;
        }

        // Check for bottom and top
        if (obj.y < obj.radius){
            obj.vy = Math.abs(obj.vy) * restitution;
            obj.y = obj.radius;
        } else if (obj.y > canvasHeight - obj.radius){
            obj.vy = -Math.abs(obj.vy) * restitution;
            obj.y = canvasHeight - obj.radius;
        }

        // Check for left and right
        if (obj2.x <0) {
            obj2.vx = Math.abs(obj2.vx) * restitution;
            // obj.x = obj.radius;
        }else if (obj2.x > canvasWidth - 100){
            obj2.vx = -Math.abs(obj2.vx) * restitution;
           
        }

        // Check for bottom and top
        if (obj2.y <0) {
            obj2.vy = Math.abs(obj2.vy) * restitution;
            
        }else if (obj2.y > canvasHeight - 100){
            obj2.vy = -Math.abs(obj2.vy) * restitution;
            
        }

    
}