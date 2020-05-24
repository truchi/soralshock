export default class SoundBox {
  constructor($sounds, $target) {
    this.$sounds = $sounds
    this.$target = $target
  }

  unlisten() {
    this.$sounds.map($sound => {
      const button = $sound.getAttribute('button')
      this.$target.removeEventListener(`GamePad-${button}-pressed`)
    })
  }

  listen() {
    this.$sounds.map($sound => {
      const button = $sound.getAttribute('button')
      this.$target.addEventListener(`GamePad-${button}-pressed`, () => {
        this.stopAll()
        $sound.play()
      })
    })
  }

  stopAll() {
    this.$sounds.map($sound => ($sound.pause(), $sound.currentTime = 0))
  }
}
