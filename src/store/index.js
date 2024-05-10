import { useSSRContext } from 'vue'
import init from './init.js'
import setPageInfo from './setPageInfo.js'
import call from './call.js'

export default (options) => {
  options = options || {}
  const SSR = options.SSR || false

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
        pageInfo: {
          title: '',
          description: '',
          keywords: ''
        },
        instance: {},
        meta: {
          name: null,
          api: {},
          text: {},
          instance: {}
        },
        token: {
          id: null,
          user: null,
          time: null,
          permission: {},
          data: {}
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
        } else if (typeof window !== 'undefined' && window) {
          return window.navigator.language
        } else {
          return 'en'
        }
      },
      timezone (state) {
        if (state.personalization.timezone !== null) {
          return state.personalization.timezone
        } else if (typeof window !== 'undefined' && window) {
          return window.Intl.DateTimeFormat().resolvedOptions().timeZone
        } else {
          return 'Asia/Shanghai'
        }
      }
    },
    actions: {
      getSSRData () {
        let data = null
        if (SSR) {
          const ctx = useSSRContext()
          data = ctx.data
          delete ctx.data
        }
        return data
      },
      setPageInfo ({ title, name, keywords, desc, description }) {
        this.pageInfo.title = title || name || ''
        this.pageInfo.description = desc || description || ''
        this.pageInfo.keywords = keywords || ''

        if (SSR) {
          const ctx = useSSRContext()
          ctx.pageInfo = {
            title: this.pageInfo.title,
            description: this.pageInfo.description,
            keywords: this.pageInfo.keywords
          }
        } else {
          setPageInfo(this.pageInfo)
        }
      },
      updateScreen () {
        if (typeof window !== 'undefined' && window) {
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
        }
      },
      updatePersonalization (key, value) {
        if (typeof window !== 'undefined' && window) {
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
        }

        // update key value
        if (key) {
          if (value === undefined) {
            value = null
          }
          this.personalization = Object.assign({}, this.personalization)
          this.personalization[key] = value
        }

        if (typeof window !== 'undefined' && window) {
          const latest = JSON.stringify(this.personalization)
          const last = window.localStorage.getItem('personalization')
          if (latest !== last) {
            // sync to global personalization
            window.sumorPersonalization = JSON.parse(JSON.stringify(this.personalization))
            // save to localStorage
            window.localStorage.setItem('personalization', JSON.stringify(this.personalization))
          }
        }
      },
      async call (api, params) {
        if (SSR) {
          throw new Error('Forbidden to call API in SSR mode, which will cause performance and other issues. Please use SSRContext mode to load data')
        }
        const options = {}
        const response = await call(api, params, options)
        if (!response.error) {
          let instance = response.headers['sumor-instance'] || ''
          instance = instance.split('_')
          this.instance = {
            version: instance[0],
            server: instance[1],
            port: instance[2],
            time: instance[3]
          }
          return response.data
        } else {
          return response
        }
      },
      async updateMeta (force) {
        if (!this.meta.name || force) {
          const res = await call('/sumor/meta')
          Object.assign(this.meta, res.data.data)
        }
      },
      async updateToken () {
        const res = await this.call('/sumor/token')
        Object.assign(this.token, res.data)
        // this.token.id = res.data.id || null;
        // this.token.user = res.data.user || null;
        // this.token.time = res.data.time || null;
        // this.token.permission = res.data.permission || {};
        // this.token.data = res.data.data || {};
      },
      async logout () {
        await this.call('/sumor/logout')
        await this.updateToken()
      },
      form (path) {
        const call = this.call
        class Form {
          constructor () {
            // 发送状态
            this.pending = false // 用于是否繁忙
            this.data = {}
          }

          async call (data) {
            data = Object.assign({}, this.data, data)
            this.pending = true

            const res = await call(path, data)
            this.pending = false
            if (!res.error) {
              return res.data
            } else {
              throw res
            }
          }
        }
        return new Form()
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
