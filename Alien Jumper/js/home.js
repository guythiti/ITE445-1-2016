var homeState = {

create: function(){
	
	this.homeSound = game.add.audio('home');
	
	   game.add.image(0,0, 'home');
	   this.homeSound.play();
	   var picLabel= game.add.image(game.width/2, game.height-30, 'restart');
		picLabel.anchor.setTo(0.8,1);
		 picLabel.inputEnabled = true;
		 picLabel.events.onInputDown.add(this.start, this);

		//game.time.events.add(Phaser.Timer.SECOND * 10, this.fadeState, this);

		//game.stage.backgroundColor= '#ffffff';

		game.physics.startSystem(Phaser.Physics. ARCADE);
		game.renderer.renderSession.roundPixels=true;
		
	},
         
         // fadeState: function(){
         //   game.state.start('play');

         // },
	start: function(){
			
			game.state.start('intro');
		},
	};

