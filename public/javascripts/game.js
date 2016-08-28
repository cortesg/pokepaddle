var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {preload: preload, create: create, update: update, render: render});

var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var playing = false;
var startButton;
var scoreText;
var score = 0;
var highscore = 0;
var lives = 3;
var livesText;
var lifeLostText;
var time_var = Cookies.get("fastest_time_cookie");
var score_var = Cookies.get("score_cookie");

function reload() {
    location.reload();
}

function preload() {    
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    //LOADING IMAGES
    game.load.image('background', '../images/johto.png');
    game.load.image('ball', '../images/pokeball.png', 50, 50);
    game.load.image('ball2', '../images/pokeball_lives.png', 40, 40);
    game.load.image('paddle', '../images/platform.png')
    game.load.image('brick', '../images/pikachu.png');
}

function create() {
    //ADDING BASIC MOVEMENT
	game.physics.startSystem(Phaser.Physics.ARCADE);

    //BACKGROUND IMAGING
    var background = game.add.image(0, 0, 'background');
    background.scale.x = game.rnd.realInRange(1, 1);
    background.scale.y = game.rnd.realInRange(1, 1);

    //NO SOUTH BOUNDARY
	game.physics.arcade.checkCollision.down = false;

    //ADDING BALL IMAGES
    ball = game.add.sprite(game.world.width*0.5, game.world.height-55, 'ball');
    ball2 = game.add.sprite(game.world.width*0.85, game.world.height-317, 'ball2'); //'lives' counter

    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);   
    ball.body.velocity.set(0, 0);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1.05);  //1 = newtons 3rd law; >1 = momentum increases on impact; <1 = momentum decreases on impact
    ball.checkWorldBounds = true; //set boundaries
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    //ADDING PADDLE IMAGES
    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle'); //location setting for paddle
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.collideWorldBounds = true;
    paddle.checkWorldBounds = true;
    paddle.body.immovable = true; //initialize no movement on start
	
    initBricks(); //create the bricks

    //ALLOW USING COMPUTER KEYBOARD
    cursors = game.input.keyboard.createCursorKeys();
    cursors.up.onDown.add(startGame, this); //start game by pressing up

    //TEXT PROJECTION
    textStyle = { font: '18px Arial', fill: '#0095DD' };
    startText = game.add.text(game.world.width*0.06, game.world.height*0.6, 'Be a Pokemon master, press UP to throw the Pokeball', { font: '18px Arial', fill: 'yellow' });
    scoreText = game.add.text(5, 5, 'Pokemon Captured: 0', { font: '18px Arial', fill: '#0095DD' });
    livesText = game.add.text(game.world.width-5, 5, ': '+lives, { font: '18px Arial', fill: '#0095DD' });
    livesText.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.6, 'Pokeball lost, press UP to throw another Pokeball', { font: '18px Arial', fill: 'yellow' });
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

}

function update() {
	game.physics.arcade.collide(ball, paddle, ballHitPaddle);
	game.physics.arcade.collide(ball, bricks, ballHitBrick);
	if(playing) {
	    if(cursors.left.isDown){
	        paddle.body.velocity.x = -400;
	    } else if(cursors.right.isDown){
	    	paddle.body.velocity.x = 400;
	    }
    }
}

function initBricks() {
    brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 7,
            col: 3
        },
        offset: {
            top: 58,
            left: 30
        },
        padding: 19
    }
    bricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}

function ballHitPaddle(ball, paddle) {
    ball.animations.play('wobble');
}

function ballHitBrick(ball, brick) {
    // $("audio")[1].play();
	brick.kill();
    score++;
    scoreText.setText('Pokemon Captured: '+ score);

    var count_alive = 0;
    for (i = 0; i < bricks.children.length; i++) {
        if (bricks.children[i].alive == true) {
            count_alive++;
        }
    }
    if (count_alive == 0) {
        scoreText.setText('High Score: 21', 40, 40);
        if (parseInt(time_var) > game.time.totalElapsedSeconds()) {  
            Cookies.set("fastest_time_cookie", game.time.totalElapsedSeconds())
            $("#high_score").html("Fastest time: " + Math.round10(game.time.totalElapsedSeconds(), -2))
        }
    alert('You are a Pokemon Master, congrats! Your completion time is ' + Math.round10(game.time.totalElapsedSeconds(), -2) + ' seconds.'); 
    location.reload();    
    }
}

function startGame() {
    cursors.up.onDown.addOnce(function(){
        if (playing == false) {
            startText.visible = false;
            ball.body.velocity.set(200, -200);
            playing = true;
        }
	})
}

function ballLeaveScreen() {
    lives--;
    if(lives) {
        livesText.setText(': '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width*0.5, game.world.height-55);
        cursors.up.onDown.addOnce(function(){
            playing=true;
            lifeLostText.visible = false;
            ball.body.velocity.set(200, -200);
        }, this);
    }
    else {
        if (time_var == "99999" && score < 21 && score > score_var) {
            Cookies.set("score_cookie", score)
            $("#high_score").html("High Score: " + score)
        }
        alert('No more Pokeballs, game over!');
        location.reload();
    }
}

function render() {
    // Closure
    (function() {
      /**
       * Decimal adjustment of a number.
       *
       * @param {String}  type  The type of adjustment.
       * @param {Number}  value The number.
       * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
       * @returns {Number} The adjusted value.
       */
        function decimalAdjust(type, value, exp) {
            // If the exp is undefined or zero...
            if (typeof exp === 'undefined' || +exp === 0) {
              return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // If the value is not a number or the exp is not an integer...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
              return NaN;
            }
            // Shift
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Shift back
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
            }  
            // Decimal round
            if (!Math.round10) {
                Math.round10 = function(value, exp) {
                return decimalAdjust('round', value, exp);
            };
        };
    })();
    game.debug.text('Timer: ' + Math.round10(this.game.time.totalElapsedSeconds(), -2), 250, 19);
}