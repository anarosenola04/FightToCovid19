FightToCovid19.Preload = function() {
    this.ready = false;
  };
  FightToCovid19.Preload.prototype = {
    preload: function(){
      this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
      this.splash.anchor.setTo(0.5);
      this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
      this.splash.anchor.setTo(0.5);
      this.load.setPreloadSprite(this.preloadBar);
      this.load.image('ground', 'assets/images/ground.png');
      this.load.image('background', 'assets/images/background.png');
      this.load.image('foreground', 'assets/images/foreground.png');
      this.load.spritesheet('coins', 'assets/images/coins-ps.png ',300,128,1);
      this.load.spritesheet('player', 'assets/images/jetpack-ps.png', 129, 500,1);
      this.load.spritesheet('missile', 'assets/images/missiles-ps.png', 300,218,1);
      this.load.audio('gameMusic', ['assets/audio/Pamgaea.mp3' , 'assets/audio/Pamgaea.mp3' ]);
      this.load.audio('rocket', 'assets/audio/rocket.mp3');
      this.load.audio('bounce', 'assets/audio/bounce.mp3');
      this.load.audio('coin', 'assets/audio/coin.mp3');
      this.load.audio('death', 'assets/audio/death.mp3');
      this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml'); 
      this.load.onLoadComplete.add(this.onLoadComplete , this);
    },
    create: function() {
      this.preloadBar.cropEnabled = false;
    },
    update: function(){
      if(this.cache.isSoundDecoded('gameMusic') && this.ready === true){
        this.state.start('MainMenu')
    }
  },
  onLoadComplete: function() {
    this.ready = true;
    }
  };