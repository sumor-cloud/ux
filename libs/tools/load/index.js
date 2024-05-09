import resourcesMap from './resourcesMap.js'
import load from './load.js'

export default async (name) => {
  const resource = resourcesMap[name]
  if (!resource) {
    console.error(`Resource ${name} not found`)
    return
  }
  if (resource.js) {
    await load.js(resource.js)
  }
  if (resource.css) {
    await load.css(resource.css)
  }
}
