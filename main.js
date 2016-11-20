WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    // active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Fontdiner Swanky']
    }
};

var mainExports = (function() {
  // Contants
  var SCREEN_WIDTH = 800;
  var SCREEN_HEIGHT = 600;
  var PLAYER_SPEED = 500; // pixels per frame
  var TURN_RATE = 3; // degrees per frame
  var HOUSE_COUNT = 30;

  // State
  var gameState = {
    phaser: null,
    background: null,
    houses: [],
    elaspedMs: 0,
    timerText: null,
    deliveredText: null,
    player: {
      delivered: 0
    }
  };

  var player = null;
  var cursors = null;
  var present = null;

  var santa = null;

  var emitter = null;


  function preload() {
    gameState.phaser.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    // game.load.image('background','assets/uk.jpg');
    gameState.phaser.load.image('background','assets/debug-grid-1920x1920.png');
    gameState.phaser.load.image('player','assets/ship.png');
    gameState.phaser.load.image('santa','assets/santa.png');
    gameState.phaser.load.image('present','assets/present.png');
    gameState.phaser.load.image('house','assets/house.png');
    gameState.phaser.load.image('clock','assets/clock.png');

    gameState.phaser.load.image('star_particle1','assets/star.png');
    gameState.phaser.load.image('star_particle2','assets/star_particle.png');
  }

  function createTimer() {
    var text = gameState.phaser.add.text(0, 0, "0 : 00");
    text.anchor.setTo(0.5);

    text.font = 'Fontdiner Swanky';
    text.fontSize = 50;
    text.fixedToCamera = true;
    text.cameraOffset.setTo(165, 50);

    //  If we don't set the padding the font gets cut off
    //  Comment out the line below to see the effect
    text.padding.set(10, 16);

    var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    var clock = gameState.phaser.add.sprite(0,0, 'clock');
    clock.anchor.setTo(0.5);
    clock.fixedToCamera = true;
    clock.cameraOffset.setTo(40, 40);
    clock.scale.setTo(0.25);

    gameState.timerText = text;
  }

  function createDeliveredUi() {
    var text = gameState.phaser.add.text(0, 0, "0");
    text.anchor.setTo(0.5);

    text.font = 'Fontdiner Swanky';
    text.fontSize = 50;
    text.fixedToCamera = true;
    text.cameraOffset.setTo(SCREEN_WIDTH - 40, 50);

    //  If we don't set the padding the font gets cut off
    //  Comment out the line below to see the effect
    text.padding.set(10, 16);

    var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    var clock = gameState.phaser.add.sprite(0,0, 'present');
    clock.anchor.setTo(0.5);
    clock.fixedToCamera = true;
    clock.cameraOffset.setTo(SCREEN_WIDTH - 100, 45);
    clock.scale.setTo(1.5);

    gameState.deliveredText = text;
  }

  function createHouses() {
    for (var i=0; i<HOUSE_COUNT; i++) {
      var house = gameState.phaser.make.sprite(gameState.phaser.world.randomX, gameState.phaser.world.randomY, 'house');
      house.anchor.setTo(0.5, 0.5);
      house.scale.setTo(0.5, 0.5);
      house.angle = gameState.phaser.rnd.angle();
      gameState.background.addChild(house);
      gameState.houses.push({
        sprite: house,
        delivered: false
      });
    }
  }

  function create() {
    gameState.background = gameState.phaser.add.tileSprite(0, 0, 2781, 4052, 'background');
    gameState.phaser.world.setBounds(0, 0, 2781, 4052);

    emitter = gameState.phaser.add.emitter(gameState.phaser.world.centerX, gameState.phaser.world.centerY, 400);
    emitter.makeParticles(['star_particle1', 'star_particle2']);

    emitter.gravity = 200;
    emitter.setAlpha(1, 0, 3000);
    emitter.setScale(0.8, 0, 0.8, 0, 3000);

    emitter.start(false, 3000, 5);

    gameState.phaser.physics.startSystem(Phaser.Physics.ARCADE);

    player = gameState.phaser.add.sprite(gameState.phaser.world.centerX, gameState.phaser.world.centerY, 'player');
    player.anchor.setTo(0.5, 0.5);
    gameState.phaser.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    present = gameState.phaser.make.sprite(5,-35, 'present');
    present.anchor.setTo(0.5, 0.5);
    present.angle = -90;
    player.addChild(present);

    santa = gameState.phaser.make.sprite(0,-12, 'santa');
    santa.anchor.setTo(0.5, 0.5);
    player.addChild(santa);

    createHouses();
    createTimer();
    createDeliveredUi();

    cursors = gameState.phaser.input.keyboard.createCursorKeys();

    gameState.phaser.camera.follow(player);
  }

  function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
  }

  function update() {
    gameState.elaspedMs += gameState.phaser.time.physicsElapsedMS;

    var angle = player.body.rotation;

    var dx = PLAYER_SPEED * Math.cos(angle * Math.PI / 180);
    var dy = PLAYER_SPEED * Math.sin(angle * Math.PI / 180);

    player.body.velocity = new Phaser.Point(dx, dy);

    if (cursors.left.isDown) {
      player.body.rotation = player.body.rotation - TURN_RATE;
      santa.scale.y = -1;
      santa.y = 12;
      present.y = 35;
    }
    else if (cursors.right.isDown) {
      player.body.rotation = player.body.rotation + TURN_RATE;
      santa.scale.y = 1;
      santa.y = -12;
      present.y = -35;
    }

    emitter.emitX = player.x;
    emitter.emitY = player.y;

    var elapsedSeconds = Math.floor(gameState.elaspedMs / 1000);
    var displayedMinutes = Math.floor(elapsedSeconds / 60);
    var displayedSeconds = Math.floor(elapsedSeconds % 60);

    gameState.timerText.text = displayedMinutes + " : " + padLeft(displayedSeconds, 2);

    gameState.deliveredText.text = String(gameState.player.delivered);
  }

  function render() {
    // gameState.phaser.debug.cameraInfo(gameState.phaser.camera, 32, 32);
    // gameState.phaser.debug.spriteCoords(player, 32, 500);
  }

  function main() {
    var phaserFunctions = { preload: preload, create: create, update: update, render: render };

    gameState.phaser = new Phaser.Game(
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      Phaser.AUTO,
      "cavnas-target",
      phaserFunctions
    );
  }

  return {
    main: main
  };
})();

window.onload = function() {
  mainExports.main();
};
