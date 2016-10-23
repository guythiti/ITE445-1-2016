var introState={

	
	create: function(){
	
	
	   game.add.image(0,0, 'intro');
	   

		var picLabel= game.add.image(game.width/2, game.height-30, 'skip');
		picLabel.anchor.setTo(-1,1);
		 picLabel.inputEnabled = true;
		 picLabel.events.onInputDown.add(this.start, this);

		game.time.events.add(Phaser.Timer.SECOND * 10, this.fadeState, this);

		game.stage.backgroundColor= '#ffffff';

		game.physics.startSystem(Phaser.Physics. ARCADE);
		game.renderer.renderSession.roundPixels=true;
		
	},
         
         fadeState: function(){
           game.state.start('play');

         },
	start: function(){
			
			game.state.start('play');
		},

};