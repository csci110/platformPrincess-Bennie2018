this.backgroundImageFile = 'water.png';
this.preloadImageSheets('princessSheet.png', 'batSheet.png', 'spiderSheet.png');
this.preloadImages('slider.png', 'door.png', 'finish.png',
    'start.png', 'wall.png', 'water.png');
/*****************************************************************************************/
let wall = {
    name: 'A Wall',
    imageFile: 'wall.png',
    x: 0,
    y: 175,
    immovable: true,
    collisionArea: { wdith: 1, height: 300 },
    handleGameLoop: function() {
        this.scrollBackground(50, 0);
        delete this.handleGameLoop;
    }
};

/*****************************************************************************************/
class Platform {
    constructor(x, y, imageFile) {
        this.name = 'platform';
        this.imageFile = imageFile;
        this.x = x;
        this.y = y;
        this.immovable = true;
        this.addSprite(this);
    }
}
let startPlatform = new Platform(0, 400, 'start.png');
let finishPlatform = new Platform(this.displayWidth - 2 * this.gridSize, 400, 'finish.png');
/*****************************************************************************************/
class SlidingPlatform extends Platform {
    constructor(x, y, angle) {
        super(x, y, 'slider.png');
        this.name = 'A sliding platform';
        this.immovable = false;
        this.speed = this.gridSize;
        this.angle = angle;
    }
}
new SlidingPlatform(startPlatform.x + this.gridSize * 3,
    startPlatform.y + this.gridSize, 0);
new SlidingPlatform(finishPlatform.x - this.gridSize * 5,
    finishPlatform.y + this.gridSize, 180);
/*****************************************************************************************/
let princess = {
    name: 'The Princess',
    imageSheetFile: 'princessSheet.png',
    x: this.gridSize,
    y: 300,
    speed: 0,
    movingSpeed: 100,
    isfalling: false,
    handleLeftArrowKey: function() {
        this.speed = this.movingSpeed;
        this.angle = 180;
    },
    handleRightArrowKey: function() {
        this.speed = this.movingSpeed;
        this.angle = 0;
    },
    handleGameLoop: function() {
        // Check directly below princess for platforms.
        let supportingPlatforms = this.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1, Platform);
        // Is there one, and is its *top* at or below the bottom of the princess?
        if (supportingPlatforms.length > 0 && supportingPlatforms[0].y >= this.y + this.height) {
            this.isFalling = false;
        }
        else {
            this.y = this.y + 4; // simulate gravity
            this.isFalling = true;
        }
        if (this.angle === 0 && this.speed > 0) {
            this.playAnimation('right');
        }
        else if (this.angle === 180 && this.speed > 0) {
            this.playAnimation('left');
        }
    },
    handleSpacebar: function() {
        if (!this.isFalling) {
            this.y = this.y - 1.25 * this.height; //jump
        }
    },
    handleBoundaryContact: function() {
        this.endGame('Princess Ann has drowned.\n\nBetter luck next time.');
    }
};

/*****************************************************************************************/
let door = {
    name: 'A door',
    imageFile: 'door.png',
    x: this.displayWidth - this.gridSize,
    y: finishPlatform.y - 2 * this.gridSize,
    immovable: true,
};

/*****************************************************************************************/
class Spider {
    constructor(x, y) {
        this.name = 'A spider';
        this.imageSheetFile = 'spiderSheet.png';
        this.x = x;
        this.y = y;
        this.immovable = true;
        this.addSprite(this);
        this.defineAnimation('creep', 0, 2);
        this.collisionArea = {
            xOffset: this.gridSize / 2,
            width: 1, // minimize colliding with princess from above
            yOffset: this.gridSize / 3,
            height: this.gridSize / 3
        };
    }
    handleGameLoop() {
        this.playAnimation('creep', true);
        delete this.handleGameLoop;
        this.handleGameLoop = function() {
            if (this.y < princess.y - this.gridSize) {
                this.angle = 270;
                this.speed = 50;
            }
            else if (this.y > princess.y + this.gridSize) {
                this.y = princess.y - Math.random() * 3 * this.gridSize;
            }
        };
        
    }
}
let leftSpider = new Spider(200, 225);
let rightSpider = new Spider(550, 200);
/******************************************************************************************/
class Bat {
    constructor(x, y) {
        this.name = 'A Bat';
        this.imageSheetFile = 'batSheet.png';
        this.x = this.startX = x;
        this.y = this.startY = y;
        this.immovable = true;
        this.speed = this.normalSpeed = 20;
        this.attackSpeed = 300;
        this.angleTimer = 0;
        this.addSprite(this);
        this.defineAnimation('flap', 0, 1);
        this.angle = 45 + (Math.round(Math.random() * 3) * 90);
        this.collisionArea = {
            xOffset: this.gridSize / 2,
            width: 1, // minimize colliding with princess from above
            yOffset: this.gridSize / 3,
            height: this.gridSize / 3
        };
        
    }
    attack() {
        this.speed = this.attackSpeed;
        this.aimFor(princess.x, princess.y);
    }
    handleGameLoop() {
        this.playAnimation('flap', true);
        delete this.handleGameLoop;
        this.handleGameLoop = function() {// if bat is not attacking: hover
            let now = this.getTime();        
            if (Math.random() < 0.001) {
                this.attack();
                let now = 0;
            };
            if (this.attack && now - this.angleTimer >= 5) {
                this.angle = this.angle + 90 + Math.round(Math.random()) * 90;
                this.angleTimer = now;
                this.speed = this.normalSpeed;
            }
        };
    }
    handleBoundaryContact() {
        if (this.y < 0) {
            this.y = 0;
        }
        else {
            this.x = this.startX;
            this.y = this.startY;
            this.speed = this.normalSpeed;
            this.angle = 225;
        }
    }
        
}
let leftBat = new Bat(200, 100);
let rightBat = new Bat(500, 75);
/******************************************************************************************/
princess.defineAnimation('left', 9, 11);
princess.defineAnimation('right', 3, 5);
/*****************************************************************************************/

