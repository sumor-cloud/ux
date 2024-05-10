import resourcesMap from './resourcesMap.js'
import load from './load.js'

export default async (name, type, url) => {
  const resource = resourcesMap[name]
  if (!resource) {
    console.error(`Resource ${name} not found`)
    return
  }
  if (type) {
    if (type === 'js') {
      await load.js(`${resource.prefix}${url}`)
    } else if (type === 'css') {
      await load.css(`${resource.prefix}${url}`)
    }
  } else {
    if (resource.js) {
      await load.js(resource.js)
    }
    if (resource.css) {
      await load.css(resource.css)
    }
  }
}
