import loadResource from './load/index.js'
export default async () => {
  if (typeof window !== 'undefined' && window) {
    await loadResource('vconsole')
    // const VConsole = await import('vconsole')
    new window.VConsole() // eslint-disable-line

    const vConsoleSwitch = document.querySelector('.vc-switch')
    if (vConsoleSwitch) {
      vConsoleSwitch.innerText = '开发控制台'
      // vConsoleSwitch.draggable = true
      vConsoleSwitch.style.right = '20px'
      vConsoleSwitch.style.bottom = '20px'

      // drag div to move
      let offsetX = 0
      let offsetY = 0
      let isDrag = false
      vConsoleSwitch.addEventListener('mousedown', e => {
        offsetX = e.offsetX
        offsetY = e.offsetY
        isDrag = true
      })
      document.addEventListener('mousemove', e => {
        if (isDrag) {
          vConsoleSwitch.style.right = `${window.innerWidth - e.clientX - offsetX}px`
          vConsoleSwitch.style.bottom = `${window.innerHeight - e.clientY - offsetY}px`
        }
        vConsoleSwitch.style.cursor = isDrag ? 'move' : 'pointer'
      })
      document.addEventListener('mouseup', () => {
        isDrag = false
      })

      // add style to sheet
      const style = document.createElement('style')
      style.type = 'text/css'
      style.innerHTML = `.vc-switch {
                background: #5374fa;
                border-radius: 2px;
                box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, .5);
                cursor: pointer;
            }`
      document.head.appendChild(style)
    }
  }
}
