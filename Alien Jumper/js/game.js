var game = new Phaser.Game(500,600,Phaser.AUTO, 'gameDiv');

game.global ={
	score:0
};
game.state.add('boot',bootState);
game.state.add('load',loadState);
game.state.add('intro',introState);

game.state.add('menu',menuState);
game.state.add('play',playState);

//game.state.add('won',wonState);
//game.state.add('home',homeState);
game.state.start('boot');