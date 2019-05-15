// Enemies our player must avoid

var lenx = 101;
var leny = 83;

var vxPlayer = 2.5;
var vyPlayer = 3;
var currentvx = vxPlayer;
var currentvy = vyPlayer;
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
    this.ay = 0;
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
    if (Math.abs(this.vy) >= leny) {
        this.ay *= -1;
    }
    this.vy += (this.ay * leny); 
    this.y += this.vy * dt;
};

Enemy.prototype.collide = function () {
    player.death = true;
    princess.saved = false;
    key.collected = false;
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

var CatGirl = function (y) {
    Enemy.call(this, Math.floor(Math.random() * 10 + 1), y, 0.75, 1);
    this.sprite = 'images/CatGirl.png';
    this.ay = 0.01;
};
CatGirl.prototype = Object.create(Enemy.prototype);
CatGirl.prototype.constructor = CatGirl;

var HornGirl = function (y) {
    Enemy.call(this, Math.floor(Math.random() * 10 + 1), y, vHorn, 0);
    this.sprite = 'images/HornGirl.png';
    this.ay = 0.2;
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
    this.key = false;
    this.life = 3;
    this.score = 0;
};

Player.prototype.update = function (dt) {
    if ((this.vxBug == 0) && (this.y > leny * 3) && (this.y < leny * 6)) {
        player.death = true;
        princess.saved = false;
        key.collected = false;
    }
    if (this.y > (leny * -0.75)) {
        if (this.y < leny * 0.75) {
            if (((this.vx >= 0) && ((this.x < (lenx * 4)) || ((this.x > (lenx * 6)) && (this.x < (lenx * 10.4))))) ||
                ((this.vx <= 0) && ((this.x > (lenx * 6)) || ((this.x < (lenx * 4)) && (this.x > (lenx * -0.4))))) ||
                ((this.x >= (lenx * 4)) && (this.x <= (lenx * 6) ) && (this.key == true))) {
                this.x += (this.vx * dt);
                this.y += (this.vy * dt);
            }
        } else if ((((this.vx + this.vxBug) < 0) && (this.x > (lenx * -0.4))) ||
            (((this.vx + this.vxBug) > 0) && (this.x < (lenx * 10.4)))) {
            this.x += ((this.vx + this.vxBug) * dt);
        }
        if ((this.y > leny * 0.75) && (this.vy < 0)) {
            this.y += (this.vy * dt);
        }
        if ((this.y < leny * 10) && (this.y > leny * 0.75) && (this.vy > 0)) {
            this.y += (this.vy * dt);
        }
    } else {
        this.y += (leny * 0.1);
    }
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key, mode) {
    if (mode == 'down') {
        if (key == 'e') {
            if (princess.savable == true) {
                princess.saved = !(princess.saved);
            } 
        }
        if (this.vy == 0) {
            if (key == 'left') {
                this.vx = (-currentvx * lenx);
            } else if (key == 'right') {
                this.vx = (currentvx * lenx);
            }
        } else if (this.vy != 0) {
            if (key == 'left') {
                this.vx = (-currentvx * lenx * vxPlayerModifier);
            } else if (key == 'right') {
                this.vx = (currentvx * lenx * vxPlayerModifier);
            }
        }
        if (this.vx == 0) {
            if (key == 'up') {
                event.preventDefault();
                this.vy = (-currentvy * leny);
            } else if (key == 'down') {
                event.preventDefault();
                this.vy = (currentvy * leny);
            }
        } else if (this.vx != 0) {
            if (key == 'up') {
                event.preventDefault();
                this.vy = (-currentvy * leny * vyPlayerModifier);
            } else if (key == 'down') {
                event.preventDefault();
                this.vy = (currentvy * leny * vyPlayerModifier);
            }
        }
    } else if (mode == 'up') {
        if (key == 'left') {
            if (this.vx < 0) {
                this.vx = 0;
            }
        } else if (key == 'right') {
            if (this.vx > 0) {
                this.vx = 0;
            }
        } else if (key == 'up') {
            event.preventDefault();
            if (this.vy < 0) {
                this.vy = 0;
            }
        } else if (key == 'down') {
            event.preventDefault();
            if (this.vy > 0) {
                this.vy = 0;
            }
        }
    }
};

var Princess = function (x, y) {
    this.x = (x - 1) * lenx;
    this.y = -20 + ((y - 1) * leny);
    this.sprite = 'images/Princess.png';
    this.savable = false;
    this.saved = false;
};
Princess.prototype.update = function (dt) {
    if (this.saved == true) {
        this.x = (player.x + (lenx * 0.25));
        this.y = player.y;
        currentvx = 0.5 * vxPlayer;
        currentvy = 0.5 * vyPlayer;
    } else if (this.saved == false) {
        currentvx = vxPlayer;
        currentvy = vyPlayer;
    } 
    if ((this.x > (spawn.x - (lenx * 0.25))) && (this.x < (spawn.x + (lenx * 0.5))) &&
        (this.y > (spawn.y - (leny * 0.25))) && (this.y < (spawn.y + (leny * 0.5)))) {
        spawn.sprite = 'images/Heart.png';
        player.score += 1000;
    }
};
Princess.prototype.checkCollision = function () {
    if (((this.x > (player.x - (lenx * 0.25))) && (this.x < (player.x + (lenx * 0.25))) &&
        (this.y > (player.y - (leny * 0.2))) && (this.y < (player.y + (leny * 0.2)))) ||
        (this.saved == true)) {
        this.savable = true;
    } else {
        this.savable = false;
    }
};
Princess.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Selector = function (x, y) {
    this.x = (x - 1) * lenx;
    this.y = -20 + ((y - 1) * leny);
    this.sprite = 'images/Selector.png';
};
Selector.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Cage = function (x, y) {
    Selector.call(this, x, y);
};
Cage.prototype = Object.create(Selector.prototype);
Cage.prototype.constructor = Cage;
Cage.prototype.update = function () {
    if ((this.x > (player.x - (lenx * 1))) && (this.x < (player.x + (lenx * 1))) &&
        (this.y > (player.y - (leny * 0.75))) && (this.y < (player.y + (leny * 0.75))) && (player.key == true)) {
        this.sprite = 'images/Star.png';
    }
};

var Key = function () {
    this.x = (lenx * Math.floor(Math.random() * 10 + 1));
    this.y = (-20 + (leny * Math.floor(Math.random() * 9 + 1)));
    this.sprite = 'images/Key.png';
};
Key.prototype.update = function () {
    if (player.key == true) {
        this.x = (player.x - (lenx * 0.25));
        this.y = player.y;
    }
};
Key.prototype.checkCollision = function () {
    if ((this.x > (player.x - (lenx * 0.25))) && (this.x < (player.x + (lenx * 0.25))) &&
        (this.y > (player.y - (leny * 0.25))) && (this.y < (player.y + (leny * 0.5)))) {
        player.key = true;
    }
};
Key.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Gem = function(y1, y2, color) {
    this.x = (lenx * Math.floor(Math.random() * 10 + 1));
    this.y = (-20 + (leny * Math.floor(Math.random() * (y2 - y1) + y1 - 1)));
    this.value = 0;
    if (color == "blue") {
        this.sprite = 'images/GemBlue.png';
        this.value = 300;
    } else if (color == "green") {
        this.sprite = 'images/GemGreen.png';
        this.value = 100;
    } else if (color == "orange") {
        this.sprite = 'images/GemOrange.png';
        this.value = 200;
    }
    this.collected = false;
}
Gem.prototype.update = function () {
    if (this.collected) {
        this.x = -lenx;
        this.y = -leny;
        player.score += this.value;
        this.collected = false;
    }
};
Gem.prototype.checkCollision = function () {
    if ((this.x > (player.x - (lenx * 0.25))) && (this.x < (player.x + (lenx * 0.25))) &&
        (this.y > (player.y - (leny * 0.25))) && (this.y < (player.y + (leny * 0.5)))) {
        this.collected = true;
        }
};
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var spawn = new Selector(6, 10.75);
var cage = new Cage(6, 0.75);
var key = new Key();

var blueGem = new Gem(5, 7, "blue");
var greenGem = new Gem(8, 10, "green");
var orangeGem = new Gem(2, 4, "orange");
var gems = [blueGem, greenGem, orangeGem];

var princess = new Princess(6, 1);

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


var cG1 = new CatGirl(3);
var cG2 = new CatGirl(9);
var cG = [cG1, cG2];

var hG1 = new HornGirl(2);
var hG2 = new HornGirl(4);
var hG3 = new HornGirl(8);
var hG4 = new HornGirl(10);
var hG = [hG1, hG2, hG3, hG4];

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

var player = new Player(6, 9.75);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function keyDown(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        69: 'e'
    };
    if ((player.life <= 0) || (player.score >= 1000)) {
        this.removeEventListener(event.type, keyDown);
    }
    player.handleInput(allowedKeys[e.keyCode], 'down');
});

document.addEventListener('keyup', function keyUp(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        69: 'e'
    };
    player.handleInput(allowedKeys[e.keyCode], 'up');
});
