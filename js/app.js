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
    console.log(this.x,this.y,this.sprite,this.speed,this.constructor);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// for ref: ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);


var Enemy = function (loc,spd) {
    Entity.call(this, loc, 'images/enemy-bug.png');
    this.speed = spd;
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.collisionCheck = function() {
    if (this.x == player.x && this.y == player.y) {
      console.log('you lost');
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
    console.log(this.x,this.y);
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function(dt) {
    this.x += (dt * this.speed[0]);
    this.y += (dt * this.speed[1]);
    this.speed = [0,0];
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers

};
Player.prototype.logPos = function(){
    console.log(this.x,this.y);
};

Player.prototype.handleInput = function (direction) {
  switch (direction) {
    case 'left':
      this.speed[0] = -100;
      break;
    case 'right':
      this.speed[0] = 100;
      break;
    case 'up':
      this.speed[1] = -100;
      break;
    case 'down':
      this.speed[1] = 100;
      break;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemyOne = new Enemy([250,0],[0,0]);
var allEnemies = [enemyOne];

var player = new Player([250,250],'images/enemy-bug.png');


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
