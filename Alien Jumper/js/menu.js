var menuState={

		

		create: function(){

	game.add.image(0,0, 'background');
	var nameLabel= game.add.text(game.width/2, -50, 'Alien Jumper', {font: '50px Itim', fill:'#FFFF00'});
	nameLabel.anchor.setTo(0.5, 0.5);
	var tween=game.add.tween(nameLabel);
	game.add.tween(nameLabel).to({y:80},1000).easing(Phaser.Easing.Bounce.Out).start();
	game.add.tween(nameLabel).to({y:80},1000).start();



var scoreLabel = game.add.text(game.width/2, game.height/2,
		'High score:'+game.global.score,
		{font:'25px Itim',fill:'#FFFF00'});
		scoreLabel.anchor.setTo(0.5,0.5);


	//logo image
	game.add.image(200,200, 'p1_front');
		


	game.time.events.add(Phaser.Timer.SECOND * 3, this.fadeState, this);

		game.stage.backgroundColor= '#ffffff';

		game.physics.startSystem(Phaser.Physics. ARCADE);
		game.renderer.renderSession.roundPixels=true;
		
	},
         
         fadeState: function(){
         	//console.log("menu...");
           game.state.start('intro');

         },
	
		
	
};