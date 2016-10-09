var mainState = {
	
	preload: function() {
		game.load.image('player', 'assets/player.png');
		game.load.image('wallV', 'assets/wallVertical.png');
		game.load.image('wallH','assets/wallHorizontal.png');
		game.load.image('coin', 'assets/coin.png');
	},

	create: function() {
		game.stage.backgroundColor = '#3498db';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.renderer.renderSession.roundRixels = true;

		//display coin
		this.coin = game.add.sprite(60,140,'coin');

		//add  arcade physic to coin 
		game.physics.arcade.enable(this.coin);
		//set anchor 
		this.coin.anchor.setTo(0.5,0.5);

		//player
		this.player = game.add.sprite(game.width/2, game.height/2, 'player');
		this.player.anchor.setTo(0.5, 0.5);

		game.physics.arcade.enable(this.player);

		this.player.body.gravity.y = 300;

		//control
		this.cursor = game.input.keyboard.createCursorKeys();

		//walls by grouping
		this.walls = game.add.group();
		this.walls.enableBody = true;

		//2 walls in a group left, right
		game.add.sprite(0,0,'wallV',0,this.walls);
		game.add.sprite(480,0,'wallV',0,this.walls);

		//walls
		game.add.sprite(0,0,'wallH',0,this.walls); 
		game.add.sprite(300,0,'wallH',0,this.walls);
		game.add.sprite(0,320,'wallH',0,this.walls);
		game.add.sprite(300,320,'wallH',0,this.walls);

		game.add.sprite(-100,160,'wallH',0,this.walls);
		game.add.sprite(400,160,'wallH',0,this.walls);

		
		var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
		middleTop.scale.setTo(1.5, 1);

		var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
		middleBottom.scale.setTo(1.5, 1);

		// set wall to immovable	
		this.walls.setAll('body.immovable', true);

		//display score
		this.scoreLabel = game.add.text(30,30,'Score: 0', {
			font: '18px Arial',
			fill: '#ffffff'
		});
		//initialize score
		this.score = 0;
	},

	update: function() {
		//add collision
		game.physics.arcade.collide(this.player, this.walls);
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

		this.movePlayer();

		//check for respawn
		if (!this.player.inWorld) {
			this.playerDie();
		}
	},

	movePlayer: function() {
		if (this.cursor.left.isDown) {
			this.player.body.velocity.x = -200;
		}
		else if (this.cursor.right.isDown) {
			this.player.body.velocity.x = 200;
		}
		else {
			this.player.body.velocity.x = 0;
		}

		if (this.cursor.up.isDown && this.player.body.touching.down) {
			this.player.body.velocity.y = -320;
		}
	},

	playerDie: function(){
		game.state.start('main');
	},
	updateCoinPosition:function(){
		var coinPosition =[
		{x:140, y:60}, {s:360, y:60} ,
		{x:60, y:140}, {x:440, y:140},
		{x:130, y:300},{x:370, y :300}
		];
		for (var i=0; i<coinPosition.length; i++){
			if(coinPosition[i].x==this.coin.x){
				coinPosition.splice(i,1);
			}
		}
		var newPosition = game.rnd.pick(coinPosition);

		this.coin.reset(newPosition.x, newPosition.y);
	},

	takeCoin: function(player, coin) {
		// var number = game.rnd.integerInRange(a,b);
		// this.coin.reset(x,y);
		
		//increment score 
		this.score += 5;
		//update score 
		this.scoreLabel.text = 'Score: ' + this.score;
		//change position
		this.updateCoinPosition();
	},

	
};
	
var game = new Phaser.Game(500,	340, Phaser.AUTO, 'gameDiv');

game.state.add('main', mainState);
game.state.start('main');