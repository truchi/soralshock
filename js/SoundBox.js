export const HIGH = 3000
export const LOW  = 200

export default class SoundBox {
  constructor($sounds) {
    this.$sounds = $sounds
    this.listeners = {}
    this.audios = {}
    this.looping = false
  }

  unlisten() {
    Object.values(this.audios).map(({ ctx }) => ctx.close())

    this.$sounds.map(($sound, i) => {
      const button = $sound.getAttribute('button')
      document.removeEventListener(`GamePad-${button}-pressed`, this.listeners[button])
    })

    this.unloop()

    return this
  }

  listen() {
    const createSound = $sound => {
      const button = $sound.getAttribute('button')
      const ctx = new AudioContext()
      const src = ctx.createMediaElementSource($sound)
      const lowpass = ctx.createBiquadFilter()
      const highpass = ctx.createBiquadFilter()
      this.audios[button] = { ctx, src, lowpass, highpass }

      lowpass.type = 'lowpass'
      highpass.type = 'highpass'
      lowpass.frequency.value = HIGH
      highpass.frequency.value = LOW

      src.connect(lowpass)
      lowpass.connect(highpass)
      highpass.connect(ctx.destination)

      this.listeners[button] = () => (this.stop(), $sound.play())
      document.addEventListener(`GamePad-${button}-pressed`, this.listeners[button])
    }

    this.listeners['l1-pressed'] = ({ detail: { gamepad } }) => this.toggleLoop()
    this.listeners['l3'] = ({ detail: { gamepad } }) => this.lowpass (.5 * gamepad.axes.l3 + .5)
    this.listeners['r3'] = ({ detail: { gamepad } }) => this.highpass(.5 * gamepad.axes.r3 + .5)

    ;['l1-pressed', 'l3', 'r3'].map(button => document.addEventListener(`GamePad-${button}`, this.listeners[button]) )
    this.$sounds.map(createSound)
    this.looping ? this.loop() : this.unloop()

    return this
  }

  highpass(amout) {
    Object.values(this.audios).map(({ highpass }) =>
      highpass.frequency.value = LOW + amout * (HIGH - LOW)
    )
  }

  lowpass(amout) {
    Object.values(this.audios).map(({ lowpass }) =>
      lowpass.frequency.value = HIGH - amout * (HIGH - LOW)
    )
  }

  loop() {
    this.looping = true
    this.$sounds.map(($sound, i) => {
      this.listeners[`loop-${i}`] = () => {
        $sound.currentTime = 0
        $sound.play()
      }

      $sound.addEventListener('ended', this.listeners[`loop-${i}`])
    })
  }

  unloop() {
    this.looping = false
    this.$sounds.map(($sound, i) => {
      $sound.removeEventListener('ended', this.listeners[`loop-${i}`])
    })
  }

  toggleLoop() {
    this.looping ? this.unloop() : this.loop()
  }

  stop() {
    this.$sounds.map($sound => ($sound.pause(), $sound.currentTime = 0))
  }
}
