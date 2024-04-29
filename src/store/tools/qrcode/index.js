import load from '../load'
const resourceUrl = 'https://library.sumor.com/qrcode/qrcode.min.js'

export default async (url) => {
  await load.js(resourceUrl)
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
