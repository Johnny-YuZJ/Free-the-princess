// Enemies our player must avoid

var lenx = 101;
var leny = 83;

var vxPlayer = 2.5;
var vyPlayer = 3;
var vxPlayerModifier = (Math.sqrt(Math.pow(vyPlayer, 2) / (1 + (Math.pow(vyPlayer, 2) / (Math.pow(vxPlayer, 2))))) / vxPlayer);
var vyPlayerModifier = (Math.sqrt(Math.pow(vyPlayer, 2) / (1 + (Math.pow(vxPlayer, 2) / (Math.pow(vyPlayer, 2))))) / vyPlayer);
var vBug = 2;
var vHorn = 4;
var vCat = 1;

var Enemy = function (x, y, vx, vy) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    //   this.sprite = 'images/Star.png';

    // parameter x, y indicates the row and column of the enemy,
    // this.x and this.y indicates the exact coordinate
    console.log(x);

    this.x = 0 + ((x - 1) * lenx);
    this.y = -20 + ((y - 1) * leny);
    this.vx = vx * lenx;
    this.vy = vy * leny;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (((this.x <= 1) && (this.vx < 0)) || ((this.x >= (10 * lenx)) && (this.vx > 0))) {
        this.vx *= -1;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
};

Enemy.prototype.collide = function () {
    player.death = true;
};

