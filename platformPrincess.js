import {game, Sprite} from "./sgc/sgc.js";
game.setBackground("water.png");

let wall = new Sprite(); 
wall.name = "LWall"; 
wall.setImage("wall.png"); 
wall.x = 0;
wall.y = 175;
wall.accelerateOnBounce = false;

/*let Rwall = new Sprite();
Rwall.name = "rightwall";
Rwall.setImage("wall.png");
*/