// Konstants below
const TILE_WIDTH = 101,
  TILE_HEIGHT = 83,
  ENEMY_WIDTH = 100,
  ENTITY_HEIGHT = 71,
  PLAYER_WIDTH = 60;

// Global Variables, difficulty and allEnemies (array of enemy objects)
var difficulty = 0,
    allEnemies;


//------------------------------ Entity Class ---------------------------------
// Code for any entity in the game that might interact.
// Input is a an array with 2D coordinates and a string for sprite location

var Entity = function(positionX,positionY,spriteLoc) {
    // Variables applied to each entity go here,
    // below are coordinates
    this.x = positionX;
    this.y = positionY;

    // The image/sprite for the entity, this uses
    // a helper provided to easily load images
    this.sprite = spriteLoc;

    // x, y array for speed coordinates. Not really necessary for these bugs,
    // but allows for the flexibility of adding another Enemy that moves along
    // the y axis

    this.speed = [0,0];
};

// Draw the entity on the screen, required method for game
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), (this.x), (this.y));
};

// Check if entity is off the board
Entity.prototype.checkEdge = function(canvasWidth,canvasHeight) {
  // Strings that are assigned to onscreen or position relative to canvas
  var edgeX = "onscreen", edgeY = "onscreen";

  // Check horizontally
  if ((this.x + TILE_WIDTH) <= 0) {
    edgeX = "left";
  } else if ((this.x + 2) >= canvasWidth) {
    edgeX = "right";
  } else {
    edgeX = "onscreen";
  }

  // Check vertically
  if ((this.y + ENTITY_HEIGHT) <= 0) {
    edgeY = "above";
  } else if ((this.y + ENTITY_HEIGHT) >= (canvasHeight - TILE_HEIGHT)) {
    edgeY = "below";
  } else {
    edgeY = "onscreen";
  }
  return [edgeX, edgeY];
};
//-------------------------- End entity class --------------------------------

//-------------------------- Enemy Subclass ----------------------------------
var Enemy = function (tier) {
  Entity.call(this, -150, 200, 'images/enemy-bug.png');
  this.tier = tier; // Which lane is it in. Counts from top. 0 = random
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// Function to check for collisions
Enemy.prototype.collisionCheck = function() {
  // Player X is the player's left edge coordinate, corrected for sprite
  var playerX = player.x + ((TILE_WIDTH - PLAYER_WIDTH) / 2),
    playerY = player.y,
    enemyX = this.x,
    enemyY = this.y;

  // Check for collision with player:
  if (enemyX < (playerX + PLAYER_WIDTH) && (enemyX + ENEMY_WIDTH) > playerX) {
    if (enemyY < (playerY + ENTITY_HEIGHT) &&
      (enemyY + ENTITY_HEIGHT) > playerY) {
      // Player has collided with a bug and has died! Triggers a function
      youLose();
    }
  }

  // Also Check if the bug is off screen, if it is, respawn
  var enemyEdgeCode = this.checkEdge(ctx.canvas.width,ctx.canvas.height);

  // Checks both edges, but not really necessary for both
  // unless bugs move right to left, another feature to be added
  if ((this.speed[0] > 0 && enemyEdgeCode[0] == "right")||
      (this.speed[0] < 0 && enemyEdgeCode[0] == "left")) {
    this.generateRandom();
  }
};

// Update enemy position, check for collisions
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
  var tier = this.tier,
      xStart = -ENEMY_WIDTH,
      yStart = -20, // Adjustment Parameters for starting Y and X positions...
      speed = 100, // Baseline speed
      speedRange = 40 + (20 * difficulty); // Factor to randomize speed,
                                               // dependent on difficulty

  // Randomize tier for some enemies
  if (tier == 0) {
    tier = Math.floor((Math.random()*3)+1);
  }

  // Increase speed by a random factor dependent on difficulty
  speed += Math.floor((Math.random()*speedRange)+1);

  // Randomize the xposition of where the bug starts
  xStart -= ((Math.floor(Math.random() * 5 * TILE_WIDTH)+1));

  // Set y starting position according to tier
  yStart += tier * TILE_HEIGHT;

  // Set parameters for the
  this.x = xStart;
  this.y = yStart;
  this.speed[0] = speed;
};
//-------------------------- End of enemy subclass code ----------------------