Enemy.prototype.checkCollision = function () {
    if ((this.x > (player.x - (lenx * 0.65))) && (this.x < (player.x + (lenx * 0.65))) &&
        (this.y > (player.y - (leny * 0.5))) && (this.y < (player.y + (leny * 0.5)))) {
        this.collide();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Subclass of Enemy:
var WaterBug = function (y, dir) {
    if (dir == 'ltr') {
        Enemy.call(this, Math.floor(Math.random() * 20 - 4), y, vBug, 0);
        this.sprite = 'images/BugLTR.png';
    } else if (dir == 'rtl') {
        Enemy.call(this, Math.floor(Math.random() * 20 - 4), y, -vBug, 0);
        this.sprite = 'images/BugRTL.png';
    }
};
WaterBug.prototype = Object.create(Enemy.prototype);
WaterBug.prototype.constructor = WaterBug;
WaterBug.prototype.update = function (dt) {
    if ((this.x > (16 * lenx)) && (this.vx > 0)) {
        this.x = (lenx * (-1 - (Math.floor(Math.random() * 5) / 2)));
    } else if ((this.x < (-4 * lenx)) && (this.vx < 0)) {
        this.x = (lenx * (11 + (Math.floor(Math.random() * 5) / 2)));
    }
    this.x += this.vx * dt;
}
WaterBug.prototype.collide = function () {
    player.vxBug = this.vx;
}
WaterBug.prototype.checkCollision = function () {
    if ((this.x > (player.x - (lenx * 0.5))) && (this.x < (player.x + (lenx * 0.5))) &&
        (this.y > (player.y - (leny * 0.25))) && (this.y < (player.y + (leny * 0.75)))) {
        this.collide();
    }
}

var PinkGirl = function (y, d0) {
    if (d0 == -1) {
        Enemy.call(this, Math.floor(Math.random() * 10 + 1), y, (Math.floor(Math.random() * 4 - 4) / 2), 0);
    } else if (d0 == 1) {
        Enemy.call(this, Math.floor(Math.random() * 10 + 1), y, (Math.floor(Math.random() * 4 + 1) / 2), 0);
    }
    this.sprite = 'images/PinkGirl.png';
};
PinkGirl.prototype = Object.create(Enemy.prototype);
PinkGirl.prototype.constructor = PinkGirl;

var CatGirl = function (x, y) {
    Enemy.call(this, x, y, 1, 0);
    this.sprite = 'images/CatGirl.png';
};
CatGirl.prototype = Object.create(Enemy.prototype);
CatGirl.prototype.constructor = CatGirl;

var HornGirl = function (y) {
    Enemy.call(this, Math.floor(Math.random() * 10 + 1), y, vHorn, 0);
    this.sprite = 'images/HornGirl.png';
};
HornGirl.prototype = Object.create(Enemy.prototype);
HornGirl.prototype.constructor = HornGirl;




// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function (x, y) {
    this.sprite = 'images/Boy.png';
    this.x = 0 + ((x - 1) * lenx);
    this.y = -20 + ((y - 1) * leny);
    this.vx = 0; // vector on x axis
    this.vy = 0; // vector on y axis
    this.vxBug = 0;
    this.death = false;
};

Player.prototype.update = function (dt) {
    if ((this.vxBug == 0) && (this.y > leny * 4) && (this.y < leny * 6)) {
        player.death = true;
    }
    this.x += ((this.vx + this.vxBug) * dt);
    this.y += (this.vy * dt);
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key, mode) {
    if (mode == 'down') {
        if (this.vy == 0) {
            if (key == 'left') {
                this.vx = (-vxPlayer * lenx);
            } else if (key == 'right') {
                this.vx = (vxPlayer * lenx);
            }
        } else if (this.vy != 0) {
            if (key == 'left') {
                this.vx = (-vxPlayer * lenx * vxPlayerModifier);
            } else if (key == 'right') {
                this.vx = (vxPlayer * lenx * vxPlayerModifier);
            }
        }
        if (this.vx == 0) {
            if (key == 'up') {
                this.vy = (-vyPlayer * leny);
            } else if (key == 'down') {
                this.vy = (vyPlayer * leny);
            }
        } else if (this.vx != 0) {
            if (key == 'up') {
                this.vy = (-vyPlayer * leny * vyPlayerModifier);
            } else if (key == 'down') {
                this.vy = (vyPlayer * leny * vyPlayerModifier);
            }
        }
    } else if (mode == 'up') {
        if (key == 'left') {
            if (this.vx == (-vxPlayer * lenx)) {
                this.vx += (vxPlayer * lenx);
            } else if (this.vx == (-vxPlayer * lenx * vxPlayerModifier)) {
                this.vx += (vxPlayer * lenx * vxPlayerModifier);
            }
        } else if (key == 'right') {
            if (this.vx == (vxPlayer * lenx)) {
                this.vx -= (vxPlayer * lenx);
            } else if (this.vx == (vxPlayer * lenx * vxPlayerModifier)) {
                this.vx -= (vxPlayer * lenx * vxPlayerModifier);
            }
        } else if (key == 'up') {
            if (this.vy == (-vyPlayer * leny)) {
                this.vy += (vyPlayer * leny);
            } else if (this.vy == (-vyPlayer * leny * vyPlayerModifier)) {
                this.vy += (vyPlayer * leny * vyPlayerModifier);
            }
        } else if (key == 'down') {
            if (this.vy == (vyPlayer * leny)) {
                this.vy -= (vyPlayer * leny);
            } else if (this.vy == (vyPlayer * leny * vyPlayerModifier)) {
                this.vy -= (vyPlayer * leny * vyPlayerModifier);
            }
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var wB51 = new WaterBug(5, 'ltr');
var wB52 = new WaterBug(5, 'ltr');
var wB53 = new WaterBug(5, 'ltr');
var wB54 = new WaterBug(5, 'ltr');
var wB71 = new WaterBug(7, 'ltr');
var wB72 = new WaterBug(7, 'ltr');
var wB73 = new WaterBug(7, 'ltr');
var wB74 = new WaterBug(7, 'ltr');
var wB61 = new WaterBug(6, 'rtl');
var wB62 = new WaterBug(6, 'rtl');
var wB63 = new WaterBug(6, 'rtl');
var wB64 = new WaterBug(6, 'rtl');
var allBugs = [wB51, wB52, wB53, wB54, wB61, wB62, wB63, wB64, wB71, wB72, wB73, wB74];

/*
var cG1 = new CatGirl(1, 2);
var cG2 = new CatGirl(1, 4);
var cG3 = new CatGirl(1, 8);
var cG4 = new CatGirl(1, 10);
var cG = [cG1, cG2, cG3, cG4];
*/
var cG = [];

var hG1 = new HornGirl(3);
var hG2 = new HornGirl(9);
var hG = [hG1, hG2];

var pG21 = new PinkGirl(2, 1);
var pG31 = new PinkGirl(3, 1);
var pG41 = new PinkGirl(4, 1);
var pG81 = new PinkGirl(8, 1);
var pG91 = new PinkGirl(9, 1);
var pG101 = new PinkGirl(10, 1);
var pG22 = new PinkGirl(2, -1);
var pG32 = new PinkGirl(3, -1);
var pG42 = new PinkGirl(4, -1);
var pG82 = new PinkGirl(8, -1);
var pG92 = new PinkGirl(9, -1);
var pG102 = new PinkGirl(10, -1);
var pG = [pG21, pG31, pG41, pG81, pG91, pG101, pG22, pG32, pG42, pG82, pG92, pG102];

var allEnemies = cG.concat(hG, pG);

var player = new Player(6, 11);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode], 'down');
});

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode], 'up');
});
