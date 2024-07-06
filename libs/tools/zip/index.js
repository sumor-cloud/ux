import loadResource from '../load/index.js'

export default async () => {
  if (typeof window !== 'undefined' && window) {
    await loadResource('zip')

    return new window.JSZip()
  }
}
