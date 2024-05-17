export default async function (multiple) {
  return await new Promise(resolve => {
    const uploader = document.createElement('input')
    uploader.type = 'file'
    uploader.name = 'file'
    if (multiple) {
      uploader.multiple = 'multiple'
    }
    uploader.addEventListener('change', function (e) {
      if (multiple) {
        resolve(e.target.files)
      } else {
        resolve(e.target.files[0])
      }
    })
    uploader.value = ''
    uploader.click()
  })
}
