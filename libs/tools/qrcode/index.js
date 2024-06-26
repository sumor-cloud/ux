import loadResource from '../load/index.js'
export default async url => {
  if (typeof window !== 'undefined' && window) {
    await loadResource('qrcode')
    return await new Promise((resolve, reject) => {
      window.QRCode.toDataURL(url, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        resolve(data)
      })
    })
  }
}
