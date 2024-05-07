export default (store) => {
  // listen to window resize
  window.addEventListener('resize', () => {
    store.updateScreen()
  })
  // listen to window load
  window.addEventListener('load', () => {
    store.updateScreen()
  })
  // listen to window popstate
  window.addEventListener('popstate', () => {
    store.updateScreen()
  })

  // listen dark mode
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeMediaQuery.addEventListener('change', (event) => {
    store.updateScreen()
  })

  store.updateScreen()
  setTimeout(() => {
    store.updateScreen()
  }, 100)
}
