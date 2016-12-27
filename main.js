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
  var gameState = null;

  var phaser = null;

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

  var HOUSE_COUNT = houseData.length;

  function preload() {
    phaser.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    phaser.load.image('background','assets/map-unfound.jpg');
    phaser.load.atlas('lit_houses', 'assets/lit-houses.png', 'assets/house-atlas.json');
    phaser.load.image('player','assets/ship.png');
    phaser.load.image('santa','assets/santa.png');
    phaser.load.image('clock','assets/clock.png');
    phaser.load.image('overlay','assets/overlay.png');
    phaser.load.image('logo','assets/logo.png');
    phaser.load.spritesheet('play_again_button','assets/play-again.png', 202, 50);

    phaser.load.image('present_blue','assets/present-blue.png');
    phaser.load.image('present_green','assets/present-green.png');
    phaser.load.image('present_purple','assets/present-purple.png');
    phaser.load.image('present_red','assets/present-red.png');
    phaser.load.image('present_yellow','assets/present-yellow.png');

    phaser.load.image('star_particle1','assets/star.png');
    phaser.load.image('star_particle2','assets/star_particle.png');

    phaser.load.audio('jingle_bells', ['assets/jingle-bells.mp3']);
    phaser.load.audio('turn1', ['assets/turn1.mp3']);
    phaser.load.audio('turn2', ['assets/turn2.mp3']);

    phaser.load.audio('beep1', ['assets/beep1.mp3']);
    phaser.load.audio('beep2', ['assets/beep2.mp3']);
    phaser.load.audio('beep3', ['assets/beep3.mp3']);
    phaser.load.audio('beep4', ['assets/beep4.mp3']);
    phaser.load.audio('beep5', ['assets/beep5.mp3']);
  }

  function resetGameState() {
    gameState = {
        background: null,
        music: null,
        groundGroup: null,
        overlayGroup: null,
        houses: [],
        turnSounds: [],
        beepSounds: [],
        screenOverlay: null,
        elapsedMs: 0,
        timerText: null,
        deliveredText: null,
        player: {
          turnDirection: 'left',
          delivered: 0,
          deliveredInARow: 0,
          currentPresentImage: null
        }
      }
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
    var text = phaser.add.text(0, 0, "0 : 00");
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

    var clock = phaser.add.sprite(0,0, 'clock');
    clock.anchor.setTo(0.5);
    clock.fixedToCamera = true;
    clock.cameraOffset.setTo(40, 40);
    clock.scale.setTo(0.25);

    gameState.timerText = text;
  }

  function createBlueText(text, x, y) {
    var text = phaser.add.text(0, 0, text);
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

    var presentIcon = phaser.add.sprite(0,0, pickPresentColor());
    presentIcon.anchor.setTo(0.5);
    presentIcon.fixedToCamera = true;
    presentIcon.cameraOffset.setTo(SCREEN_WIDTH - 230, 45);
    presentIcon.scale.setTo(1.5);

    gameState.deliveredText = text;
  }

  function actionOnClickPlayAgain() {
    gameState.music.stop();
    phaser.state.restart();
  }

  function createScoreboardText(timeForThisGame, topFiveTimes) {
    var text = createBlueText("Best times", SCREEN_WIDTH / 2, 200);

    for (var i = topFiveTimes.length - 1; i >= 0; i--) {
      var topTime = topFiveTimes[i];
      var topTimeText = createTimeText(topTime);
      var y = 250 + (i * 50);
      var text = phaser.add.text(SCREEN_WIDTH / 2, y, topTimeText);
      text.anchor.setTo(0.5, 0);
      // text.font = 'Fontdiner Swanky';
      text.fontSize = 40;
      text.fixedToCamera = true;

      //  If we don't set the padding the font gets cut off
      //  Comment out the line below to see the effect
      text.padding.set(17, 16);

      if (topTime == timeForThisGame) {
        text.fill = '#ff0000';
      } else {
        text.fill = '#ffffff';
      }
      text.stroke = '#000000';
      text.strokeThickness = 2;
      text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    }

    var button = phaser.add.button(SCREEN_WIDTH / 2, 520, 'play_again_button', actionOnClickPlayAgain, this, 2, 1, 0);
    button.anchor.setTo(0.5, 0);
    button.fixedToCamera = true;
  }

  function createScoreboard(timeForThisGame) {
    gameState.screenOverlay = phaser.add.tileSprite(0,0, SCREEN_WIDTH, SCREEN_HEIGHT, 'overlay');
    gameState.screenOverlay.fixedToCamera = true;
    gameState.screenOverlay.alpha = 0.7;

    var logo = phaser.add.sprite(SCREEN_WIDTH / 2, 40, 'logo');
    logo.anchor.setTo(0.5, 0);
    logo.scale.setTo(0.75);

    gameState.overlayGroup = phaser.add.group();
    gameState.overlayGroup.fixedToCamera = true;
    gameState.overlayGroup.add(logo);

    var scores = getScoreboardScores();

    createScoreboardText(timeForThisGame, scores);
  }

  function createHouses() {
    for (var i=0; i<houseData.length; i++) {
      var houseDatum = houseData[i];
      var chimney = houseDatum.chimney;
      var litPosition = houseDatum.litSpritePos;
      var litSprite = phaser.add.sprite(litPosition.x,litPosition.y, 'lit_houses');

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
    var targetAngle = phaser.rnd.angle();
    var hitHouse = houseWasHit(targetPoint);

    if (hitHouse) {
      var chimney = chimneyForHouse(hitHouse);
      targetPoint = chimney.position;
      targetAngle = chimney.angle;
    }

    present.sprite = phaser.add.sprite(currentPos.x, currentPos.y, gameState.player.currentPresentImage);
    present.sprite.anchor.setTo(0.5, 0.5);
    gameState.groundGroup.add(present.sprite);

    phaser.add.tween(present.sprite).to({ x: targetPoint.x, y: targetPoint.y, angle: targetAngle }, time, Phaser.Easing.Linear.None, true, 0);

    var scale1 = phaser.add.tween(present.sprite.scale).to({x: 1.8, y: 1.8}, time * 0.3, Phaser.Easing.Linear.None)
    var scale2 = phaser.add.tween(present.sprite.scale).to({x: 0.8, y: 0.8}, time * 0.7, Phaser.Easing.Linear.None);

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
    resetGameState();
    gameState.background = phaser.add.tileSprite(0, 0, 2160, 2160, 'background');
    phaser.world.setBounds(0, 0, 2160, 2160);

    gameState.groundGroup = phaser.add.group();

    emitter = phaser.add.emitter(phaser.world.centerX, phaser.world.centerY, 400);
    emitter.makeParticles(['star_particle1', 'star_particle2']);

    emitter.gravity = 0;
    emitter.setAlpha(1, 0, 3000);
    emitter.setScale(0.8, 0, 0.8, 0, 3000);
    emitter.start(false, 3000, 5);

    presentEmitter = phaser.add.emitter(phaser.world.centerX, phaser.world.centerY, 400);
    presentEmitter.makeParticles(['present_blue', 'present_green', 'present_purple', 'present_red', 'present_yellow']);
    presentEmitter.setAlpha(1, 0, 3000);
    presentEmitter.setScale(1.5, 0, 0.8, 0, 3000);

    phaser.physics.startSystem(Phaser.Physics.ARCADE);

    player = phaser.add.sprite(phaser.world.centerX, phaser.world.centerY, 'player');
    player.anchor.setTo(0.5, 0.5);
    phaser.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    gameState.player.currentPresentImage = pickPresentColor();
    present = phaser.make.sprite(5,-35, gameState.player.currentPresentImage);
    present.anchor.setTo(0.5, 0.5);
    present.angle = -90;
    player.addChild(present);

    santa = phaser.make.sprite(0,-12, 'santa');
    santa.anchor.setTo(0.5, 0.5);
    player.addChild(santa);

    createHouses();
    createTimer();
    createDeliveredUi();

    cursors = phaser.input.keyboard.createCursorKeys();
    spaceKey = phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    gameState.music = phaser.add.audio('jingle_bells', 0.25);
    gameState.turnSounds.push(phaser.add.audio('turn1'));
    gameState.turnSounds.push(phaser.add.audio('turn2'));

    gameState.beepSounds.push(phaser.add.audio('beep1'));
    gameState.beepSounds.push(phaser.add.audio('beep2'));
    gameState.beepSounds.push(phaser.add.audio('beep3'));
    gameState.beepSounds.push(phaser.add.audio('beep4'));
    gameState.beepSounds.push(phaser.add.audio('beep5'));
    gameState.music.play();

    phaser.camera.roundPx = false;
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

      if (!house.delivered && house.chimney.distance(position, true) < 150) {
        return house;
      }
    }

    return false;
  }

  function chimneyForHouse(house) {
    return {
      position: house.chimney,
      angle: phaser.rnd.angle()
    };
  }

  function updateCamera() {
    var distanceInFront = 300;
    var currentPos = player.position.clone();
    var velocity = player.body.velocity.clone();
    var direction = Phaser.Point.normalize(velocity);
    direction.multiply(distanceInFront, distanceInFront);

    var targetPosition = Phaser.Point.add(currentPos, direction);

    var lerp = 0.05;

    phaser.camera.x = phaser.math.linear(
      phaser.camera.x,
      targetPosition.x - phaser.camera.view.halfWidth,
      lerp
    );
    phaser.camera.y = phaser.math.linear(
      phaser.camera.y,
      targetPosition.y - phaser.camera.view.halfHeight,
      lerp
    );
  }

  function sortNumber(a,b) {
    return a - b;
  }

  function getScoreboardScores() {
    return JSON.parse(localStorage.getItem('top_scores')) || [];
  }

  function updateScoreboardScores(ms) {
    var currentScores = getScoreboardScores();
    currentScores.push(ms);
    currentScores.sort(sortNumber);
    currentScores = currentScores.slice(0,5);
    localStorage.setItem('top_scores', JSON.stringify(currentScores));
  }

  function onLevelComplete() {
    player.body.collideWorldBounds = false;
    updateScoreboardScores(gameState.elapsedMs);
    createScoreboard(gameState.elapsedMs);
  }

  function createTimeText(ms) {
    var elapsedSeconds = Math.floor(ms / 1000);
    var displayedMinutes = Math.floor(elapsedSeconds / 60);
    var displayedSeconds = Math.floor(elapsedSeconds % 60);
    return displayedMinutes + " : " + padLeft(displayedSeconds, 2)
  }

  function update() {
    gameState.elapsedMs += phaser.time.physicsElapsedMS;

    var turnRate = TURN_RATE + (0.1 * gameState.player.deliveredInARow);

    if (gameState.player.delivered < HOUSE_COUNT) {
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

        if (gameState.player.delivered == HOUSE_COUNT) {
          onLevelComplete();
        }

        gameState.player.currentPresentImage = pickPresentColor();
        present.loadTexture(gameState.player.currentPresentImage);
      }

      var angle = player.body.rotation;

      var playerSpeed = PLAYER_SPEED + (20 * gameState.player.deliveredInARow);

      var dx = playerSpeed * Math.cos(angle * Math.PI / 180);
      var dy = playerSpeed * Math.sin(angle * Math.PI / 180);

      player.body.velocity = new Phaser.Point(dx, dy);

      updateCamera();

      gameState.timerText.text = createTimeText(gameState.elapsedMs);
      gameState.deliveredText.text = String(gameState.player.delivered) + " / " + HOUSE_COUNT;
    }

    emitter.emitX = player.x;
    emitter.emitY = player.y;
  }

  function main() {
    var phaserFunctions = { preload: preload, create: create, update: update };

    phaser = new Phaser.Game(
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
