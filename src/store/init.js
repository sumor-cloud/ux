import showConsole from '../../libs/tools/showConsole.js'
export default (store) => {
  if (typeof window !== 'undefined' && window) {
    // if url parameter contains debug=true then show console button
    if (window.location.href.indexOf('debug=true') > -1) {
      showConsole()
    }
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
}
