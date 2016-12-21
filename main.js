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

  // State
  var gameState = {
    phaser: null,
    background: null,
    groundGroup: null,
    overlayGroup: null,
    houses: [],
    turnSounds: [],
    beepSounds: [],
    screenOverlay: null,
    elaspedMs: 0,
    timerText: null,
    deliveredText: null,
    player: {
      turnDirection: 'left',
      delivered: 0,
      deliveredInARow: 0,
      currentPresentImage: null
    }
  };

  var player = null;
  var cursors = null;
  var spaceKey = null;
  var present = null;

  var santa = null;

  var emitter = null;
  var presentEmitter = null;

  var houseData = [
    { chimney: {x: 462,  y: 165}, litSpritePos: {x: 460,  y: 223}, frameName: "house01" },
    { chimney: {x: 1021, y: 130}, litSpritePos: {x: 982, y: 176}, frameName: "house02" },
    { chimney: {x: 1946, y: 122}, litSpritePos: {x: 1984,  y: 161}, frameName: "house04" },
    { chimney: {x: 181,  y: 551}, litSpritePos: {x: 189,  y: 490}, frameName: "house05" },
    { chimney: {x: 699,  y: 455}, litSpritePos: {x: 734,  y: 503}, frameName: "house06" },
    { chimney: {x: 893,  y: 430}, litSpritePos: {x: 949, y: 440}, frameName: "house07" },
    { chimney: {x: 1111, y: 662}, litSpritePos: {x: 1054, y: 666}, frameName: "house10" },
    { chimney: {x: 1411, y: 315}, litSpritePos: {x: 1463, y: 339}, frameName: "house03" },
    { chimney: {x: 1976, y: 342}, litSpritePos: {x: 1983, y: 393}, frameName: "house09" },
    { chimney: {x: 1767, y: 496}, litSpritePos: {x: 1806, y: 534}, frameName: "house08" },
    { chimney: {x: 227,  y: 1288}, litSpritePos: {x: 178, y: 1257}, frameName: "house30" },
    { chimney: {x: 350,  y: 936}, litSpritePos: {x: 339, y: 882}, frameName: "house14" },
    { chimney: {x: 629,  y: 1088}, litSpritePos: {x: 640, y: 1033}, frameName: "house15" },
    { chimney: {x: 1037, y: 1061}, litSpritePos: {x: 1086, y: 1080}, frameName: "house16" },
    { chimney: {x: 1337, y: 698}, litSpritePos: {x: 1376,  y: 737}, frameName: "house11" },
    { chimney: {x: 1345, y: 1073}, litSpritePos: {x: 1389, y: 1099}, frameName: "house17" },
    { chimney: {x: 1703, y: 1180}, litSpritePos: {x: 1752, y: 1147}, frameName: "house18" },
    { chimney: {x: 1841, y: 773}, litSpritePos: {x: 1801,  y: 819}, frameName: "house12" },
    { chimney: {x: 1934, y: 835}, litSpritePos: {x: 1991,  y: 807}, frameName: "house13" },
    { chimney: {x: 178,  y: 1993}, litSpritePos: {x: 224,  y: 1953}, frameName: "house24" },
    { chimney: {x: 177,  y: 1548}, litSpritePos: {x: 232, y: 1555}, frameName: "house19" },
    { chimney: {x: 479,  y: 1437}, litSpritePos: {x: 530,  y: 1415}, frameName: "house20" },
    { chimney: {x: 793,  y: 2032}, litSpritePos: {x: 746, y: 1997}, frameName: "house25" },
    { chimney: {x: 931,  y: 1577}, litSpritePos: {x: 894, y: 1631}, frameName: "house26" },
    { chimney: {x: 1096, y: 1453}, litSpritePos: {x: 1038,  y: 1445}, frameName: "house21" },
    { chimney: {x: 1195, y: 1832}, litSpritePos: {x: 1196, y: 1771}, frameName: "house27" },
    { chimney: {x: 1479, y: 1592}, litSpritePos: {x: 1472,  y: 1537}, frameName: "house22" },
    { chimney: {x: 1439, y: 1937}, litSpritePos: {x: 1488, y: 1911}, frameName: "house28" },
    { chimney: {x: 1885, y: 1901}, litSpritePos: {x: 1854, y: 1947}, frameName: "house29" },
    { chimney: {x: 2054, y: 1473}, litSpritePos: {x: 2000,  y: 1485}, frameName: "house23" }
  ];

  function preload() {
    gameState.phaser.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    gameState.phaser.load.image('background','assets/map-unfound.jpg');
    gameState.phaser.load.atlas('lit_houses', 'assets/lit-houses.png', 'assets/house-atlas.json');
    gameState.phaser.load.image('player','assets/ship.png');
    gameState.phaser.load.image('santa','assets/santa.png');
    gameState.phaser.load.image('clock','assets/clock.png');
    gameState.phaser.load.image('overlay','assets/overlay.png');
    gameState.phaser.load.image('logo','assets/logo.png');
    gameState.phaser.load.spritesheet('play_again_button','assets/play-again.png', 202, 50);

    gameState.phaser.load.image('present_blue','assets/present-blue.png');
    gameState.phaser.load.image('present_green','assets/present-green.png');
    gameState.phaser.load.image('present_purple','assets/present-purple.png');
    gameState.phaser.load.image('present_red','assets/present-red.png');
    gameState.phaser.load.image('present_yellow','assets/present-yellow.png');

    gameState.phaser.load.image('star_particle1','assets/star.png');
    gameState.phaser.load.image('star_particle2','assets/star_particle.png');

    gameState.phaser.load.audio('jingle_bells', ['assets/jingle-bells.mp3']);
    gameState.phaser.load.audio('turn1', ['assets/turn1.mp3']);
    gameState.phaser.load.audio('turn2', ['assets/turn2.mp3']);

    gameState.phaser.load.audio('beep1', ['assets/beep1.mp3']);
    gameState.phaser.load.audio('beep2', ['assets/beep2.mp3']);
    gameState.phaser.load.audio('beep3', ['assets/beep3.mp3']);
    gameState.phaser.load.audio('beep4', ['assets/beep4.mp3']);
    gameState.phaser.load.audio('beep5', ['assets/beep5.mp3']);
  }

  function pickPresentColor() {
    var presents = [
      'present_blue',
      'present_green',
      'present_purple',
      'present_red',
      'present_yellow'
    ];

    return randomArrayItem(presents);
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

  function createBlueText(text, x, y) {
    var text = gameState.phaser.add.text(0, 0, text);
    text.anchor.setTo(0.5);

    text.font = 'Fontdiner Swanky';
    text.fontSize = 50;
    text.fixedToCamera = true;
    text.cameraOffset.setTo(x, y);

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
    return text;
  }

  function createDeliveredUi() {
    var text = createBlueText("0", SCREEN_WIDTH - 100, 50);

    var clock = gameState.phaser.add.sprite(0,0, pickPresentColor());
    clock.anchor.setTo(0.5);
    clock.fixedToCamera = true;
    clock.cameraOffset.setTo(SCREEN_WIDTH - 230, 45);
    clock.scale.setTo(1.5);

    gameState.deliveredText = text;
  }

  function actionOnClickPlayAgain() {
    console.log("click");
  }

  function createScoreboardText(topFiveTimes) {
    var text = createBlueText("Best scores", SCREEN_WIDTH / 2, 200);

    for (var i = topFiveTimes.length - 1; i >= 0; i--) {
      var topTime = topFiveTimes[i];
      var y = 250 + (i * 50);
      var text = gameState.phaser.add.text(SCREEN_WIDTH / 2, y, topTime);
      text.anchor.setTo(0.5, 0);
      // text.font = 'Fontdiner Swanky';
      text.fontSize = 40;
      text.fixedToCamera = true;

      //  If we don't set the padding the font gets cut off
      //  Comment out the line below to see the effect
      text.padding.set(17, 16);

      text.fill = '#ffffff';
      text.stroke = '#000000';
      text.strokeThickness = 2;
      text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    }

    var button = gameState.phaser.add.button(SCREEN_WIDTH / 2, 520, 'play_again_button', actionOnClickPlayAgain, this, 2, 1, 0);
    button.anchor.setTo(0.5, 0);
    button.fixedToCamera = true;
  }

  function createHouses() {
    for (var i=0; i<houseData.length; i++) {
      var houseDatum = houseData[i];
      var chimney = houseDatum.chimney;
      var litPosition = houseDatum.litSpritePos;
      var litSprite = gameState.phaser.add.sprite(litPosition.x,litPosition.y, 'lit_houses');

      litSprite.anchor.setTo(0.5, 0.5);
      litSprite.frameName = houseDatum.frameName;
      litSprite.visible = false;

      gameState.groundGroup.add(litSprite);

      gameState.houses.push({
        chimney: new Phaser.Point(chimney.x, chimney.y),
        litSprite: litSprite,
        delivered: false
      });
    }
  }

  function createInFlightPresent(currentPos, velocity) {
    var present = {};

    var time = 300;
    var throwSpeed = 200;

    var presentVelocity = Phaser.Point.normalize(velocity);
    presentVelocity.multiply(throwSpeed, throwSpeed);
    presentVelocity.add(velocity.x, velocity.y);
    presentVelocity.multiply(time / 1000, time / 1000);

    var targetPoint = Phaser.Point.add(currentPos, presentVelocity);
    var targetAngle = gameState.phaser.rnd.angle();
    var hitHouse = houseWasHit(targetPoint);

    if (hitHouse) {
      var chimney = chimneyForHouse(hitHouse);
      targetPoint = chimney.position;
      targetAngle = chimney.angle;
    }

    present.sprite = gameState.phaser.add.sprite(currentPos.x, currentPos.y, gameState.player.currentPresentImage);
    present.sprite.anchor.setTo(0.5, 0.5);
    gameState.groundGroup.add(present.sprite);

    gameState.phaser.add.tween(present.sprite).to({ x: targetPoint.x, y: targetPoint.y, angle: targetAngle }, time, Phaser.Easing.Linear.None, true, 0);

    var scale1 = gameState.phaser.add.tween(present.sprite.scale).to({x: 1.8, y: 1.8}, time * 0.3, Phaser.Easing.Linear.None)
    var scale2 = gameState.phaser.add.tween(present.sprite.scale).to({x: 0.8, y: 0.8}, time * 0.7, Phaser.Easing.Linear.None);

    scale1.chain(scale2);

    scale1.start();

    // Save current sound to play, which can change before the callback runs.
    var beepSoundToPlay = Math.min(gameState.player.deliveredInARow, 4);

    scale2.onComplete.add(function() {
      presentEmitter.emitX = targetPoint.x;
      presentEmitter.emitY = targetPoint.y;
      presentEmitter.start(true, 3000, null, 5);

      if (hitHouse) {
        hitHouse.litSprite.visible = true;
        gameState.beepSounds[beepSoundToPlay].play();
        present.sprite.destroy(present.sprite);
      }
    });

    return hitHouse;
  }

  function create() {
    gameState.background = gameState.phaser.add.tileSprite(0, 0, 2160, 2160, 'background');
    gameState.phaser.world.setBounds(0, 0, 2160, 2160);

    gameState.groundGroup = gameState.phaser.add.group();

    emitter = gameState.phaser.add.emitter(gameState.phaser.world.centerX, gameState.phaser.world.centerY, 400);
    emitter.makeParticles(['star_particle1', 'star_particle2']);

    emitter.gravity = 0;
    emitter.setAlpha(1, 0, 3000);
    emitter.setScale(0.8, 0, 0.8, 0, 3000);
    emitter.start(false, 3000, 5);

    presentEmitter = gameState.phaser.add.emitter(gameState.phaser.world.centerX, gameState.phaser.world.centerY, 400);
    presentEmitter.makeParticles(['present_blue', 'present_green', 'present_purple', 'present_red', 'present_yellow']);
    presentEmitter.setAlpha(1, 0, 3000); presentEmitter.setScale(1.5, 0, 0.8, 0, 3000);

    gameState.phaser.physics.startSystem(Phaser.Physics.ARCADE);

    player = gameState.phaser.add.sprite(gameState.phaser.world.centerX, gameState.phaser.world.centerY, 'player');
    player.anchor.setTo(0.5, 0.5);
    gameState.phaser.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    gameState.player.currentPresentImage = pickPresentColor();
    present = gameState.phaser.make.sprite(5,-35, gameState.player.currentPresentImage);
    present.anchor.setTo(0.5, 0.5);
    present.angle = -90;
    player.addChild(present);

    santa = gameState.phaser.make.sprite(0,-12, 'santa');
    santa.anchor.setTo(0.5, 0.5);
    player.addChild(santa);

    createHouses();
    createTimer();
    createDeliveredUi();

    gameState.screenOverlay = gameState.phaser.add.tileSprite(0,0, SCREEN_WIDTH, SCREEN_HEIGHT, 'overlay');
    gameState.screenOverlay.fixedToCamera = true;
    gameState.screenOverlay.alpha = 0.7;

    var logo = gameState.phaser.add.sprite(SCREEN_WIDTH / 2, 40, 'logo');
    logo.anchor.setTo(0.5, 0);
    logo.scale.setTo(0.75);
    // gameState.screenOverlay.addChild(logo);

    gameState.overlayGroup = gameState.phaser.add.group();
    gameState.overlayGroup.fixedToCamera = true;
    gameState.overlayGroup.add(logo);

    createScoreboardText(["0:35","1:56","0:35","0:35","0:35"]);

    cursors = gameState.phaser.input.keyboard.createCursorKeys();
    spaceKey = gameState.phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    music = gameState.phaser.add.audio('jingle_bells', 0.25);
    gameState.turnSounds.push(gameState.phaser.add.audio('turn1'));
    gameState.turnSounds.push(gameState.phaser.add.audio('turn2'));

    gameState.beepSounds.push(gameState.phaser.add.audio('beep1'));
    gameState.beepSounds.push(gameState.phaser.add.audio('beep2'));
    gameState.beepSounds.push(gameState.phaser.add.audio('beep3'));
    gameState.beepSounds.push(gameState.phaser.add.audio('beep4'));
    gameState.beepSounds.push(gameState.phaser.add.audio('beep5'));
    // music.play();

    gameState.phaser.camera.roundPx = false;
  }

  function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
  }

  function randomArrayItem(array) {
    return array[Math.floor(Math.random()*array.length)];
  }

  function houseWasHit(position) {
    for (var i=0; i<gameState.houses.length; i++) {
      var house = gameState.houses[i];

      if (!house.delivered && house.chimney.distance(position, true) < 100) {
        return house;
      }
    }

    return false;
  }

  function chimneyForHouse(house) {
    return {
      position: house.chimney,
      angle: gameState.phaser.rnd.angle()
    };
  }

  function updateCamera() {
    var targetPosition = player.position;
    var lerp = 0.1;

    gameState.phaser.camera.x = gameState.phaser.math.linear(
      gameState.phaser.camera.x,
      targetPosition.x - gameState.phaser.camera.view.halfWidth,
      lerp
    );
    gameState.phaser.camera.y = gameState.phaser.math.linear(
      gameState.phaser.camera.y,
      targetPosition.y - gameState.phaser.camera.view.halfHeight,
      lerp
    );
  }

  function update() {
    gameState.elaspedMs += gameState.phaser.time.physicsElapsedMS;

    var angle = player.body.rotation;

    var playerSpeed = PLAYER_SPEED + (20 * gameState.player.deliveredInARow);
    var turnRate = TURN_RATE + (0.1 * gameState.player.deliveredInARow);

    var dx = playerSpeed * Math.cos(angle * Math.PI / 180);
    var dy = playerSpeed * Math.sin(angle * Math.PI / 180);

    player.body.velocity = new Phaser.Point(dx, dy);

    if (cursors.left.isDown) {
      if (cursors.left.downDuration(10) && gameState.player.turnDirection != "left") {
        randomArrayItem(gameState.turnSounds).play();
      }

      gameState.player.turnDirection = "left";
      player.body.rotation = player.body.rotation - turnRate;
      santa.scale.y = -1;
      santa.y = 12;
      present.y = 35;
    }
    else if (cursors.right.isDown) {
      if (cursors.right.downDuration(10) && gameState.player.turnDirection != "right") {
        randomArrayItem(gameState.turnSounds).play();
      }

      gameState.player.turnDirection = "right";
      player.body.rotation = player.body.rotation + turnRate;
      santa.scale.y = 1;
      santa.y = -12;
      present.y = -35;
    }

    if (spaceKey.downDuration(10)) {
      var house = createInFlightPresent(new Phaser.Point(present.world.x, present.world.y), player.body.velocity.clone());
      if (house) {
        gameState.player.delivered += 1;
        gameState.player.deliveredInARow += 1;
        house.delivered = true;
      } else {
        gameState.player.deliveredInARow = 0;
      }

      gameState.player.currentPresentImage = pickPresentColor();
      present.loadTexture(gameState.player.currentPresentImage);
    }

    emitter.emitX = player.x;
    emitter.emitY = player.y;

    if (gameState.player.delivered < 30) {
      updateCamera();
    } else {
      player.body.collideWorldBounds = true;
    }

    var elapsedSeconds = Math.floor(gameState.elaspedMs / 1000);
    var displayedMinutes = Math.floor(elapsedSeconds / 60);
    var displayedSeconds = Math.floor(elapsedSeconds % 60);

    gameState.timerText.text = displayedMinutes + " : " + padLeft(displayedSeconds, 2);

    gameState.deliveredText.text = String(gameState.player.delivered) + " / 30";
  }

  function main() {
    var phaserFunctions = { preload: preload, create: create, update: update };

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
