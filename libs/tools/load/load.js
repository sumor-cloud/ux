const status = {}
export default {
  css (url) {
    const headElements = document.head.children
    let exist = false
    for (const i in headElements) {
      if (headElements[i].tagName === 'LINK' && headElements[i].href === url) {
        exist = true
      }
    }
    if (!exist) {
      const head = document.getElementsByTagName('head')[0]
      const link = document.createElement('link')
      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.href = url
      head.appendChild(link)
    }
  },
  async js (url) {
    if (status[url]) {
      await new Promise((resolve) => {
        status[url].push(() => {
          resolve()
        })
      })
    } else {
      const headElements = document.head.children
      let exist = false
      for (const i in headElements) {
        if (headElements[i].tagName === 'SCRIPT' && headElements[i].src === url) {
          exist = true
        }
      }
      if (!exist) {
        status[url] = []
        await new Promise((resolve) => {
          const head = document.getElementsByTagName('head')[0]
          const script = document.createElement('script')
          script.src = url
          script.type = 'text/javascript'
          if (script.addEventListener) {
            script.addEventListener('load', function () {
              resolve()
            }, false)
          } else if (script.attachEvent) {
            script.attachEvent('onreadystatechange', function () {
              const target = window.event.srcElement
              if (target.readyState === 'loaded') {
                resolve()
              }
            })
          }
          head.appendChild(script)
        })

        for (let i = 0; i < status[url].length; i++) {
          status[url][i]()
        }
        delete status[url]
      }
    }
  }
}
