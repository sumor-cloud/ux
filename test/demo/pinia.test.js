import {
  describe, expect, it, beforeEach
} from '@jest/globals'
import { setActivePinia, createPinia } from 'pinia'
import { useCounter } from '../../src/demo/counter.js'

describe('Counter Store', () => {
  beforeEach(() => {
    // 创建一个新 pinia，并使其处于激活状态，这样它就会被任何 useStore() 调用自动接收
    // 而不需要手动传递：
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounter()
    expect(counter.n).toBe(0)
    counter.increment()
    expect(counter.n).toBe(1)
  })

  it('increments by amount', () => {
    const counter = useCounter()
    counter.increment(10)
    expect(counter.n).toBe(10)
  })

  it('doubles', () => {
    const counter = useCounter()
    counter.increment(3)
    expect(counter.double).toBe(6)
  })
})
