import fs from 'fs'
import v8ToIstanbul from 'v8-to-istanbul'

let report = []
function _convertRange (range) {
  return {
    startOffset: range.start,
    endOffset: range.end,
    count: 1
  }
}
export default async (page) => {
  await page.coverage.startJSCoverage()
  await page.coverage.startCSSCoverage()
  return async () => {
    const jsCoverage = await page.coverage.stopJSCoverage()
    const cssCoverage = await page.coverage.stopCSSCoverage()
    report = report.concat(jsCoverage)
    report = report.concat(cssCoverage)
    const reportCombined = {}
    for (const entry of report) {
      const path = entry.url.split('github/ux/')[1]
      if (!reportCombined[path]) {
        reportCombined[path] = {
          text: entry.text,
          ranges: []
        }
      }
      reportCombined[path].ranges = reportCombined[path].ranges.concat(entry.ranges)
      reportCombined[path].functions = [{
        functionName: path,
        ranges: reportCombined[path].ranges.map(_convertRange)
        // isBlockCoverage: true
      }]
    }
    const result = {}
    for (const path in reportCombined) {
      const data = reportCombined[path]
      const converter = v8ToIstanbul(`file://${process.cwd()}/${path}`)
      await converter.load()
      converter.applyCoverage(data.functions)

      const istanbulCoverage = converter.toIstanbul()
      const keys = Object.keys(istanbulCoverage)

      result[keys[0]] = istanbulCoverage[keys[0]]
    }

    // ensure dir exists
    fs.mkdirSync('./output/coverageCache', { recursive: true })
    fs.writeFileSync('./output/coverage-puppeteer.json', JSON.stringify(reportCombined, null, 4))
    fs.writeFileSync('./output/coverageCache/coverage-final.json', JSON.stringify(result, null, 4))
  }
}

// npx nyc report --reporter=html --report-dir=output/coverage --temp-dir=output/coverageCache
