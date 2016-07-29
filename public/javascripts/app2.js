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
    game.stage.backgroundColor = '#eee';

    game.load.image('background', '../images/kanto.jpeg');
    game.load.image('ball', '../images/pokeball2.png', 50, 50);
    game.load.image('paddle', '../images/platform.png')
    game.load.image('brick', '../images/pikachu.png');
    game.load.image('button', '../images/rock.png');
    // game.load.spritesheet('ball', 'img/wobble.png', 20, 20);


}
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
    var background = game.add.image(0, 0, 'background');
    background.scale.x = game.rnd.realInRange(1.94, 1.94);
    background.scale.y = game.rnd.realInRange(1.6, 1.6);

	game.physics.arcade.checkCollision.down = false;
    ball = game.add.sprite(game.world.width*0.5, game.world.height-55, 'ball');
    // ball = game.add.sprite(50, 250, 'ball');
    // ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);   
    ball.body.velocity.set(0, 0);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);



    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;
    // paddle.collideWorldBounds = true;
    // paddle.body.bounce.set(1);
    // paddle.checkWorldBounds = true;
	   

    cursors = game.input.keyboard.createCursorKeys();
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    initBricks();

    cursors.up.onDown.add(startGame, this);
 //    startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'rock', startGame, this, 1, 0, 2);
	// startButton.anchor.set(0.5);


    textStyle = { font: '18px Arial', fill: '#0095DD' };
    startText = game.add.text(game.world.width*0.06, game.world.height*0.6, 'Be a Pokemon master, press UP to throw the Pokeball', { font: '18px Arial', fill: 'yellow' });
    scoreText = game.add.text(5, 5, 'Your Pokemon: 0', { font: '18px Arial', fill: '#0095DD' });
    livesText = game.add.text(game.world.width-5, 5, 'Pokeballs: '+lives, { font: '18px Arial', fill: '#0095DD' });
    livesText.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.6, 'Pokeball lost, press UP to throw another Pokeball', { font: '18px Arial', fill: 'yellow' });
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;
}
function update() {
	game.physics.arcade.collide(ball, paddle, ballHitPaddle);
	// paddle.x = game.input.x || game.world.width*0.5;
	game.physics.arcade.collide(ball, bricks, ballHitBrick);
	if(playing) {
	    if(cursors.left.isDown){
	        paddle.body.velocity.x = -600;
	    } else if(cursors.right.isDown){
	    	paddle.body.velocity.x = 600;
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
	// cursors = game.input.keyboard.createCursorKeys();
	// if(cursors.left.isDown){
    // game.input.onDown.addOnce(function(){
    // startButton.destroy()
        //     playing=false;
        // ball.reset(game.world.width*0.5, game.world.height-55);
        // paddle.reset(game.world.width*0.5, game.world.height-5);
        // game.input.onDown.addOnce(function(){
        //     playing=true;
        //     lifeLostText.visible = false;
        //     ball.body.velocity.set(400, -400);
        // }, this);
    startText.visible = true;
    cursors.up.onDown.addOnce(function(){
    startText.visible = false;
    ball.body.velocity.set(400, -400);
    playing = true;
	})
}

function ballLeaveScreen() {
    lives--;
    if(lives) {
        // paddle.body.velocity.set(0, 0);
        playing=false;
        livesText.setText('Pokeball(s): '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width*0.5, game.world.height-55);
        paddle.reset(game.world.width*0.5, game.world.height-5);
        cursors.up.onDown.addOnce(function(){
            playing=true;
            lifeLostText.visible = false;
            ball.body.velocity.set(400, -400);
        }, this);
    }
    else {
        alert('No more Pokeballs, game over!');
        location.reload();
    }
}

// this function (needed only on JSFiddle) take care of loading the images from the remote server
// function handleRemoteImagesOnJSFiddle() {
// 	game.load.baseURL = 'https://end3r.github.io/Gamedev-Phaser-Content-Kit/demos/';
// 	game.load.crossOrigin = 'anonymous';
// }