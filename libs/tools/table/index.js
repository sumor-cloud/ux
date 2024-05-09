import loadResource from '../load/index.js'
export default {
  async import (file) {
    await loadResource('xlsx')
    const workbook = await new Promise((resolve) => {
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        const data = window.XLSX.read(reader.result, {
          type: 'array'
        })
        resolve(data)
      }
    })
    const sheetTab = workbook.Props.SheetNames[0]
    const worksheet = workbook.Sheets[sheetTab]
    return window.XLSX.utils.sheet_to_json(worksheet)
  },
  async export ({ name, type, data }) {
    await loadResource('xlsx')
    const worksheetName = 'default'
    const worksheet = window.XLSX.utils.aoa_to_sheet(data)
    const workbook = window.XLSX.utils.book_new()
    window.XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName)

    type = type || 'xlsx'
    name = name || 'export'
    const fileName = `${name}.${type}`

    return window.XLSX.writeFile(workbook, fileName)
  }
}
