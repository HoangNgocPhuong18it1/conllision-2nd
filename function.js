let canvas ;
const canvasWidth = 500;
const canvasHeight = 500;
let context;

let polygonsObjects;

let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 50;

let squareWidth = 100;
const g = 9.81;
const restitution = 1;

let pointG;
window.onload = init;
function init() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    circle = new CircleNew(context, new Coordinates(150, 200), 100, -60 ,30);
    createPolygons();
    pointG = new Coordinates(0,0);
    window.requestAnimationFrame(gameLoop);
}
function createPolygons() {
    polygonsObjects = [
        new Polygons(context, [new Coordinates(0, 100), new Coordinates(50, 150), new Coordinates(50, 50)] ,-100, 150 ),
        new Polygons(context, [new Coordinates(350, 10), new Coordinates(450, 10), new Coordinates(450, 110), new Coordinates(350, 110),  new Coordinates(300, 55)] ,100, 150),
        new Polygons(context, [new Coordinates(150, 10), new Coordinates(250, 10),  new Coordinates(150, 110),  new Coordinates(100, 55)] ,300, -150)
    ]
}
function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    
    // Loop over all game objects
    for (let i = 0; i < polygonsObjects.length; i++) {
        pointG = findG(polygonsObjects[i].vtx);
        
        polygonsObjects[i].update(secondsPassed, pointG);
    }

    circle.update(secondsPassed);

    detectEdgeCollisions();
    detectCollisionsPolygons();
    detectCollisions();


    circle.clearCanvas();
    for (let i = 0; i < polygonsObjects.length; i++) {
        polygonsObjects[i].clearCanvas();
     }
   

    circle.draw();
    for (let i = 0; i < polygonsObjects.length; i++) {
        polygonsObjects[i].draw();
     }
   

    window.requestAnimationFrame(gameLoop);
}
function detectCollisions(){
    let objCircle;
    let objPolygons;
   
    objCircle = circle;
    
    // let radians = Math.atan2(objCircle.vy, objCircle.vx);
    // let dobjx1 = (Math.cos(radians) * objCircle.radius);
    // let dobjy1 = (Math.sin(radians) * objCircle.radius);

    let minDist = Number.MAX_VALUE;
    let closestDelta = null;
    let axis = null;
    let poidd= new Coordinates(0,0);
    for (let i = 0; i < polygonsObjects.length; i++) {
        objPolygons = polygonsObjects[i];
            poidd= findG(objPolygons.vtx);
            if (detectCollisionsCircle(objCircle, objPolygons)) {

                objCircle.vx = - objCircle.vx
                objCircle.vy = -objCircle.vy

                objPolygons.vx =  -objPolygons.vx
                objPolygons.vy = - objPolygons.vy
                
                // let vCollision = {x: poidd.x - objCircle.x, y: poidd.y - objCircle.y};
                // let distance = Math.sqrt((poidd.x-objCircle.x)*(poidd.x-objCircle.x) + (poidd.y-objCircle.y)*(poidd.y-objCircle.y));
                // let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                // let vRelativeVelocity = {x: objCircle.vx - objPolygons.vx, y: objCircle.vy - objPolygons.vy};
                // let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                // objCircle.vx -= (speed * vCollisionNorm.x);
                // objCircle.vy -= (speed * vCollisionNorm.y);
                // objPolygons.vx += (speed * vCollisionNorm.x);
                // objPolygons.vy += (speed * vCollisionNorm.y);

                objCircle.isColliding = true;
                objPolygons.isColliding = true;
                // console.log("chạm tròn")
            }
            // console.log(poidd.x , " ||||", objPolygons.G.x )
    }
    
}

