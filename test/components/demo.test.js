// port number prefix is 302

import {
  describe, expect, it, beforeAll, afterAll
} from '@jest/globals'

import puppeteer from 'puppeteer'

import coverage from '../utils/coverage.js'
import mockServer from '../utils/mockServer/index.js'
let server, url
const port = 30201

describe('Demo', () => {
  beforeAll(async () => {
    const result = await mockServer(port)
    server = result.server
    url = result.url
  })
  afterAll(async () => {
    await server.close()
  })
  it('connectivity', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    await page.waitForSelector('h1')

    const expectTitle = 'Sumor UX Demo'
    const title = await page.title()

    await browser.close()
    expect(title).toStrictEqual(expectTitle)
  }, 60 * 1000)
  it('check browser env', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    // set the viewport to iPhone X
    await page.setViewport({ width: 375, height: 812 })
    // set user agent to iPhone X
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1')

    await page.waitForSelector('h1')

    const expectTitle = 'Sumor UX Demo'
    const title = await page.title()

    await browser.close()
    expect(title).toStrictEqual(expectTitle)
  }, 60 * 1000)
  it('say hello', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const stopCoverage = await coverage(page)

    const result = await page.evaluate(() => {
      return window.sumor.hello('World')
    })

    await stopCoverage()
    await browser.close()
    expect(result).toStrictEqual('Hello World!')
  }, 60 * 1000)
  it('say goodbye', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const stopCoverage = await coverage(page)

    const result = await page.evaluate(() => {
      return window.sumor.goodbye('World')
    })

    await stopCoverage()
    await browser.close()
    expect(result).toStrictEqual('Goodbye World!')
  }, 60 * 1000)
})
