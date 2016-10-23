var menuState = {
	create: function (){
		game.add.image(0,0,'background');


	var nameLabel = game.add.text(game.world.centerX, -50, 'Super Coin Box', { font: '70px Geo', fill: '#ffffff' });
	nameLabel.anchor.setTo(0.5,0.5);
	game.add.tween(nameLabel).to({y:80},1000).easing(Phaser.Easing.Bounce.Out).start();
	
	if (!localStorage.getItem('bestScore')) {
          // Then set the best score to 0
          localStorage.setItem('bestScore', 0);
      }
      // If the score is higher than the best score
if (game.global.score > localStorage.getItem('bestScore')) { 
// Then update the best score 
localStorage.setItem('bestScore', game.global.score);
}


var text = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');
var scoreLabel = game.add.text(game.width/2, game.height/2, text, { font: '25px Arial', fill: '#ffffff', align: 'center' });
scoreLabel.anchor.setTo(0.5, 0.5);

// Store the relevant text based on the device used
if (game.device.desktop) {
var text = 'press the up arrow key to start';
} else {
var text = 'touch the screen to start'; }
      // Display the text variable
var startLabel = game.add.text(game.world.centerX, game.world.height-80, text,{ font: '25px Arial', fill: '#ffffff' });
      startLabel.anchor.setTo(0.5, 0.5);


	game.add.tween(startLabel).to({angle: -2},500).to({angle:2},1000).to({angle:0},500).loop().start();
	//create new phaser keyboard varaible
	//when press call start

this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this); this.muteButton.input.useHandCursor = true;
if (game.sound.mute) {
this.muteButton.frame = 1; }
var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP); upKey.onDown.addOnce(this.start, this);
game.input.onDown.addOnce(this.start, this); },
toggleSound: function() {
game.sound.mute = ! game.sound.mute; this.muteButton.frame = game.sound.mute ? 1 : 0;
},
start: function() { game.state.start('play');
} };
