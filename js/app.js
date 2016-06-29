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
    //console.log(this.x,this.y,this.sprite,this.speed,this.constructor);
    if (this.speed[0] < 0) {
      ctx.scale(-1,1);
      ctx.drawImage(Resources.get(this.sprite), -(this.x), -(this.y));
    } else {
      ctx.drawImage(Resources.get(this.sprite), (this.x), (this.y));
    }
};
Entity.prototype.checkEdge = function(wide,high) {
    var edgeCode = [0,0]; // 0 = Not on Edge, 1 = left edge, 2 = right edge
                          // 0 = Not on Edge, 1 = top edge, 2 = bottom edge

    //checking horizontally
    if ((this.x-50) < 0) {
      edgeCode[0] = 1;
    } else if ((this.x+150) > wide) {
      edgeCode[0] = 2;
    } else {
      edgeCode[0] = 0;
    }

    //And vertically...
    if ((this.y-50) < 0) {
      edgeCode[1] = 1;
    } else if ((this.y+250) > high) {
      edgeCode[1] = 2;
    } else {
      edgeCode[1] = 0;
    }

    return edgeCode;
};
// for ref: ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);


var Enemy = function (loc,spd) {
    Entity.call(this, loc, 'images/enemy-bug.png');
    this.speed = spd;
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.collisionCheck = function() {
    var width = 100,
        height = 71,
        pWidth = 70;
    var playerXOff = player.x + 15;
    if (this.x < (playerXOff + pWidth) && (this.x+ width) > playerXOff) {
      if (this.y < (player.y + height) &&
      (this.y + height) > player.y) {
        console.log('you lost');
      }
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
Enemy.prototype.constructor = Enemy;



var Player = function (loc,img) {
    Entity.call(this, loc, img);
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {
    this.x += this.speed[0];
    this.y += this.speed[1];
    this.speed = [0,0];

};

Player.prototype.handleInput = function (direction) {
  var edgeCode = this.checkEdge(ctx.canvas.width,ctx.canvas.height);
  switch (direction) {
    case 'left':
      if (edgeCode[0] != 1) {
        this.speed[0] = -100;
      }
      break;
    case 'right':
      if (edgeCode[0] != 2) {
        this.speed[0] = 100;
      }
      break;
    case 'up':
      if (edgeCode[1] != 1) {
        this.speed[1] = -80;
      }
      break;
    case 'down':
      if (edgeCode[1] !=2) {
        this.speed[1] = 80;
      }
      break;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemyOne = new Enemy([-100,60],[10,0]);
//var enemyTwo = new Enemy([500,1],[-10,0]);
var enemyThree = new Enemy([-100,220],[15,0]);
var allEnemies = [enemyOne,enemyThree];

var player = new Player([200,380],'images/char-boy.png');


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
