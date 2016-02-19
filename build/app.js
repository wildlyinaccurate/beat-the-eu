(function () {
  'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers.toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  babelHelpers;

  var gameWidth = 960;
  var gameHeight = 240;

  var cpuTextColour = '#f22';
  var playerTextColour = '#aaf';

  var empty = ['', { fill: '#000' }];
  var info = function info(text) {
    return ['<' + text + '>', { fill: '#fff', font: '18px monospace' }];
  };
  var cpu = function cpu(text) {
    return [text, { fill: cpuTextColour, font: '18px Arial' }];
  };
  var player = function player(text) {
    return [text, { fill: playerTextColour, font: '18px Arial' }];
  };

  var dialogue = [empty, info('Press the arrow keys to move'), info("You can only move in one direction. There's no going back now."), cpu('David, I am with you on this. but your welfare conditions need to be ironed out.'), // http://www.bbc.co.uk/news/uk-politics-eu-referendum-35499139
  player("Beata, let's be diplomatic. I am willing to negotiate."), info('Press [space] to negotiate'), player('Sorry, Beata. I am battling for Britain.'), // http://www.bbc.co.uk/news/uk-politics-eu-referendum-35599279

  empty];

  var defaultEasing = Phaser.Easing.Linear.None;

  var MainGame = function () {
    function MainGame() {
      babelHelpers.classCallCheck(this, MainGame);

      this.frozen = false;
      this.beataStarted = false;
      this.dialogueIdx = 0;
    }

    babelHelpers.createClass(MainGame, [{
      key: 'init',
      value: function init() {
        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
      }
    }, {
      key: 'preload',
      value: function preload() {
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.load.image('dave', 'assets/dave.png');
        this.load.image('beata', 'assets/beata.png');
        this.game.load.image('bullet', 'assets/bullet.png');
        this.game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
      }
    }, {
      key: 'create',
      value: function create() {
        var _this = this;

        this.player = this.makePlayer(20, 'dave');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        var textStyle = {
          boundsAlignH: 'center',
          boundsAlignV: 'middle'
        };

        this.dialogueText = this.game.add.text(0, 0, '', textStyle);
        this.dialogueText.setTextBounds(0, 0, gameWidth, 60);
        this.nextDialogue();

        this.spaceBar.onUp.add(function () {
          return _this.explodeShit();
        });

        this.cursors.right.onDown.addOnce(function () {
          return _this.nextDialogue();
        });
      }
    }, {
      key: 'update',
      value: function update() {
        this.player.body.velocity.x = 0;

        if (this.cursors.right.isDown && !this.frozen) {
          this.player.body.velocity.x = 200;

          if (this.facing !== 'right') {
            this.player.play('right');
            this.facing = 'right';
          }
        } else {
          if (this.facing !== 'idle') {
            this.player.animations.stop();
            this.player.frame = 4;
            this.facing = 'idle';
          }
        }

        if (this.player.body.position.x > 240 && !this.beataStarted) {
          this.startBeataSzydloDialogue();
        }
      }
    }, {
      key: 'walkTo',
      value: function walkTo(player, x) {
        var autoStart = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        return this.game.add.tween(player).to({ x: x }, 1500, defaultEasing, autoStart);
      }
    }, {
      key: 'startBeataSzydloDialogue',
      value: function startBeataSzydloDialogue() {
        var _this2 = this;

        this.beataStarted = true;
        this.frozen = true;

        this.beata = this.makePlayer(gameWidth * 1.1, 'beata', true);

        var beataWalk = function beataWalk(x) {
          var tween = _this2.walkTo(_this2.beata, x, true);

          tween.onStart.addOnce(function () {
            _this2.beata.play('left');
          });

          tween.onComplete.add(function () {
            _this2.beata.frame = 5;
            _this2.beata.animations.stop();
          });

          return tween;
        };

        var beataEnter = beataWalk(this.player.x + 240);
        var daveBackUp = this.walkTo(this.player, this.player.x - 50);

        beataEnter.onComplete.addOnce(function () {
          _this2.nextDialogue();

          setTimeout(function () {
            _this2.player.play('right');
            daveBackUp.start();
          }, 1600);
        });

        daveBackUp.onComplete.addOnce(function () {
          _this2.nextDialogue();
          _this2.player.animations.stop();
          _this2.facing = 'right';

          setTimeout(function () {
            return beataWalk(_this2.beata.x - 40);
          }, 1000);
          setTimeout(function () {
            return _this2.nextDialogue();
          }, 3200);
        });
      }
    }, {
      key: 'explodeShit',
      value: function explodeShit() {
        var _this3 = this;

        var explosion = this.game.add.sprite(this.beata.x - 32, this.beata.y - 32, 'kaboom');
        var boom = explosion.animations.add('kaboom');

        explosion.scale.set(2);
        explosion.play('kaboom', 30, false, true);

        boom.onComplete.addOnce(function () {
          var beataDie = _this3.unmakePlayer(_this3.beata);

          beataDie.onComplete.addOnce(function () {
            return _this3.nextDialogue();
          });
        });
      }
    }, {
      key: 'makePlayer',
      value: function makePlayer(xPos, faceSprite) {
        var cpu = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        var player = this.game.add.sprite(xPos, gameHeight - 48 * 2, 'dude');
        player.face = this.game.make.sprite(-6, -30, faceSprite);

        player.scale.set(2);
        player.addChild(player.face);
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        if (!cpu) {
          this.physics.arcade.enable(player);

          player.body.collideWorldBounds = true;
          player.body.setSize(20, 32, 5, 16);
        }

        return player;
      }
    }, {
      key: 'unmakePlayer',
      value: function unmakePlayer(player) {
        var tween = this.game.add.tween(player).to({ alpha: 0 }, 200, defaultEasing, true);

        tween.onComplete.addOnce(function () {
          return player.kill();
        });

        return tween;
      }
    }, {
      key: 'nextDialogue',
      value: function nextDialogue() {
        var next = dialogue[++this.dialogueIdx];

        if (next) {
          this.setText.apply(this, babelHelpers.toConsumableArray(next));
        }
      }
    }, {
      key: 'setText',
      value: function setText(content, style) {
        this.dialogueText.text = content;
        this.dialogueText.style = Object.assign({}, this.dialogueText.style, style);
      }
    }]);
    return MainGame;
  }();

  var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '');

  game.state.add('Game', MainGame, true);

}());