import { constants } from '@dihconstants/constantsBatch'
import { ErrorPage_DIH } from '@dihpages/errorPage'
import { JobStatusPage_DIH } from '@dihpages/jobStatusPage'
import * as base from '@playwright/test'

/**
 * DIH fixture file
 * @module DIH_Playwright_fixture fixture file to initiate POM instances
 */

let batchURL = constants.batchURL
/**
 * @typedef {object} JobStatusPageTestArgs - jobStatusPage test args
 * @property {JobStatusPage_DIH} jobStatusPage     - jobStatusPage
 */
/**
 * @typedef {object} ErrorPageTestArgs - errorPage test args
 * @property {ErrorPage_DIH} errorPage     - errorPage
 */
/** @type {base.Fixtures<JobStatusPageTestArgs & ErrorPageTestArgs, {}, base.PlaywrightTestArgs, base.PlaywrightWorkerArgs>} */

const extension = {
  jobStatusPage: async ({ page }, use) => {
    const jobStatusPage = new JobStatusPage_DIH(page)
    await jobStatusPage.openPage(batchURL)
    await use(jobStatusPage)
  },
  errorPage: async ({ page }, use) => {
    const errorPage = new ErrorPage_DIH(page)
    await use(errorPage)
  }
}
export const test = base.test.extend(extension)
export { expect } from '@playwright/test'
