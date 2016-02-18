import { gameWidth, gameHeight, cpuTextColour, playerTextColour } from './settings'

export default class MainGame {
  constructor () {
    this.frozen = false
    this.beataStarted = false
  }

  init () {
    this.game.renderer.renderSession.roundPixels = true
    this.physics.startSystem(Phaser.Physics.ARCADE)
  }

  preload () {
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48)
    this.load.image('dave', 'assets/dave.png')
    this.load.image('beata', 'assets/beata.png')
    this.game.load.image('bullet', 'assets/bullet.png');
    this.game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
  }

  create () {
    this.player = this.makePlayer(20, 'dave')
    this.cursors = this.input.keyboard.createCursorKeys()

    const textStyle = {
      font: '18px Arial',
      fill: '#000',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    this.dialogueText = this.game.add.text(0, 0, '', textStyle)
    this.dialogueText.setTextBounds(0, 0, gameWidth, 60)
  }

  update () {
    this.player.body.velocity.x = 0

    if (this.cursors.right.isDown && !this.frozen) {
      this.player.body.velocity.x = 200

      if (this.facing !== 'right') {
        this.player.play('right')
        this.facing = 'right'
      }
    } else {
      if (this.facing !== 'idle') {
        this.player.animations.stop()
        this.player.frame = 5
        this.facing = 'idle'
      }
    }

    if (this.player.body.position.x > 200 && !this.beataStarted) {
      this.startBeataSzydloDialogue()
    }
  }

  startBeataSzydloDialogue () {
    this.beataStarted = true
    this.frozen = true

    const beata = this.makePlayer(gameWidth * 1.1, 'beata', true)

    beata.play('left')

    const beataWalk = this.game.add.tween(beata).to({ x: 380 }, 1300, Phaser.Easing.Linear.None, true)

    beataWalk.onComplete.add(() => {
      this.setText('David, I am with you on this. but your welfare conditions need to be ironed out.', cpuTextColour)
      beata.animations.stop()
    }, this)
  }

  makePlayer (xPos, faceSprite, cpu = false) {
    const player = this.game.add.sprite(xPos, gameHeight - 48 * 2, 'dude')
    const face = this.game.make.sprite(-6, -30, faceSprite)

    player.scale = { x: 2, y: 2 }
    player.addChild(face)
    player.animations.add('left', [0, 1, 2, 3], 10, true)
    player.animations.add('turn', [4], 20, true)
    player.animations.add('right', [5, 6, 7, 8], 10, true)

    if (!cpu) {
      this.physics.arcade.enable(player)

      player.body.collideWorldBounds = true
      player.body.setSize(20, 32, 5, 16)
    }

    return player
  }

  nextDialogue () {

  }

  setText (content, colour) {
    this.dialogueText.text = content
    this.dialogueText.style.fill = colour
  }
}
