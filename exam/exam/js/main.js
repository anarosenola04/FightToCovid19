var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');
game.state.add('Boot', FightToCovid19.Boot);
game.state.add('Preloader', FightToCovid19.Preload);
game.state.add('MainMenu', FightToCovid19.MainMenu);
game.state.add('Game', FightToCovid19.Game);


game.state.start('Boot');