function detectCollisionsCircle(objCircle , objPolygons) {

    let result = false;
    let vector = new Coordinates(0, 0);
    let vLength = 0;
    let projectVector = new Coordinates(0, 0);
    let projectPoint = new Coordinates(0, 0);
    let edgeVector;
    let dotTmp;
    let eLength = 0;
   

        objPolygons.vtx.forEach( (vertex, index) => {
        vector.x = objCircle.vtx.x - vertex.x;
        vector.y = objCircle.vtx.y - vertex.y;

        vLength = doLonVector(vector);
        eLength = doLonVector(objPolygons.edge[index]);

        if( vLength < objCircle.radius){
            result = true;
        }

        edgeVector = objPolygons.edge[index]
        dotTmp = vectorDotProduct(vector, edgeVector) / vectorDotProduct(edgeVector, edgeVector);                
        projectVector.x = edgeVector.x*dotTmp;
        projectVector.y = edgeVector.y*dotTmp;

        projectPoint.x = projectVector.x + vertex.x;
        projectPoint.y = projectVector.y + vertex.y;

        if(doLonVector(projectPoint, objCircle.vtx) < objCircle.radius){
            if(index <objPolygons.vtx.length - 1){
                if(doLonVector(projectPoint, vertex) < eLength
                    && doLonVector(projectPoint, objPolygons.vtx[index+1]) < eLength)
                    result = true;
            }
            else{
                if(doLonVector(projectPoint, vertex) < eLength
                    && doLonVector(projectPoint, objPolygons.vtx[0]) < eLength)
                    result = true;
            }
                
        }
        
    });
    return result;
}
function doLonVector(vertex1, vertex2 = null) {
    if(vertex2 === null)
        return Math.sqrt(vertex1.x**2+vertex1.y**2);
    return Math.sqrt((vertex1.x-vertex2.x)**2 + (vertex1.y-vertex2.y)**2)

}
function vectorDotProduct(vertex1, vertex2) {
    return  (vertex1.x * vertex2.x) + (vertex1.y * vertex2.y);
}

function detectCollisionsPolygons() {
    let obj1;
    let obj2;
    for (let i = 0; i < polygonsObjects.length; i++) {
        obj1 = polygonsObjects[i];
        for (let j =i+1; j < polygonsObjects.length; j++) {
            obj2 = polygonsObjects[j];
                // console.log(obj2.min);
            // console.log(obj2.max)
            // Check for left and right
            if (sat(obj1 , obj2)) {
                obj1.vx = - obj1.vx
                obj1.vy = -obj1.vy

                obj2.vx =  -obj2.vx
                obj2.vy = - obj2.vy
                obj1.isColliding = true;
                obj2.isColliding = true;
                console.log("đa giác chạm đa giác")
            }
            // if (obj1.max.x > obj2.min.x && obj1.min.x <obj2.max.x && obj1.max.y > obj2.min.y && obj1.min.y < obj2.max.y) {
            //     // if (objCircle.x < obj2.vtx.x + 100 && objCircle.x > obj2.vtx.x) {
            //     //     objCircle.isColliding = true;
            //     //     obj2.vtx.isColliding = true;
            //     //     console.log("chạm ")
            //     // }
                
            //     // let vCollision = {x: obj2.vtx.x - obj1.vtx.x, y: obj2.vtx.y - obj1.vtx.y};
            //     // let distance = Math.sqrt((obj2.vtx.x-obj1.vtx.x)*(obj2.vtx.x-obj1.vtx.x) + (obj2.vtx.y-obj1.vtx.y)*(obj2.vtx.y-obj1.vtx.y));
            //     // let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
            //     // let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
            //     // let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
            //     // obj1.vx -= (speed * vCollisionNorm.x);
            //     // obj1.vy -= (speed * vCollisionNorm.y);
            //     // obj2.vx += (speed * vCollisionNorm.x);
            //     // obj2.vy += (speed * vCollisionNorm.y);
                
            
            // }
        }
        
    }
}