//-------------------------- Player Subclass ---------------------------------
// Code below is for the player object. It is a subclass of entity
var Player = function(playerSprite) {
  Entity.call(this, 200, 403, playerSprite);
  this.hold = true;
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

// Update function for Player. Checks for level clear and being at the edge,
// and moves the player according to the keyboard input
Player.prototype.update = function() {
  if (this.y <= 10) {
    levelClear(); // Function for beating the level
  } else {
    this.x += this.speed[0];
    this.y += this.speed[1];

    // Check if move will take the player offscreen, horizontally
    var edgeCode = this.checkEdge(ctx.canvas.width,ctx.canvas.height);
    if (edgeCode[0] != "onscreen") {
      this.x -= this.speed[0];
    }
    if (edgeCode[1] != "onscreen") {
      this.y -= this.speed[1];
    }
  }
  this.speed = [0,0];
};

// Handle keyboard input to move the player
Player.prototype.handleInput = function(direction) {
  switch (direction) {
    case 'left':
      this.speed[0] = -TILE_WIDTH;
      break;
    case 'right':
      this.speed[0] = TILE_WIDTH;
      break;
    case 'up':
      this.speed[1] = -TILE_HEIGHT;
      break;
    case 'down':
      this.speed[1] = TILE_HEIGHT;
      break;
  }
};

// Create an appropriate number of enemies and randomize them
var generateEnemies = function () {
  var enemyArray = [],
      roadTier = 3,
      numberOfEnemies = 5;
  if (difficulty < 9) {
    numberOfEnemies += difficulty;
  } else {
    numberOfEnemies = 12;
  }
  do {
    enemyArray.push(new Enemy(roadTier));
    enemyArray[enemyArray.length-1].generateRandom();
    enemyArray[enemyArray.length-1].x += 3 * TILE_WIDTH;
    numberOfEnemies--;
    if (roadTier > 0) {roadTier--;}
  } while (numberOfEnemies > 0);
  allEnemies = enemyArray;
};
//------------------------------ End of Player code --------------------------

//------------------------------ ScreenText object code ----------------------
/* This is an object that actually contains an image to be drawn on screen.
 * The image just gives some dialog of what the game status is */
var ScreenText = function() {
  this.duration = 0; // Duration the text remains on screen
  this.visible = false;
  Entity.call(this, 50, 200, 'images/ready.png'); // Default position and image
};
ScreenText.prototype = Object.create(Entity.prototype);
ScreenText.prototype.constructor = ScreenText;

ScreenText.prototype.update = function (dt) {
  if (this.duration > 0) {
    this.duration -= dt*1000;
  } else {
    this.duration = 0;
    this.visible = false;
  }
};

//------------------------------ End of ScreenText object ----------------------

/* Function to set a text overlay on screen, given an option will show different
 * text such as "Ready" or "Level Clear" */
var setTextOverlay = function(textOption,duration) {
  var img = 'images/ready.png';
  switch (textOption) {
    case 'ready':
      img = 'images/ready.png';
      break;
    case 'win':
      img = 'images/win.png';
      break;
    case 'lose':
      img = 'images/lose.png';
      break;
  }
  textOnScreen.visible = true;
  textOnScreen.duration = duration;
  textOnScreen.sprite = img;
};

// Instantiating enemy objects in an array called allEnemies
// Player object into player Variables
generateEnemies();
var player = new Player('images/char-boy.png');
var textOnScreen = new ScreenText();
// Function for what happens when you get through the level (yay!)
var levelClear = function() {
//  allEnemies = []; // Reset
  difficulty++; // Increase difficulty

//  player.hold = true; // Set player hold  <-- Maybe get rid of this?
  player.x = 202; // Reset player position
  player.y = 403;


  generateEnemies();
  setTextOverlay('win',1000);
  //setTimeout( function() {getReady(0)},1000);
};

// Function for when you get crushed by a bug
var youLose = function() {
  allEnemies = []; // Reset enemies
  difficulty = 0; // Reset difficulty

  player.hold = true; // Set player hold
  player.x = 202; // Reset player position
  player.y = 403;

  generateEnemies();
  setTextOverlay('lose',500); // Show text overlay for 1 second
  setTimeout( function() {getReady(0)},500); // Show Ready overlay after

};

// Function to show text for getting ready, takes parameter addedTime
// which allows the ready delay to be extended (For the first level)
var getReady = function(addedTime) {
  var delay = 500 + addedTime; // Delay time and "Ready" text time in ms
  setTextOverlay('ready', delay); //Show text overlay for delay time

  // Hold player movement for delay time
  setTimeout(function() {
    player.hold = false },delay);
};

// Function for Player movement disabled
var togglePlayerHold = function() {
  player.hold = !player.hold;
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    // Check to see if we're allowing the Player to move
    if (!player.hold) {
      player.handleInput(allowedKeys[e.keyCode]);
    }
});
