import load from './tools/load/index.js'
import qrcode from './tools/qrcode/index.js'
import table from './tools/table/index.js'
import copy from './tools/copy/index.js'
import time from './tools/time/index.js'
import upload from './tools/upload.js'
import personalization from './personalization/index.js'
import showConsole from './tools/showConsole.js'
import zip from './tools/zip/index.js'

// if url parameter contains debug=true then show console button
if (typeof window !== 'undefined' && window) {
  // if url parameter contains debug=true then show console button
  if (window.location.href.indexOf('debug=true') > -1) {
    showConsole()
  }
}

export { load, qrcode, table, copy, time, upload, personalization }
export default {
  load,
  qrcode,
  table,
  copy,
  time,
  upload,
  personalization,
  zip
}
