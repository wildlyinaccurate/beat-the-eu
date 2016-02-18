import { gameWidth, gameHeight } from './settings'
import dialogue from './dialogue'

export default class MainGame {
  constructor () {
    this.frozen = false
    this.beataStarted = false
    this.dialogueIdx = 0
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
    this.spaceBar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)

    const textStyle = {
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    this.dialogueText = this.game.add.text(0, 0, '', textStyle)
    this.dialogueText.setTextBounds(0, 0, gameWidth, 60)
    this.nextDialogue()

    this.spaceBar.onUp.add(() => {
      this.explodeShit()
    })

    this.cursors.right.onDown.addOnce(() => {
      this.nextDialogue()
    })
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
        this.player.frame = 4
        this.facing = 'idle'
      }
    }

    if (this.player.body.position.x > 240 && !this.beataStarted) {
      this.startBeataSzydloDialogue()
    }
  }

  startBeataSzydloDialogue () {
    this.beataStarted = true
    this.frozen = true

    this.beata = this.makePlayer(gameWidth * 1.1, 'beata', true)

    const beataWalk = x => {
      const tween = this.game.add.tween(this.beata).to({ x }, 1500, Phaser.Easing.Linear.None, true)

      tween.onStart.addOnce(() => {
        this.beata.play('left')
      })

      tween.onComplete.add(() =>{
        this.beata.frame = 5
        this.beata.animations.stop()
      })

      return tween
    }

    const beataEnter = beataWalk(this.player.x + 240)
    const daveBackUp = this.game.add.tween(this.player).to({ x: this.player.x - 50 }, 1500, Phaser.Easing.Linear.None, false)

    beataEnter.onComplete.addOnce(() => {
      this.nextDialogue()

      setTimeout(() => {
        this.player.play('right')
        daveBackUp.start()
      }, 1000)
    })

    daveBackUp.onComplete.addOnce(() => {
      this.nextDialogue()
      this.player.animations.stop()
      this.facing = 'right'

      beataWalk(this.beata.x - 40)

      setTimeout(() => {
        this.nextDialogue()
      }, 3000)
    })
  }

  explodeShit () {
    const explosion = this.game.add.sprite(this.beata.x - 32, this.beata.y - 32, 'kaboom')
    const boom = explosion.animations.add('kaboom')

    explosion.scale.set(2)
    explosion.play('kaboom', 30, false, true)

    boom.onComplete.addOnce(() => {
      const beataDie = this.game.add.tween(this.beata).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true)

      beataDie.onComplete.addOnce(() => {
        this.nextDialogue()
      })
    })
  }

  makePlayer (xPos, faceSprite, cpu = false) {
    const player = this.game.add.sprite(xPos, gameHeight - 48 * 2, 'dude')
    const face = this.game.make.sprite(-6, -30, faceSprite)

    player.scale.set(2)
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
    const next = dialogue[++this.dialogueIdx]

    if (next) {
      this.setText(...next)
    }
  }

  setText (content, style) {
    this.dialogueText.text = content
    this.dialogueText.style = Object.assign({}, this.dialogueText.style, style)
  }
}
