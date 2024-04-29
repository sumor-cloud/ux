import { useSSRContext } from 'vue'
import call from './call.js'

import time from './tools/time'
import table from './tools/table'
import qrcode from './tools/qrcode'
import copy from './tools/copy'
import upload from './upload'
import load from './tools/load'
import guessTimezone from './tools/time/timezone.js'

import checkLandscape from './attributes/checkLandscape.js'
import checkIphoneX from './attributes/checkIphoneX.js'
import checkSize from './attributes/checkSize.js'
import setPageInfo from './attributes/setPageInfo.js'

export default ({ SSR }) => {
  return {
    state: () => {
      const { width, height } = checkSize()

      let language; let isWechat = false
      if (typeof navigator !== 'undefined') {
        language = navigator.language || navigator.browserLanguage
        isWechat = /micromessenger/i.test(navigator.userAgent)
      }
      language = language || 'zh-CN'
      const timezone = guessTimezone() || 'Asia/Shanghai'

      return {
        table,
        qrcode,
        copy,
        upload,
        load,

        dark: false,
        isWechat,
        iphoneX: checkIphoneX(),
        landscape: checkLandscape(),
        width,
        height,
        language,
        timezone,
        pageInfo: {
          title: '',
          description: '',
          keywords: ''
        },
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
        }
      }
    },
    getters: {
      time (state) {
        return time(state)
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
      setDark (dark) {
        if (!SSR) {
          const name = 'dark'
          let classes = document.documentElement.className.split(' ')
          classes = classes.filter(item => item !== name)
          if (dark) {
            classes.push(name)
          }
          document.documentElement.className = classes.join(' ')
        }
        this.dark = dark
      },
      resize () {
        this.iphoneX = checkIphoneX()
        this.landscape = checkLandscape()
        const { width, height } = checkSize()
        this.width = width
        this.height = height
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
      async call (api, params) {
        if (SSR) {
          throw new Error('禁止在SSR模式下调用API，这将会引起性能等问题，请使用SSRContext模式载入数据')
        }
        const options = {}
        options.language = this.language
        options.timezone = this.timezone
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
      }
    }
  }
}
