var playState = {
	create: function(){
		//player
		this.player = game.add.sprite(game.width/2, game.height/2, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 500;

		//player controls
		this.cursor = game.input.keyboard.createCursorKeys();
		game.input.keyboard.addKeyCapture(
			[Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]
		);
		// wasd control
		this.wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D)
		};

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

		//enemies
		this.enemiesTop = game.add.group();
		this.enemiesTop.enableBody = true;
		this.enemiesTop.createMultiple(10, 'enemy');
		this.nextEnemyTop = 0;
		this.enemiesBottom = game.add.group();
		this.enemiesBottom.enableBody = true;
		this.enemiesBottom.createMultiple(10, 'enemy');
		this.nextEnemyBottom = 0;

		//sounds
		this.jumpSound = game.add.audio('jump');
		this.coinSound = game.add.audio('coin');
		this.deadSound = game.add.audio('dead');

		//player animation
		this.player.animations.add('right', [1, 2], 8, true);
		this.player.animations.add('left', [3, 4], 8, true);

		//particles
		this.emitter = game.add.emitter(0, 0, 15);
		this.emitter.makeParticles('pixel');
		this.emitter.setYSpeed(-150, 150);
		this.emitter.setXSpeed(-150, 150);
		this.emitter.setScale(2, 0, 2, 0, 800);
		this.emitter.gravity = 0;


		
		if (!game.device.desktop) {
			this.addMobileInputs();

			this.rotateLabel = game.add.text(game.width/2, game.height/2, '', { font: '30px Arial', fill: '#fff', backgroundColor: '#000' }); 
			this.rotateLabel.anchor.setTo(0.5, 0.5);
			game.scale.onOrientationChange.add(this.orientationChange, this);

			this.orientationChange();
		}
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
		game.physics.arcade.collide(this.enemiesTop, this.walls);
		game.physics.arcade.overlap(this.player, this.enemiesTop, this.playerDie, null, this);

		game.physics.arcade.collide(this.enemiesBottom, this.walls);
		game.physics.arcade.overlap(this.player, this.enemiesBottom, this.playerDie, null, this);

		if (!this.player.alive) {
			return;
		}

		if (!this.player.inWorld) {
			this.playerDie();
		}






		if (this.nextEnemyTop < game.time.now) {
			var start = 4000, end = 1000, score = 100;
			var delay = Math.max
					(start - (start - end) * game.global.score / score, end);
			this.addEnemyFromTop();
			this.nextEnemyTop = game.time.now + delay;
		}
		if (this.nextEnemyBottom < game.time.now) {
			var start = 4000, end = 1000, score = 100;
			var delay = Math.max(start - (start - end) * game.global.score / score, end);
			this.addEnemyFromBottom();
			this.nextEnemyBottom = game.time.now + delay;
		}
	},

	movePlayer: function(){
		if (game.input.totalActivePointers == 0) {
			this.moveLeft = false;
			this.moveRight = false;
		}
		if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft){
			this.player.body.velocity.x = -200;
			this.player.animations.play('left');
		}
		else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight){
			this.player.body.velocity.x = 200;
			this.player.animations.play('right');
		}
		else {
			this.player.body.velocity.x = 0;
			this.player.animations.stop();
			this.player.frame = 0;
		}

		if (this.cursor.up.isDown || this.wasd.up.isDown){
			this.jumpPlayer();
		}
	},

	playerDie: function(){
		this.player.kill();
		this.deadSound.play();

		
		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;
		this.emitter.start(true, 800, null, 15);

		

		
		game.time.events.add(1000, this.startMenu, this);
		game.camera.shake(0.02, 300);
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
		this.coin.scale.setTo(0, 0);
		game.add.tween(this.coin.scale).to({x: 1, y: 1}, 500).start();
		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100).yoyo(true).start();
		this.coin.kill();
		game.global.score += 5;
		this.scoreLabel.text = 'score: ' + game.global.score;
		this.updateCoinPosition();
		this.coinSound.play();

	},

	addEnemyFromTop: function() {
		var enemyTop = this.enemiesTop.getFirstDead();

		if (!enemyTop) {
			return;
		}

		//initialize an enemy
		enemyTop.anchor.setTo(0.5, 1);
		enemyTop.reset(game.width/2, 0);
		enemyTop.body.gravity.y = 500;
		enemyTop.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
		enemyTop.body.bounce.x = 1;
		enemyTop.checkWorldBounds = true;
		enemyTop.outOfBoundsKill = true;
	},

	addEnemyFromBottom: function() {
		var enemyBottom = this.enemiesBottom.getFirstDead();

		if (!enemyBottom) {
			return;
		}

		//initialize an enemy
		enemyBottom.anchor.setTo(0.5, 1);
		enemyBottom.reset(game.width/2, game.height);
		enemyBottom.body.gravity.y = -500;
		enemyBottom.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
		enemyBottom.body.bounce.x = 1;
		enemyBottom.checkWorldBounds = true;
		enemyBottom.outOfBoundsKill = true;

	},

	startMenu: function() {
		game.state.start('menu');
	},

//mobile controls
	addMobileInputs: function() {
		var jumpButton = game.add.sprite(350, 240, 'jumpButton');
		jumpButton.inputEnabled = true;
		jumpButton.alpha = 0.5;

		var leftButton = game.add.sprite(50, 240, 'leftButton');
		leftButton.inputEnabled = true;
		leftButton.alpha = 0.5;

		var rightButton = game.add.sprite(130, 240, 'rightButton');
		rightButton.inputEnabled = true;
		rightButton.alpha = 0.5;

		jumpButton.events.onInputDown.add(this.jumpPlayer, this);

		this.moveLeft = false;
		this.moveRight = false;
//buttons
		leftButton.events.onInputOver.add(this.setLeftTrue, this); 
		leftButton.events.onInputOut.add(this.setLeftFalse, this); 
		leftButton.events.onInputDown.add(this.setLeftTrue, this); 
		leftButton.events.onInputUp.add(this.setLeftFalse, this);

		rightButton.events.onInputOver.add(this.setRightTrue, this); 
		rightButton.events.onInputOut.add(this.setRightFalse, this); 
		rightButton.events.onInputDown.add(this.setRightTrue, this); 
		rightButton.events.onInputUp.add(this.setRightFalse, this);

	},
 	
	jumpPlayer: function() { 
		if (this.player.body.touching.down) {  
			this.player.body.velocity.y = -320;
			this.jumpSound.play(); 
		} 
	},

	setLeftTrue: function() { this.moveLeft = true; },
	setLeftFalse: function() { this.moveLeft = false; },
	setRightTrue: function() { this.moveRight = true; },
	setRightFalse: function() { this.moveRight = false; },

	orientationChange: function() { 
		if (game.scale.isPortrait) { 
			game.paused = true; 
			this.rotateLabel.text = 'Please rotate your device '; 
		} 
		else { 
			game.paused = false; 
			this.rotateLabel.text = ''; 
		} 
	},

};