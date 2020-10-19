FightToCovid19.Game = function(){
    this.playerMinAngle = -20; //minimum player rotation
    this.playerMaxAngle = 20; //maximum player rotation

    this.coinRate = 1000;
    this.coinTimer =0; //coin wii loop

    this.enemyRate = 500;
    this.enemyTimer = 0;

    this.score = 0;
  };
  FightToCovid19.Game.prototype = {        //extend the Game method prototype
    create: function(){
      //show the same animation when user tap the screen
      this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
      this.background.autoScroll(-100,0);

      this.foreground=this.game.add.tileSprite(0,470,this.game.width, this.game.height-533, 'foreground');
      this.foreground.autoScroll(-100,0);

      this.ground=this.game.add.tileSprite(0, this.game.height-73, this.game.width,73, 'ground');
      this.ground.autoScroll(-400,0);

      this.player=this.add.sprite(200, this.game.height/2,'player');
      this.player.anchor.setTo(0.5);
      this.player.scale.setTo(0.5);

      this.player.animations.add('fly', [0,1,2,3,2,1]);
      this.player.animations.play('fly', 8, true);

      //this will enable physics to our game
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      //using the arcade physics system we are setting the gravity in the horizontal direction of 400, the higher the value the more gravity
      this.game.physics.arcade.gravity.y = 400;
      this.game.physics.arcade.enableBody(this.ground); //add gravity to our ground( in preload.js)
      this.ground.body.allowGravity = false; // we dont want our ground affected by gravity
      this.ground.body.immovable = true; //this will keep the ground stay in place
      this.game.physics.arcade.enableBody(this.player); //apply physics to our player
      this.player.body.collideWorldBounds = true;// if player fall (the player gone) if dont enable
      this.player.body.bounce.set(0.25); // we want our player to bounce when it runs

      this.coins = this.game.add.group();
      this.enemies= this.game.add.group();

      this.scoreText = this.game.add.bitmapText(10, 10, 'minecraftia', 'Score: 0', 24);

      this.jetSound= this.game.add.audio('rocket');
      this.coinSound= this.game.add.audio('coin');
      this.deathSound= this.game.add.audio('death');
      this.gameMusic= this.game.add.audio('gameMusic');
      this.gameMusic.play('', 0, true);

    },
    update: function(){
      if(this.game.input.activePointer.isDown){//active poiter can be a mouse or touch
        this.player.body.velocity.y -=50; // this will move our player to the upward motion
      }
      if(this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown){//change player angle if we are trying to move it up
        if(this.player.angle > 0){
          this.player.angle = 0;//reset angle
        }
        if(this.player.angle > this.playerMinAngle){
          this.player.angle -= 0.5;
        }
      } else if (this.player.body.velocity.y >=0 && !this.game.input.activePointer.isDown){
        if(this.player.angle < this.playerMaxAngle){
          this.player.angle += 0.5; // lean forward
        }
      }
      if(this.coinTimer < this.game.time.now){
        this.createCoin();
        this.coinTimer = this.game.time.now + this.coinRate;
      }
      if(this.enemyTimer < this.game.time.now){
        this.createEnemy();
        this.enemyTimer = this.game.time.now + this.enemyRate;
      }
     
      //we are telling to the arcade physics to check for collison and apply approriate Physics
      this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);

      this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
      
      this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);
    },
    shutdown: function(){
      this.coins.destroy();
      this.enemies.destroy();
      this.score=0;
      this.coinTimer=0;
      this.enemyTimer=0;
    },
    createCoin: function(){
      var x = this.game.width;
      var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);
      var coin = this.coins.getFirstExists(false);
      if(!coin){
        coin = new Coin(this.game, 0, 0);
        this.coins.add(coin);
      }
      coin.reset(x, y);
      coin.revive();
    },
    createEnemy: function(){
      var x = this.game.width;
      var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);
      var enemy = this.coins.getFirstExists(false);
      if(!enemy){
        enemy = new Enemy(this.game, 0, 0);
        this.enemies.add(enemy);
      }
      enemy.reset(x, y);
      enemy.revive();
    },

    groundHit: function(player, ground){
      player.body.velocity.y = -200; //bounce the player when hut the ground
    },
    coinHit: function(player, coin) {
      this.score++;
      this.coinSound.play();
      coin.kill();
      
      var dummyCoin= new Coin(this.game, coin.x, coin.y);
      this.game.add.existing(dummyCoin);

      dummyCoin.animations.play('spin', 40, true);

      var scoreTween= this.game.add.tween(dummyCoin).to({x:50, y:50}, 300, Phaser.Easing.Linear.None, true);

      scoreTween.onComplete.add(function(){
        dummyCoin.destroy();
        this.scoreText.text= 'Score: ' + this.score;
      }, this);
    
    },
    enemyHit: function(player, enemy){
      player.kill();
      enemy.kill();
      
      this.deathSound.play();
      this.gameMusic.stop();


      this.ground.stopScroll();
      this.background.stopScroll();
      this.foreground.stopScroll();

      this.enemies.setAll('body.velocity.x', 0);
      this.coins.setAll('body.velocity.x', 0);

      this.enemyTimer = Number.MAX_VALUE;
      this.coinTimer = Number.MAX_VALUE;

      var scoreboard = new Scoreboard(this.game);
      scoreboard.show(this.score);

    }
  };
  var Coin = function(game, x, y, key, frame){
    key ='coins';
    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.scale.setTo(0.5);
    this.anchor.setTo(0.5);
    this.animations.add('spin');//see preload.js
    this.game.physics.arcade.enableBody(this); //enable physics
    this.body.allowGravity = false;// now allow coins to fall
    this.checkWorldBounds = true;//Phaser will check the coin
    this.onOutOfBoundsKill = true; //hide or kill the coin when it goes off screen
    this.events.onKilled.add(this.onKilled, this);
    this.events.onRevived.add(this.onRevived, this);
  };
  Coin.prototype = Object.create(Phaser.Sprite.prototype);
  Coin.prototype.constructor = Coin;
  Coin.prototype.onRevived = function(){
    this.body.velocity.x = -400;
    this.animations.play('spin', 10, true);
  };
  Coin.prototype.onKilled = function(){
    this.animations.frame = 0;
  };


  
  