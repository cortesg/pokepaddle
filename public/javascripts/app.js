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

function preload() {
    handleRemoteImagesOnJSFiddle();
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png')
    game.load.image('brick', 'img/brick.png');
    game.load.spritesheet('button', 'img/button.png', 120, 40);
    game.load.spritesheet('ball', 'img/wobble.png', 20, 20);


}
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.checkCollision.down = false;
    ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
    // ball = game.add.sprite(50, 250, 'ball');
    ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);   
    ball.body.velocity.set(0, 0);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.checkWorldBounds = true;
	ball.events.onOutOfBounds.add(function(){
    alert('Game over!');
    location.reload();
	}, this);


    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;
    // paddle.collideWorldBounds = true;
    // paddle.body.bounce.set(1);
    // paddle.checkWorldBounds = true;
	   

    cursors = game.input.keyboard.createCursorKeys();
    initBricks();

    startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
	startButton.anchor.set(0.5); 

    scoreText = game.add.text(5, 5, 'Your Pokemon: 0', { font: '18px Arial', fill: '#0095DD' });
}
function update() {
	game.physics.arcade.collide(ball, paddle, ballHitPaddle);
	// paddle.x = game.input.x || game.world.width*0.5;
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
            top: 50,
            left: 60
        },
        padding: 10
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
	// cursors = game.input.keyboard.createCursorKeys();
	// if(cursors.left.isDown){
    startButton.destroy();
    ball.body.velocity.set(200, -200);
    playing = true;
	// }
}

// this function (needed only on JSFiddle) take care of loading the images from the remote server
function handleRemoteImagesOnJSFiddle() {
	game.load.baseURL = 'https://end3r.github.io/Gamedev-Phaser-Content-Kit/demos/';
	game.load.crossOrigin = 'anonymous';
}