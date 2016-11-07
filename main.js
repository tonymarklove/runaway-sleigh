var mainExports = (function() {
  function main() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
    var player = null;
    var cursors = null;

    var santaLeft = null;
    var santaRight = null;

    var playerSpeed = 500;
    var turnRate = 3;

    function preload () {
      game.load.image('background','assets/uk.jpg');
      game.load.image('player','assets/ship.png');
      game.load.image('santa_left','assets/santa-left.png');
      game.load.image('santa_right','assets/santa-right.png');
      game.load.image('player','assets/ship.png');

      game.load.image('star_particle1','assets/star.png');
      game.load.image('star_particle2','assets/star_particle.png');
    }

    function create () {
      game.add.tileSprite(0, 0, 2781, 4052, 'background');
      game.world.setBounds(0, 0, 2781, 4052);

      emitter = game.add.emitter(game.world.centerX, game.world.centerY, 400);
      emitter.makeParticles(['star_particle1', 'star_particle2']);

      emitter.gravity = 200;
      emitter.setAlpha(1, 0, 3000);
      emitter.setScale(0.8, 0, 0.8, 0, 3000);

      emitter.start(false, 3000, 5);

      game.physics.startSystem(Phaser.Physics.ARCADE);

      player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
      player.anchor.setTo(0.5, 0.5);
      game.physics.arcade.enable(player);
      player.body.collideWorldBounds = true;

      santaLeft = game.make.sprite(-65, -35, 'santa_left');
      santaRight = game.make.sprite(-65, -30, 'santa_right');

      player.addChild(santaLeft);
      player.addChild(santaRight);

      cursors = game.input.keyboard.createCursorKeys();

      game.camera.follow(player);
    }

    function update() {
      var angle = player.body.rotation;

      var dx = playerSpeed * Math.cos(angle * Math.PI / 180);
      var dy = playerSpeed * Math.sin(angle * Math.PI / 180);

      player.body.velocity = new Phaser.Point(dx, dy);

      if (cursors.left.isDown) {
        player.body.rotation = player.body.rotation - turnRate;
        santaLeft.visible = false;
        santaRight.visible = true;
      }
      else if (cursors.right.isDown) {
        player.body.rotation = player.body.rotation + turnRate;
        santaLeft.visible = true;
        santaRight.visible = false;
      }

      emitter.emitX = player.x;
      emitter.emitY = player.y;
    }

    function render() {
      // game.debug.cameraInfo(game.camera, 32, 32);
      // game.debug.spriteCoords(player, 32, 500);
    }
  }

  return {
    main: main
  };
})();

window.onload = function() {
  mainExports.main();
};
