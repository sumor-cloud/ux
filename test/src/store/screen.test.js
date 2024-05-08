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
    const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>')
    global.window = dom.window
    global.document = dom.window.document
    window.matchMedia = matchMedia
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
  })
  it('dark mode', () => {
    const store = useStore()
    expect(store.screen.dark).toBe(false)
    store.listen()
    matchMedia('(prefers-color-scheme: dark)').changeDark(true)
    matchMedia('(prefers-color-scheme: dark)').trigger('change')
    expect(store.screen.dark).toBe(true)
  })
  it('personalization', () => {
    const store = useStore()
    expect(store.personalization.dark).toBe(null)
    store.listen()
    matchMedia('(prefers-color-scheme: dark)').changeDark(true)
    matchMedia('(prefers-color-scheme: dark)').trigger('change')
    store.updatePersonalization('dark', true)
    expect(store.personalization.dark).toBe(true)
    expect(store.dark).toBe(true)
    store.updatePersonalization('dark', false)
    expect(store.personalization.dark).toBe(false)
    expect(store.dark).toBe(false)
    store.updatePersonalization('dark')
    expect(store.personalization.dark).toBe(null)
    expect(store.dark).toBe(true)
  })
})
