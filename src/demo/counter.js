import { defineStore } from 'pinia'

const useCounter = defineStore('counter', {
  state: () => ({ n: 0 }),
  getters: {
    double: state => state.n * 2
  },
  actions: {
    increment(amount = 1) {
      this.n += amount
    }
  }
})

export { useCounter }
