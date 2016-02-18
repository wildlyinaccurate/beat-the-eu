const GAME_WIDTH = 1000
const GAME_HEIGHT = 240

const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '')

const BeatTheEu = {
  jumpTimer: 0,

  makePlayer (xPos, yPos) {
    const player = this.add.sprite(xPos, yPos, 'dude')

    this.physics.arcade.enable(player)

    player.body.collideWorldBounds = true
    player.body.setSize(20, 32, 5, 16)
    player.animations.add('left', [0, 1, 2, 3], 10, true)
    player.animations.add('turn', [4], 20, true)
    player.animations.add('right', [5, 6, 7, 8], 10, true)

    return player
  },

  init () {
    this.game.renderer.renderSession.roundPixels = true
    this.physics.startSystem(Phaser.Physics.ARCADE)
    this.physics.arcade.gravity.y = 1300
  },

  preload () {
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48)
  },

  create () {
    this.player = this.makePlayer(0, GAME_HEIGHT / 1.5)
    this.enemy = this.makePlayer(GAME_WIDTH, 0)

    this.cursors = this.input.keyboard.createCursorKeys()
  },

  update () {
    const standing = this.player.body.blocked.down || this.player.body.touching.down

    this.player.body.velocity.x = 0

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -200

      if (this.facing !== 'left') {
        this.player.play('left')
        this.facing = 'left'
      }
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 200

      if (this.facing !== 'right') {
        this.player.play('right')
        this.facing = 'right'
      }
    } else {
      if (this.facing !== 'idle') {
        this.player.animations.stop()

        if (this.facing === 'left') {
          this.player.frame = 0
        } else {
          this.player.frame = 5
        }

        this.facing = 'idle'
      }
    }

    if (standing && this.cursors.up.isDown && this.time.time > this.jumpTimer) {
      this.player.body.velocity.y = -500
      this.jumpTimer = this.time.time + 750
    }
  }
}

game.state.add('Game', BeatTheEu, true)
