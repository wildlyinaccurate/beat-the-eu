import Game from './game'
import { gameWidth, gameHeight } from './settings'

const game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '')

game.state.add('Game', Game, true)
