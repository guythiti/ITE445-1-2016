var loadState={

	preload:function(){
		//add a loading label on screen
		var loadingLabel = game.add.text(game.width/2, 150,
			'loading...', { font:'30px Arial', fill:'#ffffff'});
		loadingLabel.anchor.setTo(0.5,0.5);

		game.load.image('background', 'assets/space.jpg');	
		game.load.image('p1_front' , 'assets/p1_front.png');

		game.load.image('intro', 'assets/rocket.jpg');
		//game.load.image('logo', 'assets/logo.png');
		game.load.image('skip', 'assets/skip.png');
        game.load.audio('music', ['assets/song.mp3']);
        game.load.image('coin', 'assets/coin.png');
        game.load.image('enemy', 'assets/fly.png');
        game.load.image('slime', 'assets/slime.png');
        game.load.image('win', 'assets/flag.png');

		//display progress bar
		var progressBar= game.add.sprite(game.width/2,200,'progressBar');
		progressBar.anchor.setTo(0.5,0.5);
		game.load.setPreloadSprite(progressBar);

		//load all assest
		game.load.spritesheet('player','assets/player.png',40,52);
	   
//        game.physics.enable(player.sprite);
//	    game.sprite.body.collideWorldBounds = true;


         game.load.tilemap('map', 'assets/map10.json', null, Phaser.Tilemap.TILED_JSON);
//         console.log("preload player");
        
         

         game.load.image('items70', 'assets/items70.png');
//win sound
game.load.audio('win', [ 'assets/win.wav']);
        game.load.image('goal','assets/goal.png');
     


	},
    
    
	create:function(){
		//go to menu state
		
        
		//console.log("load...");
		game.state.start('menu');
        
        
	}
};