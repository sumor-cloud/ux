import checkLandscape from './checkLandscape'
export default () => {
  if (typeof window !== 'undefined' && window) {
    const landscape = checkLandscape()
    const longest = !landscape ? window.screen.height : window.screen.width
    const isIphone = /iphone/gi.test(window.navigator.userAgent)
    return isIphone && longest >= 812
  }
  return false
}
