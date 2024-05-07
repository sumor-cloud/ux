const data = {}
const trigger = []
const matchMedia = function (media) {
  data[media] = data[media] || {}
  const result = {}
  if (media === '(prefers-color-scheme: dark)') {
    result.matches = !!data[media].dark
    result.changeDark = function (dark) {
      data[media].dark = dark
    }
  }
  result.addEventListener = function (event, callback) {
    trigger.push({
      media,
      event,
      callback
    })
  }
  result.trigger = function (event) {
    for (let i = 0; i < trigger.length; i++) {
      if (trigger[i].media === media && trigger[i].event === event) {
        trigger[i].callback(matchMedia(media))
      }
    }
  }
  return result
}
export default matchMedia
