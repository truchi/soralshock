import Gamepad, { MAP } from './gamepad.js'

let $target
let $connected
let $disconnected
let gamepad
window.gamepad = gamepad

const onLoad = () => {
  $target = document.querySelector('.target')
  $connected = document.querySelector('.connected')
  $disconnected = document.querySelector('.disconnected')

  window.addEventListener('gamepadconnected', onConnect)
}

const onConnect = (event) => {
  gamepad = new Gamepad(navigator.getGamepads()[0], $target).listen()

  MAP.map(button => {
    $target.addEventListener(`GamePad-${button}-pressed`, (event) => {
      console.log(button, 'pressed', event)
    })

    $target.addEventListener(`GamePad-${button}-released`, (event) => {
      console.log(button, 'released', event)
    })
  })

  window.removeEventListener('gamepadconnected', onConnect)
  window.addEventListener('gamepaddisconnected', onDisconnect)
  $connected.classList.remove('hidden')
  $disconnected.classList.add('hidden')
}

const onDisconnect = (event) => {
  gamepad.unlisten()
  window.removeEventListener('gamepaddisconnected', onDisconnect)
  window.addEventListener('gamepadconnected', onConnect)
  $connected.classList.add('hidden')
  $disconnected.classList.remove('hidden')
}

window.addEventListener('load', onLoad)

