import init from './init.js'

export default () => {
  return {
    state: () => {
      return {
        screen: {
          height: 0,
          width: 0,
          dark: false,
          landscape: false,
          isIPhone: false,
          isIPhoneX: false,
          isWechat: false
        },
        personalization: {
          dark: null,
          language: null,
          timezone: null
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
      },
      language (state) {
        if (state.personalization.language !== null) {
          return state.personalization.language
        } else {
          return window.navigator.language
        }
      },
      timezone (state) {
        if (state.personalization.timezone !== null) {
          return state.personalization.timezone
        } else {
          return window.Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      }
    },
    actions: {
      updateScreen () {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const screen = {
          height: window.innerHeight,
          width: window.innerWidth,
          dark,
          landscape: window.innerHeight <= window.innerWidth
        }

        const longest = !screen.landscape ? screen.height : screen.width
        screen.isIPhone = /iphone/gi.test(window.navigator.userAgent)
        screen.isIPhoneX = screen.isIPhone && longest >= 812
        screen.isWechat = /micromessenger/gi.test(window.navigator.userAgent)

        this.screen = Object.assign({}, this.screen, screen)
      },
      updatePersonalization (key, value) {
        // load from localStorage
        const personalization = window.localStorage.getItem('personalization')
        if (personalization !== JSON.stringify(this.personalization)) {
          this.personalization = JSON.parse(personalization) || {}
          const personalizationOptions = ['dark', 'language', 'timezone']
          personalizationOptions.forEach(key => {
            if (this.personalization[key] === undefined) {
              this.personalization[key] = null
            }
          })
          window.sumorPersonalization = JSON.parse(personalization)
        }

        // update key value
        if (key) {
          if (value === undefined) {
            value = null
          }
          this.personalization = Object.assign({}, this.personalization)
          this.personalization[key] = value
        }

        const latest = JSON.stringify(this.personalization)
        const last = window.localStorage.getItem('personalization')
        if (latest !== last) {
          // sync to global personalization
          window.sumorPersonalization = JSON.parse(JSON.stringify(this.personalization))
          // save to localStorage
          window.localStorage.setItem('personalization', JSON.stringify(this.personalization))
        }
      },
      listen () {
        if (!this._listened) {
          this._listened = true
          init(this)
          this._listenTimer = setInterval(() => {
            this.updatePersonalization()
          }, 100)
        }
      },
      stop () {
        this._listened = false
        clearInterval(this._listenTimer)
      }
    }
  }
}
