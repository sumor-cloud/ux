// port number prefix is 302

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'

import puppeteer from 'puppeteer'

import mockServer from '../utils/mockServer/index.js'

let server, url
const port = 30202

describe('Tools', () => {
  beforeAll(async () => {
    const result = await mockServer(port)
    server = result.server
    url = result.url
  })
  afterAll(async () => {
    await server.close()
  })
  it('Load JS Resource', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const result = await page.evaluate(async () => {
      await window.sumor.load('qrcode')
      return !!window.QRCode
    })
    await browser.close()
    expect(result).toStrictEqual(true)
  }, 60 * 1000)
  it('QRCode', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const result = await page.evaluate(async () => {
      return await window.sumor.qrcode('https://www.sumor.com')
    })
    await browser.close()
    expect(result.indexOf('data:image/png;base64')).toStrictEqual(0)
  }, 60 * 1000)
})
