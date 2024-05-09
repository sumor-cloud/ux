import {
  describe, expect, it, beforeEach
} from '@jest/globals'
import { setActivePinia, createPinia, defineStore } from 'pinia'

import { JSDOM } from 'jsdom'

import matchMedia from './matchMedia.js'
import storeDefinition from '../../../src/store/index.js'

const useStore = defineStore('store', storeDefinition())

describe('Sumor Store', () => {
  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>', { url: 'https://example.org/' })
    global.window = dom.window
    global.document = dom.window.document
    window.matchMedia = matchMedia
    const storage = {}
    Object.defineProperty(dom.window, 'localStorage', {
      getItem: (key) => storage[key],
      setItem: (key, value) => {
        storage[key] = value
      }
    })
    setActivePinia(createPinia())
  })

  it('resize', () => {
    const store = useStore()
    window.innerHeight = 600
    window.innerWidth = 800
    expect(store.screen.height).toBe(0)
    expect(store.screen.width).toBe(0)
    store.listen()
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.height).toBe(600)
    expect(store.screen.width).toBe(800)
    store.stop()
  })
  it('load', () => {
    const store = useStore()
    window.innerHeight = 600
    window.innerWidth = 800
    expect(store.screen.height).toBe(0)
    expect(store.screen.width).toBe(0)
    store.listen()
    window.dispatchEvent(new window.Event('load'))
    expect(store.screen.height).toBe(600)
    expect(store.screen.width).toBe(800)
    store.stop()
  })
  it('popstate', () => {
    const store = useStore()
    window.innerHeight = 600
    window.innerWidth = 800
    expect(store.screen.height).toBe(0)
    expect(store.screen.width).toBe(0)
    store.listen()
    window.dispatchEvent(new window.Event('popstate'))
    expect(store.screen.height).toBe(600)
    expect(store.screen.width).toBe(800)
    store.stop()
  })
  it('delay update for init', async () => {
    const store = useStore()
    window.innerHeight = 0
    window.innerWidth = 0
    store.listen()
    store.listen() // just test listen twice
    window.innerHeight = 600
    window.innerWidth = 800
    expect(store.screen.height).toBe(0)
    expect(store.screen.width).toBe(0)
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 200)
    })
    expect(store.screen.height).toBe(600)
    expect(store.screen.width).toBe(800)
    store.stop()
  })
  it('dark mode', () => {
    const store = useStore()
    expect(store.screen.dark).toBe(false)
    store.listen()
    matchMedia('(prefers-color-scheme: dark)').changeDark(true)
    matchMedia('(prefers-color-scheme: dark)').trigger('change')
    expect(store.screen.dark).toBe(true)
    store.stop()
  })
  it('landscape', () => {
    const store = useStore()
    store.listen()
    window.innerHeight = 600
    window.innerWidth = 800
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.landscape).toBe(true)
    window.innerHeight = 800
    window.innerWidth = 600
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.landscape).toBe(false)
    store.stop()
  })
  it('is not iphoneX', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Chrome',
      configurable: true
    })
    const store = useStore()
    store.listen()
    window.innerHeight = 812
    window.innerWidth = 375
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.isIPhone).toBe(false)
    expect(store.screen.isIPhoneX).toBe(false)
    window.innerHeight = 375
    window.innerWidth = 812
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.isIPhone).toBe(false)
    expect(store.screen.isIPhoneX).toBe(false)
    store.stop()
  })
  it('is iphoneX', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true
    })
    const store = useStore()
    store.listen()
    window.innerHeight = 700
    window.innerWidth = 375
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.isIPhone).toBe(true)
    expect(store.screen.isIPhoneX).toBe(false)
    window.innerHeight = 812
    window.innerWidth = 375
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.isIPhone).toBe(true)
    expect(store.screen.isIPhoneX).toBe(true)
    window.innerHeight = 375
    window.innerWidth = 812
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.isIPhone).toBe(true)
    expect(store.screen.isIPhoneX).toBe(true)
    store.stop()
  })
  it('is wechat', () => {
    const store = useStore()
    store.listen()
    expect(store.screen.isWechat).toBe(false)
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'MicroMessenger',
      configurable: true
    })
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.isWechat).toBe(true)
    store.stop()
  })
  it('personalization', async () => {
    const store = useStore()
    expect(store.personalization.dark).toBe(null)
    store.listen()

    // test dark mode auto detect
    matchMedia('(prefers-color-scheme: dark)').changeDark(true)
    matchMedia('(prefers-color-scheme: dark)').trigger('change')
    expect(store.dark).toBe(true)

    // test set dark to false
    store.updatePersonalization('dark', false)
    expect(store.personalization.dark).toBe(false)
    expect(store.dark).toBe(false)

    // test set dark to true
    store.updatePersonalization('dark', true)
    expect(store.personalization.dark).toBe(true)
    expect(store.dark).toBe(true)

    // test revert to default value
    store.updatePersonalization('dark')
    store.updatePersonalization('dark') // just test no value change
    expect(store.personalization.dark).toBe(null)
    expect(store.dark).toBe(true)

    // test reload from localStorage
    window.localStorage.setItem('personalization', JSON.stringify({ dark: false }))
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 200)
    })
    expect(store.personalization.dark).toBe(false)
    store.stop()
  }, 10 * 1000)
})