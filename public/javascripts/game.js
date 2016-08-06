var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {preload: preload, create: create, update: update});

var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var playing = false;
var startButton;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;

function preload() {    
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    // game.stage.backgroundColor = '#eee';

    //LOADING IMAGES
    game.load.image('background', '../images/kanto.jpeg');
    game.load.image('ball', '../images/pokeballS.png', 50, 50);
    game.load.image('ball2', '../images/pokeballS.png', 40, 40);
    game.load.image('paddle', '../images/platform.png')
    game.load.image('brick', '../images/pikachu.png');
    game.load.image('button', '../images/rock.png');
    // game.load.spritesheet('ball', 'img/wobble.png', 20, 20);


}
function create() {
    //ADDING BASIC MOVEMENT
	game.physics.startSystem(Phaser.Physics.ARCADE);

    //BACKGROUND IMAGING
    var background = game.add.image(0, 0, 'background');
    background.scale.x = game.rnd.realInRange(1.94, 1.94);
    background.scale.y = game.rnd.realInRange(1.6, 1.6);

    //NO SOUTH BOUNDARY
	game.physics.arcade.checkCollision.down = false;

    //ADDING BALL IMAGES
    ball = game.add.sprite(game.world.width*0.5, game.world.height-55, 'ball');
    ball2 = game.add.sprite(game.world.width*0.85, game.world.height-317, 'ball2'); //'lives' counter

    // ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
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
	   
    //ALLOW USING COMPUTER KEYBOARD
    cursors = game.input.keyboard.createCursorKeys();
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //adding spacebar
    initBricks();

    cursors.up.onDown.add(startGame, this); //start game by pressing up

    //TEXT PROJECTION
    textStyle = { font: '18px Arial', fill: '#0095DD' };
    startText = game.add.text(game.world.width*0.06, game.world.height*0.6, 'Be a Pokemon master, press UP to throw the Pokeball', { font: '18px Arial', fill: 'yellow' });
    scoreText = game.add.text(5, 5, 'Your Pokemon: 0', { font: '18px Arial', fill: '#0095DD' });
    // livesText = game.add.text(game.world.width-5, 5, 'Pokeballs: '+lives, { font: '18px Arial', fill: '#0095DD' });
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
            top: 57,
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
	brick.kill();
    score += 1;
    scoreText.setText('Your Pokemon: '+score);

    var count_alive = 0;
    for (i = 0; i < bricks.children.length; i++) {
      if (bricks.children[i].alive == true) {
        count_alive++;
      }
    }
    if (count_alive == 0) {
      alert('You are a Pokemon Master, congrats!');
      location.reload();
    }
}

function startGame() {
    startText.visible = true;
    cursors.up.onDown.addOnce(function(){
    startText.visible = false;
    ball.body.velocity.set(200, -200);
    playing = true;
	})
}

function ballLeaveScreen() {
    lives--;
    if(lives) {
        playing=false;
        // livesText.setText('Pokeball(s): '+lives);
        livesText.setText(': '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width*0.5, game.world.height-55);
        paddle.reset(game.world.width*0.5, game.world.height-5);
        cursors.up.onDown.addOnce(function(){
            playing=true;
            lifeLostText.visible = false;
            ball.body.velocity.set(200, -200);
        }, this);
    }
    else {
        alert('No more Pokeballs, game over!');
        location.reload();
    }
}