import init from './init.js'
export default () => {
  return {
    state: () => {
      return {
        screen: {
          height: 0,
          width: 0,
          dark: false
        },
        personalization: {
          dark: null,
          language: null
        },
        _listened: false
      }
    },
    getters: {
      dark (state) {
        if (state.personalization.dark !== null) {
          return state.personalization.dark
        } else {
          return state.screen.dark
        }
      }
    },
    actions: {
      updateScreen () {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const screen = {
          height: window.innerHeight,
          width: window.innerWidth,
          dark
        }
        this.screen = Object.assign({}, this.screen, screen)
      },
      updatePersonalization (key, value) {
        if (value === undefined) {
          value = null
        }
        this.personalization = Object.assign({}, this.personalization)
        this.personalization[key] = value
      },
      listen () {
        if (!this._listened) {
          this._listened = true
          init(this)
        }
      }
    }
  }
}
