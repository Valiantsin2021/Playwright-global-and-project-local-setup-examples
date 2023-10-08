import { chromium, expect } from '@playwright/test'
import 'dotenv/config'
import fs from 'fs'
const authFile = './utils/storage.json'
async function setup() {
  if (!process.env.USER || process.env.USER === '') {
    throw new Error('Env file is not correct or absent')
  }
  const stats = fs.existsSync(authFile.toString()) ? fs.statSync(authFile.toString()) : null
  if (stats && stats.mtimeMs > new Date().getTime() - 100_000_000) {
    console.log(`\x1b[2m\t***** Sign in skipped because storage state is fresh *****\x1b[0m`)
    return
  } else {
    console.log(`\x1b[2m\t*****Saving storage state *****\x1b[0m`)
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    console.log('in global setup')
    try {
      await context.tracing.start({ screenshots: true, snapshots: true })
      await page.goto(process.env.BASEURL)
      await page.getByRole('button', { name: 'Login' }).click()
      await page.getByLabel('Username').fill(process.env.USER)
      await page.getByLabel('Password').fill(process.env.PASS)
      await page.getByRole('button', { name: 'Login' }).nth(1).click()
      await expect(page.getByText(process.env.USER)).toBeVisible()
      await page.context().storageState({ path: './utils/storage.json' })
      await context.tracing.stop({
        path: './test-results/setup-trace.zip'
      })
      await browser.close()
    } catch (error) {
      await context.tracing.stop({
        path: './test-results/failed-setup-trace.zip'
      })
      await browser.close()
      throw error
    }
  }
}
export default setup
