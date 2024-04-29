import VConsole from 'vconsole'
export default async () => {
  if (typeof window !== 'undefined' && window) {
    // 如果url参数包含debug=true则打开vconsole
    if (window.location.href.indexOf('debug=true') > -1) {
      // const VConsole = await import('vconsole')
      new VConsole() // eslint-disable-line

      // 修改 id __vconsole 下 class vc-switch的文本为开发控制台
      const vConsoleSwitch = document.querySelector('#__vconsole .vc-switch')
      if (vConsoleSwitch) {
        vConsoleSwitch.innerText = '开发控制台'
      }
    }
  }
}
