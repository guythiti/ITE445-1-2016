var mainState = {

	preload: function(){
		game.load.image('player', 'assets/player.png');
		game.load.image('wallV', 'assets/wallVertical.png');
		game.load.image('wallH', 'assets/wallHorizontal.png');
		game.load.image('coin', 'assets/coin.png');
		game.load.image('enemy', 'assets/enemy.png');
	},

	create: function(){
		game.stage.backgroundColor = "#3498db";
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.renderer.renderSession.roundPixels = true;

		//player
		this.player = game.add.sprite(game.width/2, game.height/2, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 500;

		//player control
		this.cursor = game.input.keyboard.createCursorKeys();


		//walls
		this.walls = game.add.group();
		this.walls.enableBody = true;
		game.add.sprite(0, 0, 'wallV', 0, this.walls);
		game.add.sprite(480, 0, 'wallV', 0, this.walls);

		game.add.sprite(0, 0, 'wallH', 0, this.walls);
		game.add.sprite(300,0, 'wallH', 0, this.walls);
		game.add.sprite(0,320, 'wallH', 0, this.walls);
		game.add.sprite(300,320, 'wallH', 0, this.walls);

		game.add.sprite(-100,160, 'wallH',0, this.walls);
		game.add.sprite(400,160, 'wallH',0, this.walls);

		var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
		middleTop.scale.setTo(1.5, 1);
		var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
		middleBottom.scale.setTo(1.5, 1);

		this.walls.setAll('body.immovable', true);

		//coin
		this.coin = game.add.sprite(60, 140, 'coin');
		game.physics.arcade.enable(this.coin);
		this.coin.anchor.setTo(0.5, 0.5);

		this.scoreLabel = game.add.text(30, 30, 'score: 0',
			{font: '18px Arial', fill: '#ffffff'});
		this.score = 0;

		//create enemy group
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		//create 10 enemies
		this.enemies.createMultiple(10, 'enemy');
		//call add enemy every 2.2 second
		game.time.events.loop(2200, this.addEnemy, this);
	

		this.enemies2 = game.add.group();//create enemy group with arcade physics
		this.enemies2.enableBody = true;
		this.enemies2.createMultiple(10, 'enemy');//create 10 enemies - they are dead by default
		game.time.events.loop(2200, this.addEnemy2, this);
	},

	update: function(){
		//player
		game.physics.arcade.collide(this.player, this.walls);
		this.movePlayer();
		if (!this.player.inWorld){
			this.playerDie();
		}

		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
		game.physics.arcade.collide(this.enemies, this.walls);
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
		game.physics.arcade.collide(this.enemies2, this.walls);
		game.physics.arcade.overlap(this.player, this.enemies2, this.playerDie, null, this);
	
		
	},

	movePlayer: function(){
		if (this.cursor.left.isDown){
			this.player.body.velocity.x = -200;
		}
		else if (this.cursor.right.isDown){
			this.player.body.velocity.x = 200;
		}
		else {
			this.player.body.velocity.x = 0;
		}

		if (this.cursor.up.isDown && this.player.body.touching.down){
			this.player.body.velocity.y = -320;
		}
	},

	playerDie: function(){
		game.state.start("main");
	},

	updateCoinPosition: function(){
		var coinPosition = [
		{x: 140, y: 60}, {x: 360, y: 60},
		{x: 60, y: 140}, {x: 440, y: 140},
		{x: 130, y: 300}, {x: 370, y: 300},
		];

		for (var i = 0; i < coinPosition.length; i++){
			if(coinPosition[i].x ==this.coin.x) {
				coinPosition.splice(i, 1);
			}
		}
		var newPosition = game.rnd.pick(coinPosition);
		this.coin.reset(newPosition.x, newPosition.y);
	},

	takeCoin: function(player, coin){
		
		this.score += 5;
		this.scoreLabel.text = 'score: ' + this. score;
		this.updateCoinPosition();
	},

//add enemy function
	addEnemy: function() {
		var enemy = this.enemies.getFirstDead();//get the first dead enemy of the group
		var enemy2 = this.enemies2.getFirstDead();
		if (!enemy && !enemy2) {
			return;//if there isn't any dead enemy do nothing
		}
		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.width/2, 0);
		enemy.body.gravity.y = 500;
		enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
		enemy.body.bounce.x = 1;
		enemy.checkWorldBounds.x = 1;
		enemy.outOfBoundsKill = true;
	},
	
	addEnemy2: function() {
		var enemy2 = this.enemies2.getFirstDead();//get the first dead enemy of the group
		if (!enemy2) {
			return;//if there isn't any dead enemy do nothing
		}
		
		enemy2.anchor.setTo(0.5, 0);
		enemy2.reset(game.width/2, game.height);
		enemy2.body.gravity.y = -500;
		enemy2.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
		enemy2.body.bounce.x = 1;
		enemy2.checkWorldBounds.x = 1;
		enemy2.outOfBoundsKill = true;
	},
};

var game = new Phaser.Game(500, 340, Phaser.AUTO, "gameDiv");

game.state.add('main', mainState); //name mainState as 'main'
game.state.start('main');