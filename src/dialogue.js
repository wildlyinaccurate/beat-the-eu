import { cpuTextColour, playerTextColour } from './settings'

const empty = ['', { fill: '#000' }]
const info = text => [`<${text}>`, { fill: '#fff', font: '18px monospace' }]
const cpu = text => [text, { fill: cpuTextColour, font: '20px Arial' }]
const player = text => [text, { fill: playerTextColour, font: '20px Arial' }]

export default [
  empty,


  info('Press the arrow keys to move'),
  info("You can only move in one direction. There's no going back now."),

  cpu('David, I am with you on this. But your welfare conditions need to be ironed out.'), // http://www.bbc.co.uk/news/uk-politics-eu-referendum-35499139
  player("Beata, let's be diplomatic. I am willing to negotiate."),
  info('Press [space] to negotiate'),
  player('Sorry, Beata. I am battling for Britain.'), // http://www.bbc.co.uk/news/uk-politics-eu-referendum-35599279


  empty
]
