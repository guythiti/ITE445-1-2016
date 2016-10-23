var playState = {

     create: function(){



        game.physics.startSystem(Phaser.Physics.ARCADE);



        game.stage.backgroundColor = '#5C94FC';

        this.player = game.add.sprite(game.width/2,0, 'player');
      
        // Tell Phaser that the player will use the Arcade physics engine
        game.physics.arcade.enable(this.player);
        // Add vertical gravity to the player
        this.player.body.gravity.y = 700;

        this.player.anchor.setTo(0.5, 0.5);
         
//coin
//		this.coin = game.add.sprite(100, 140, 'coin');
//		game.physics.arcade.enable(this.coin);
//		this.coin.anchor.setTo(0.5, 0.5);
         
         
         
         //walls
		this.walls = game.add.group();
		this.walls.enableBody = true;
         
         //coin
		this.coin = game.add.sprite(200, 290, 'coin');
		game.physics.arcade.enable(this.coin);
		this.coin.anchor.setTo(0.5, 0.5);
          this.fixedToCamera = true;
         
         
         
//        var middlefour = game.add.sprite(250, 290, 'wallH', 0, this.walls);
//		middleBottom.scale.setTo(1, 1);
         
         
         
         
         this.scoreLabel = game.add.text(game.width/2, 20,
		'score:'+game.global.score,
   
		{font:'25px Itim',fill:'#FFFF00'});
          this.scoreLabel.fixedToCamera = true;
         
		this.scoreLabel.anchor.setTo(0.5,0.5)

        
        
        
        
        
game.physics.arcade.overlap(this.player, this.goal, this.win, null, this);
        
        
        //create enemy group
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		//create 10 enemies
		this.enemies.createMultiple(20, 'enemy');
		//call add enemy every 2.2 second
		//this.time.events.loop(2200, this.addEnemyFromTop, this);
		this.time.events.loop(2200, this.addEnemyFromBottom, this);

		//enemies
		game.physics.arcade.collide(this.enemies, this.walls);
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        
        
        
         
            this.player.animations.add('right', [1,2,3,4], 8, true);
         this.player.animations.add('left', [6,7,8,9], 8,true);
         this.player.animations.add('top', [3,4,5,6,7], 8, true);
         this.music = game.add.audio('music')
         this.music.loop = true;
         this.music.play();
         this.coinSound = game.add.audio('coin');
//         this.coinSound = game.add.audio('coin');
         this.winSound = game.add.audio('win');

          
        this.map = game.add.tilemap('map');
    //Add the tileset to the map
        this.map.addTilesetImage('items70');


    // Create the layer by specifying the name of the Tiled layer
        this.layer2 = this.map.createLayer('Tile Layer 2');
         this.layer = this.map.createLayer('Tile Layer 1');
        
      // Set the world size to match the size of the layer
           this.layer.resizeWorld();
//           this.layer2.resizeWorld();
           game.physics.arcade.enable(this.layer);
           this.map.setCollisionBetween(0, 251, true, this.layer);
         //make player show on the top layer
         game.world.bringToTop(this.player);
         

         //set camera follow the player
		game.camera.follow(this.player);
         
       


        this.cursor = game.input.keyboard.createCursorKeys();


        },

        movePlayer: function() {
        // If the left arrow key is pressed 
        if (this.cursor.left.isDown) {
        // Move the player to the left
        // The velocity is in pixels per second 
        this.player.body.velocity.x = -200;
            this.player.animations.play('left');
        }
        // If the right arrow key is pressed
        else if (this.cursor.right.isDown) {
         // Move the player to the right 
         this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        }
        // If neither the right or left arrow key is pressed
        else {
        // Stop the player
        this.player.body.velocity.x = 0;
        }
        
        //check if jump button is pressed
		if ((this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.jump) && this.player.body.onFloor()) {
			this.player.body.velocity.y = -600;
            
            
}
this.goal = game.add.sprite(1450, 200, 'goal');
		game.physics.arcade.enable(this.goal);
        
		this.goal.anchor.setTo(0.5, 0.5);            
        
         },
//    updateCoinPosition: function(){
//		var coinPosition = [
//		{x: 140, y: 180}, {x: 260, y: 180},
//		{x: 440, y: 140}, {x: 640, y: 140},
//		// {x: 130, y: 140}, {x: 170, y: 130},
//		];
//
//		for (var i = 0; i < coinPosition.length; i++){
//			if(coinPosition[i].x ==this.coin.x) {
//				coinPosition.splice(i, 1);
//			}
//		}
//		var newPosition = game.rnd.pick(coinPosition);
//		this.coin.reset(newPosition.x, newPosition.y);
//	},
//
//	takeCoin: function(player, coin) {
//this.score += 5;
//this.scoreLabel.text = 'score: ' + this.score;
////this.updateCoinPosition();
//	},
    
    
        

         update: function(){

             
            game.physics.arcade.collide(this.player , this.layer);
             
             
            this.movePlayer();
             if(!this.player.inWorld){
                 this.playerDie();
             }
             //coin
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
             

game.physics.arcade.overlap(this.player, this.goal, this.win, null, this);




            
         },

        
            playerDie: function(){
                this.music.stop();
                game.state.start('menu');
                
            },
    
 updateCoinPosition: function(){
		var coinPosition = [
		{x: 140, y: 180}, {x: 260, y: 180},
		{x: 440, y: 140}, {x: 640, y: 140},
		// {x: 130, y: 140}, {x: 170, y: 130},
		];

		for (var i = 0; i < coinPosition.length; i++){
			if(coinPosition[i].x ==this.coin.x) {
				coinPosition.splice(i, 1);
			}
		}
		var newPosition = game.rnd.pick(coinPosition);
		this.coin.reset(newPosition.x, newPosition.y);
	},

	takeCoin: function(player, coin, goal){
		// this.coin.kill();
		this.coin.scale.setTo(0,0);
		game.add.tween(this.coin.scale).to({x:1,y:1},1000).start();
		game.add.tween(this.player.scale).to({x:1.3,y:1.3},100).yoyo(true).start();
		game.global.score += 5;
        'score: ' + game.global.score;
        
		this.updateCoinPosition();
		this.coinSound.play();
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
    
        this.scoreLabel.setText('score;'+ --game.global.score);
       
	},






win: function(player, goal){
		// this.coin.kill();
		this.goal.scale.setTo(0,0);
		game.add.tween(this.goal.scale).to({x:1,y:1},1000).start();
		game.add.tween(this.player.scale).to({x:1.3,y:1.3},100).yoyo(true).start();
		game.global.score += 5;
       this.scoreLabel.setText('score: ' + game.global.score);
    goal.kill();
		
		this.music.stop();
		this.winSound.play();
	},

home: function(){
			
			game.state.start('won');
		},













          
     }
  

