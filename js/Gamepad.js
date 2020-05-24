export const MAP = ['x', 'o', 't', 's', 'l1', 'r1', 'l2', 'r2',,,,'l3', 'r3', 'u', 'd', 'l', 'r']

export default class Gamepad {
  constructor(gamepad, $target) {
    this.gamepad = gamepad
    this.$target = $target
    this.buttons = {
      x: false, o: false, s: false, t: false,
      u: false, d: false, l: false, r: false,
      r1: false, r2: false, r3: false,
      l1: false, l2: false, l3: false,
    }
  }

  unlisten() {
    window.cancelAnimationFrame(this.rafId)
    return this
  }

  listen() {
    this.rafId = window.requestAnimationFrame(this.listen.bind(this))
    this.check()
    return this
  }

  check() {
    const eBtns = this.gamepad.buttons
    const cBtns = this.buttons

    MAP.map((button, i) => {
      eBtns[i].pressed && !cBtns[button] && this.trigger(button)
      !eBtns[i].pressed && cBtns[button] && this.trigger(button, false)
    })
  }

  trigger(button, pressed = true) {
    this.buttons[button] = pressed
    this.$target.dispatchEvent(
      new Event(`GamePad-${button}-${pressed ? 'pressed' : 'released'}`),
      { gamepad: this }
    )
  }
}
