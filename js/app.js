// Enemies our player must avoid
/*
var Enemy = function(position,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = position[0];
    this.y = position[1];
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + (dt * this.speed);
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
*/
//--------------Original Code Above this line -----------------------

// Code for any entity in the game that might interact.
// Input is a two item array
var Entity = function(position,spriteLoc) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = position[0];
    this.y = position[1];
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = spriteLoc;
    this.speed = [0,0];
};
// Draw the entity on the screen, required method for game
Entity.prototype.render = function() {
      ctx.drawImage(Resources.get(this.sprite), (this.x), (this.y));
};

//  Check if entity is off the board
Entity.prototype.checkEdge = function(wide,high) {
    var edgeCode = [0,0]; // 0 = Not on Edge, 1 = right edge, 2 = left edge
                          // 0 = Not on Edge, 1 = top edge, 2 = bottom edge

    //Checking horizontally
    if ((this.x + 101) <= 0) {
      edgeCode[0] = 1;
    } else if ((this.x+5) >= wide) {
      edgeCode[0] = 2;
    } else {
      edgeCode[0] = 0;
    }

    //And vertically...
    if ((this.y+20) < 0) {
      edgeCode[1] = 1;
    } else if ((this.y+171) > high) {
      edgeCode[1] = 2;
    } else {
      edgeCode[1] = 0;
    }
    return edgeCode;
};



var Enemy = function (difficulty,tier) {
    Entity.call(this, [-150,200], 'images/enemy-bug.png');
    this.difficulty = difficulty;
    this.tier = tier;
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.collisionCheck = function() {
    var width = 100,
        height = 71,
        pWidth = 70;
    var playerXOff = player.x + 15;
    // first check for collision with Player
    if (this.x < (playerXOff + pWidth) && (this.x+ width) > playerXOff) {
      if (this.y < (player.y + height) &&
      (this.y + height) > player.y) {
        console.log('you lost',this.y);
      }
    }
    // Then check for running off screen
    var enemyEdgeCode = this.checkEdge(ctx.canvas.width,ctx.canvas.height);
    if ((this.speed[0] > 0 && enemyEdgeCode[0] == 2)||
        (this.speed[0] < 0 && enemyEdgeCode[0] == 1)) {
      this.generateRandom();
    }
};
Enemy.prototype.update = function(dt) {
    this.x += (dt * this.speed[0]);
    this.y += (dt * this.speed[1]);
    this.collisionCheck();
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers

};

//  Generates random speed and position settings for enemies depending on the
//  difficulty setting
Enemy.prototype.generateRandom = function() {
    var difficulty = this.difficulty,
        tier = this.tier,
        speedRange = 30*difficulty,
        tileHeight = 83,
        roadTiers = 3 + Math.floor(difficulty/2),
        finalY = 230,
        finalX = 200,
        offsetX = 300,
        direction = 'right',
        speed;

    if (difficulty > 1) {
      var randomDirection = Math.round(Math.random());
      if (randomDirection == 1) {
        direction = 'left';
      }
    }

    if (tier == 0) {
      tier = Math.floor((Math.random()*roadTiers)+1);
    }

    speed = Math.floor(Math.random()*speedRange) + 60;
    offsetX += Math.floor(Math.random()*20) * 10;

    if (direction == 'left') {
      offsetX *= -1;
      speed *= -1;
    }

    finalX -= offsetX;
    finalY -= (tier - 1) * tileHeight;
    this.x = finalX;
    this.y = finalY;
    this.speed[0] = speed;
    console.log(this.x,this.y,this.speed);
};

Enemy.prototype.constructor = Enemy;



var Player = function (loc,img) {
    Entity.call(this, loc, img);
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {
    this.x += this.speed[0];
    this.y += this.speed[1];
    //Checking if the keymove will take it offscreen...
    var edgeCode = this.checkEdge(ctx.canvas.width,ctx.canvas.height);

    if (edgeCode[0] > 0){
      this.x -= this.speed[0];
    }
    if (edgeCode[1] > 0) {
      this.y -= this.speed[1];
    }
    this.speed = [0,0];

};

Player.prototype.handleInput = function (direction) {
//  var edgeCode = this.checkEdge(ctx.canvas.width,ctx.canvas.height);
  switch (direction) {
    case 'left':
      this.speed[0] = -101;
      break;
    case 'right':
      this.speed[0] = 101;
      break;
    case 'up':
      this.speed[1] = -83;
      break;
    case 'down':
      this.speed[1] = 83;
      break;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemyOne = new Enemy([-100,-20],[100,0]);
//var enemyTwo = new Enemy([500,1],[-10,0]);
var enemyThree = new Enemy([500,220],[-150,0]);

var generateEnemies = function(difficulty){
    var roadTiers = 3 + Math.floor(difficulty/2),
        enemyArray = [],
        extraEnemies = (difficulty * 2) - 1;
    do {
      enemyArray.push(new Enemy(difficulty,roadTiers));
      enemyArray[enemyArray.length - 1].generateRandom();
      roadTiers--;
    } while (roadTiers > 0);

    do {
      enemyArray.push(new Enemy(difficulty,0));
      enemyArray[enemyArray.length - 1].generateRandom();
      extraEnemies--;
    } while (extraEnemies > 0);
    return enemyArray;
};
var allEnemies = generateEnemies(3,allEnemies);
var player = new Player([200,400],'images/char-boy.png');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
