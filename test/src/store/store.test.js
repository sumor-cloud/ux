import {
  describe, expect, it, beforeEach
} from '@jest/globals'
import { setActivePinia, createPinia, defineStore } from 'pinia'

import { JSDOM } from 'jsdom'

import matchMedia from './matchMedia.js'
import storeDefinition from '../../../src/store/index.js'
import init from '../../../src/store/init.js'

const useStore = defineStore('store', storeDefinition())

describe('Sumor Store', () => {
  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>')
    global.window = dom.window
    window.matchMedia = matchMedia
    setActivePinia(createPinia())
  })

  it('resize', () => {
    const store = useStore()
    window.innerHeight = 600
    window.innerWidth = 800
    expect(store.screen.height).toBe(0)
    expect(store.screen.width).toBe(0)
    init(store)
    window.dispatchEvent(new window.Event('resize'))
    expect(store.screen.height).toBe(600)
    expect(store.screen.width).toBe(800)
  })
  it('load', () => {
    const store = useStore()
    window.innerHeight = 600
    window.innerWidth = 800
    expect(store.screen.height).toBe(0)
    expect(store.screen.width).toBe(0)
    init(store)
    window.dispatchEvent(new window.Event('load'))
    expect(store.screen.height).toBe(600)
    expect(store.screen.width).toBe(800)
  })
  it('popstate', () => {
    const store = useStore()
    window.innerHeight = 600
    window.innerWidth = 800
    expect(store.screen.height).toBe(0)
    expect(store.screen.width).toBe(0)
    init(store)
    window.dispatchEvent(new window.Event('popstate'))
    expect(store.screen.height).toBe(600)
    expect(store.screen.width).toBe(800)
  })
  it('dark mode', () => {
    const store = useStore()
    expect(store.screen.dark).toBe(false)
    init(store)
    matchMedia('(prefers-color-scheme: dark)').changeDark(true)
    matchMedia('(prefers-color-scheme: dark)').trigger('change')
    expect(store.screen.dark).toBe(true)
  })
})
