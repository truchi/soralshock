import Gamepad from './Gamepad.js'
import SoundBox from './SoundBox.js'

let $connected
let $disconnected
let $sounds
let gamepad
let soundbox

const onLoad = () => {
  $connected = document.querySelector('.connected')
  $disconnected = document.querySelector('.disconnected')
  $sounds = [...$connected.querySelectorAll('audio')]

  window.addEventListener('gamepadconnected', onConnect)
}

const onConnect = (event) => {
  gamepad = new Gamepad(navigator.getGamepads()[0]).listen()
  soundbox = new SoundBox($sounds).listen()
  window.gamepad = gamepad
  window.soundbox = soundbox
  console.log('CONNECTED', gamepad, soundbox)

  window.removeEventListener('gamepadconnected', onConnect)
  window.addEventListener('gamepaddisconnected', onDisconnect)
  $connected.classList.remove('hidden')
  $disconnected.classList.add('hidden')
}

const onDisconnect = (event) => {
  console.log('DISCONNECTED')
  gamepad.unlisten()
  soundbox.unlisten()
  window.removeEventListener('gamepaddisconnected', onDisconnect)
  window.addEventListener('gamepadconnected', onConnect)
  $connected.classList.add('hidden')
  $disconnected.classList.remove('hidden')
}

window.addEventListener('load', onLoad)

