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
    houses: []
  };

  var player = null;
  var cursors = null;
  var present = null;

  var santaLeft = null;
  var santaRight = null;

  var emitter = null;

  function preload() {
    // game.load.image('background','assets/uk.jpg');
    gameState.phaser.load.image('background','assets/debug-grid-1920x1920.png');
    gameState.phaser.load.image('player','assets/ship.png');
    gameState.phaser.load.image('santa_left','assets/santa-left.png');
    gameState.phaser.load.image('santa_right','assets/santa-right.png');
    gameState.phaser.load.image('present','assets/present.png');
    gameState.phaser.load.image('house','assets/house.png');

    gameState.phaser.load.image('star_particle1','assets/star.png');
    gameState.phaser.load.image('star_particle2','assets/star_particle.png');
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

    santaLeft = gameState.phaser.make.sprite(-65, -35, 'santa_left');
    santaRight = gameState.phaser.make.sprite(-65, -30, 'santa_right');

    createHouses();

    present = gameState.phaser.make.sprite(5,35, 'present');
    present.anchor.setTo(0.5, 0.5);
    present.angle = -90;
    player.addChild(present);

    player.addChild(santaLeft);
    player.addChild(santaRight);

    cursors = gameState.phaser.input.keyboard.createCursorKeys();

    gameState.phaser.camera.follow(player);
  }

  function update() {
    var angle = player.body.rotation;

    var dx = PLAYER_SPEED * Math.cos(angle * Math.PI / 180);
    var dy = PLAYER_SPEED * Math.sin(angle * Math.PI / 180);

    player.body.velocity = new Phaser.Point(dx, dy);

    if (cursors.left.isDown) {
      player.body.rotation = player.body.rotation - TURN_RATE;
      santaLeft.visible = false;
      santaRight.visible = true;
      present.y = 35;
    }
    else if (cursors.right.isDown) {
      player.body.rotation = player.body.rotation + TURN_RATE;
      santaLeft.visible = true;
      santaRight.visible = false;
      present.y = -35;
    }

    emitter.emitX = player.x;
    emitter.emitY = player.y;
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
