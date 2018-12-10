import {game, Sprite} from "./sgc/sgc.js";
game.setBackground("water.png");

let wall = new Sprite(); 
wall.name = "LWall"; 
wall.setImage("wall.png"); 
wall.x = 0;
wall.y = 175;
wall.accelerateOnBounce = false;

class Support extends Sprite(){
    constructor (x,y,image){
        this.x =this.x;
        this.y =this.y;
        this.setImage(image);
    }
}

class Platform extends Support(){
    constructor(x,y,image){
        this.x =this.x;
        this.y=this.y;
        this.setImage(image);
        this.name = "A platform";
        this.accelerateOnBounce = false;
    }

}