function sat(polygonA , polygonB) {
    var perpendicularLine = null;
    var dot = 0;
    var perpendicularStack = [];
    var amin = null;
    var amax = null;
    var bmin = null;
    var bmax = null;
    for(var i = 0;  i < polygonA.edge.length;  i++){
        perpendicularLine = new Coordinates(-polygonA.edge[i].y,
                                    polygonA.edge[i].x);
        perpendicularStack.push(perpendicularLine);
    }
    for(var i = 0;  i < polygonB.edge.length;  i++){
        perpendicularLine = new Coordinates(-polygonB.edge[i].y,
                                    polygonB.edge[i].x);
        perpendicularStack.push(perpendicularLine);
        for(var i = 0; i < perpendicularStack.length; i++){
            amin = null;
            amax = null;
            bmin = null;
            bmax = null;
            for(var j = 0; j < polygonA.vtx.length; j++){
                dot = polygonA.vtx[j].x *
                    perpendicularStack[i].x +
                    polygonA.vtx[j].y *
                    perpendicularStack[i].y;
                if(amax === null || dot > amax){
                    amax = dot;
                }
                if(amin === null || dot < amin){
                    amin = dot;
                }
            }
            for(var j = 0; j < polygonB.vtx.length; j++){
                dot = polygonB.vtx[j].x *
                        perpendicularStack[i].x +
                        polygonB.vtx[j].y *
                        perpendicularStack[i].y;
                if(bmax === null || dot > bmax){
                    bmax = dot;
                }
                if(bmin === null || dot < bmin){
                    bmin = dot;
                }
            }
            if((amin < bmax && amin > bmin) ||
                (bmin < amax && bmin > amin)){
                continue;
            }
            else {
                return false;
            }
        }
        return true;
        
        
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
        
         // Check for left and right
         if (obj.vtx.x < obj.radius){
            obj.vx = Math.abs(obj.vx) * restitution;
            obj.vtx.x = obj.radius;
        }else if (obj.vtx.x > canvasWidth - obj.radius){
            obj.vx = -Math.abs(obj.vx) * restitution;
            obj.vtx.x = canvasWidth - obj.radius;
        }

        // Check for bottom and top
        if (obj.vtx.y < obj.radius){
            obj.vy = Math.abs(obj.vy) * restitution;
            obj.vtx.y = obj.radius;
        } else if (obj.vtx.y > canvasHeight - obj.radius){
            obj.vy = -Math.abs(obj.vy) * restitution;
            obj.vtx.y = canvasHeight - obj.radius;
        }
        for (let i = 0; i < polygonsObjects.length; i++) {
            obj2 = polygonsObjects[i];
            // console.log(obj2.min);
            // console.log(obj2.max)
            // Check for left and right
            if (obj2.min.x <0) {
                obj2.vx = Math.abs(obj2.vx) * restitution;
                // obj.x = obj.radius;
            }else if (obj2.max.x > canvasWidth ){
                obj2.vx = -Math.abs(obj2.vx) * restitution;
            
            }

            // Check for bottom and top
            if (obj2.min.y < 0) {
                obj2.vy = Math.abs(obj2.vy) * restitution;
                
            }else if (obj2.max.y > canvasHeight ){
                obj2.vy = -Math.abs(obj2.vy) * restitution;
                
            }
        }
        

    
}

function polyPoly(p1 = [], p2 = []) {
    // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0;
  for (let current=0; current<p1.length; current++) {

    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current+1;
    if (next == p1.length) next = 0;

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    let vc = p1[current];    // c for "current"
    let vn = p1[next];       // n for "next"

    // now we can use these two points (a line) to compare
    // to the other polygon's vertices using polyLine()
   
    if (polyLine(p2, vc.x,vc.y,vn.x,vn.y)) {
        return true;
    }
    // // optional: check if the 2nd polygon is INSIDE the first
    // collision = polyPoint(p1, p2[0].x, p2[0].y);
    // if (collision) return true;
  }

  return false;
}
function polyLine(vertices = [], x1,  y1, x2, y2) {
   next = 0;
  for (let current=0; current<vertices.length; current++) {

    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // get the PVectors at our current position
    // extract X/Y coordinates from each
    let x3 = vertices[current].x;
     let y3 = vertices[current].y;
    let x4 = vertices[next].x;
    let y4 = vertices[next].y;

    // do a Line/Line comparison
    // if true, return 'true' immediately and
    // stop testing (faster)
    if (lineLine(x1, y1, x2, y2, x3, y3, x4, y4)) {
      return true;
    }
  }

  // never got a hit
  return false;
}
function lineLine( x1, y1, x2, y2, x3, y3, x4, y4) {
    let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;
}

function findG(vertex){
    let tongX =0 ;
    let tongY =0;
    let tong=0 ;
    let tamX;
    let tamY;
    let tamS;
    for (let i = 1; i < vertex.length-1; i++) {
        tamX = xAG(vertex[0], vertex[i], vertex[i+1]);
        tamY = yAG(vertex[0], vertex[i], vertex[i+1]);
        tamS = sA(vertex[0], vertex[i], vertex[i+1]);
        tongX += (tamX * tamS);
        tongY += (tamY * tamS);
        tong += tamS;
      
    }
    let xG = tongX/tong;
    let yG = tongY/tong;
    pointG.x = xG;
    pointG.y = yG;
    
    return pointG;
}
function xAG(vertexA, vertexB, vertexC) {
    return (vertexA.x + vertexB.x +vertexC.x)/3;
}
function yAG(vertexA, vertexB, vertexC) {
    return (vertexA.y + vertexB.y +vertexC.y)/3;
}
function sA(vertexA, vertexB, vertexC) {
    let tam;
    tam = (vertexA.x - vertexB.x) *(vertexA.y + vertexB.y) 
    + (vertexB.x - vertexC.x) * (vertexB.y + vertexC.y) +
    (vertexC.x - vertexA.x) * (vertexC.y + vertexA.y);

    return Math.abs(tam)/2;
}