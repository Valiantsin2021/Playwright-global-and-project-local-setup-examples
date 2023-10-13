import { constants } from 'route'
import * as base from '@playwright/test'

/**
 * fixture file
 * @module Playwright_fixture fixture file to initiate POM instances
 */

let batchURL = constants.batchURL
/**
 * @typedef {object} HomePageTestArgs - homePage test args
 * @property {HomePage} homePage     - homePage
 */
/**
 * @typedef {object} LoginPageTestArgs - loginPage test args
 * @property {LoginPage} loginPage     - loginPage
 */
/** @type {base.Fixtures<HomePageTestArgs & LoginPageTestArgs, {}, base.PlaywrightTestArgs, base.PlaywrightWorkerArgs>} */

const extension = {
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await homePage.openPage(url)
    await use(homePage)
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  }
}
export const test = base.test.extend(extension)
export { expect } from '@playwright/test'
