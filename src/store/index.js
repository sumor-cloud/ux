export default () => {
  return {
    state: () => {
      return {
        screen: {
          height: 0,
          width: 0,
          dark: false
        }
      }
    },
    getters: {
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
      }
    }
  }
}
