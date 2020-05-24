import Gamepad, { MAP } from './Gamepad.js'
import SoundBox from './SoundBox.js'

let $target
let $connected
let $disconnected
let $sounds
let gamepad
let soundbox
window.gamepad = gamepad
window.soundbox = soundbox
window.$sounds = $sounds

const onLoad = () => {
  $target = document.querySelector('.target')
  $connected = document.querySelector('.connected')
  $disconnected = document.querySelector('.disconnected')
  $sounds = [...$connected.querySelectorAll('audio')]

  window.addEventListener('gamepadconnected', onConnect)
}

const onConnect = (event) => {
  gamepad = new Gamepad(navigator.getGamepads()[0], $target).listen()
  soundbox = new SoundBox($sounds, $target).listen()
  console.log('CONNECTED', gamepad)

  window.removeEventListener('gamepadconnected', onConnect)
  window.addEventListener('gamepaddisconnected', onDisconnect)
  $connected.classList.remove('hidden')
  $disconnected.classList.add('hidden')
}

const onDisconnect = (event) => {
  gamepad.unlisten()
  soundbox.unlisten()
  window.removeEventListener('gamepaddisconnected', onDisconnect)
  window.addEventListener('gamepadconnected', onConnect)
  $connected.classList.add('hidden')
  $disconnected.classList.remove('hidden')
}

window.addEventListener('load', onLoad)

