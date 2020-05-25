export const DEADZONE = .1
export const DELTA = .01

export const BUTTONS = ['x', 'o', 't', 's', 'l1', 'r1', 'l2', 'r2',,,,'l3', 'r3', 'u', 'd', 'l', 'r']
export const AXES = ['l3h', 'l3v', 'l3', 'r3h', 'r3v', 'r3']

export default class Gamepad {
  constructor(gamepad) {
    this.gamepad = gamepad
    this.buttons = {
      x: false, o: false, s: false, t: false,
      u: false, d: false, l: false, r: false,
      r1: false, r2: false, r3: false,
      l1: false, l2: false, l3: false,
    }
    this.axes = {
      l3h: 0, l3v: 0, l3: -1,
      r3h: 0, r3v: 0, r3: -1,
    }
  }

  unlisten() {
    window.cancelAnimationFrame(this.rafId)

    return this
  }

  listen() {
    this.check()
    this.rafId = window.requestAnimationFrame(this.listen.bind(this))

    return this
  }

  check() {
    const eBtns = this.gamepad.buttons
    const eAxes = this.gamepad.axes
    const cBtns = this.buttons
    const cAxes = this.axes

    BUTTONS.map((button, i) => {
      eBtns[i].pressed && !cBtns[button] && this.triggerButton(button)
      !eBtns[i].pressed && cBtns[button] && this.triggerButton(button, false)
    })

    AXES.map((axe, i) => {
      if (Math.abs(eAxes[i]) > DEADZONE)
        Math.abs(Math.abs(eAxes[i]) - Math.abs(cAxes[axe])) > DELTA
          && this.triggerAxe(axe, eAxes[i])
      else cAxes[axe] != 0 && this.triggerAxe(axe, 0)
    })

    return this
  }

  triggerButton(button, pressed = true) {
    this.buttons[button] = pressed
    document.dispatchEvent(
      new CustomEvent(
        `GamePad-${button}-${pressed ? 'pressed' : 'released'}`,
        { detail: { gamepad: this } }
      )
    )

    return this
  }

  triggerAxe(axe, value) {
    this.axes[axe] = value
    document.dispatchEvent(
      new CustomEvent(
        `GamePad-${axe}`,
        { detail: { gamepad: this } }
      )
    )

    return this
  }
}
