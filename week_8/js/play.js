var playState = {

	create: function(){


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
		game.global.score = 0;

		//create enemy group
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		//create 10 enemies
		this.enemies.createMultiple(10, 'enemy');
		//call add enemy every 2.2 second
		this.time.events.loop(2200, this.addEnemyFromTop, this);
		this.time.events.loop(2200, this.addEnemyFromBottom, this);


		//sound
		this.jumpSound = game.add.audio('jump');
		this.coinSound = game.add.audio('coin');
		this.deadSound = game.add.audio('dead');

		//animation
		this.player.animations.add('right',[1,2],8,true);
		//left anim
		this.player.animations.add('left',[3,4],8,true);


		this.emitter = game.add.emitter(0,0,15);

		this.emitter.makeParticles('pixel');

		this.emitter.setYSpeed(-150,150);
		this.emitter.setXSpeed(-150,150);

		this.emitter.gravity=0;
	},

	update: function(){
		//player
		game.physics.arcade.collide(this.player, this.walls);
		this.movePlayer();
		if (!this.player.inWorld){
			this.playerDie();
		}

		//coin
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

		//enemies
		game.physics.arcade.collide(this.enemies, this.walls);
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

		if(!this.player.alive){
			return;
		}
	},

	movePlayer: function(){
		if (this.cursor.left.isDown){

			this.player.body.velocity.x = -200;
			this.player.animations.play('left');
		}
		else if (this.cursor.right.isDown){
			this.player.body.velocity.x = 200;
			this.player.animations.play('right');
			
		}
		else {

			this.player.body.velocity.x = 0;
			this.player.animations.stop();//stop anim
			this.player.frame=0;//stand still
		}

		if (this.cursor.up.isDown && this.player.body.touching.down){
			this.jumpSound.play();
			this.player.body.velocity.y = -320;
		}
	}
	
	,
	startMenu: function(){
		game.state.start('menu');
	},

	playerDie: function(){
		this.player.kill();
		this.deadSound.play();

		this.emitter.x=this.player.x;
		this.emitter.y=this.player.y;
		this.emitter.start(true,800,null,15);
		
	
	game.time.events.add(1000,this.startMenu,this);
	game.camera.shake(0.02,300);

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
		// this.coin.kill();
		this.coin.scale.setTo(0,0);
		game.add.tween(this.coin.scale).to({x:1,y:1},1000).start();
		game.add.tween(this.player.scale).to({x:1.3,y:1.3},100).yoyo(true).start();
		game.global.score += 5;
		this.scoreLabel.text = 'score: ' + game.global.score;
		this.updateCoinPosition();
		this.coinSound.play();
	},

//add enemy function
	addEnemyFromTop: function() {
		//get 1st dead enemy of group
		var enemy = this.enemies.getFirstDead();
		//do nothing if no enemy
		if (!enemy) {
			return;
		}

		//initialize an enemy
		//set anchor to  center bottom
		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.width/2, 0);
		//add gravity
		enemy.body.gravity.y = 500;
		enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
		
		enemy.body.bounce.x = 1;
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	},

	addEnemyFromBottom: function() {
		var enemyb = this.enemies.getFirstDead();

		if (!enemyb) {
			return;
		}

		//initialize an enemy
		enemyb.anchor.setTo(0.5, 1);
		//add enemy from bottom
		enemyb.reset(game.width/2,game.height);
		//add gravity 
		enemyb.body.gravity.y = -500;
		enemyb.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
		enemyb.body.bounce.x = 1;
		enemyb.checkWorldBounds = true;
		enemyb.outOfBoundsKill = true;
	},

	
};