// @ts-check
import { defineConfig } from '@playwright/test'
import 'dotenv/config'
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // workers: 3,
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  // ignoreSnapshots: !process.env.CI,
  testDir: './tests',
  testMatch: ['*.spec.js'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : 3,
  reportSlowTests: null,
  ignoreSnapshots: process.env.CI ? true : false,
  globalSetup: './utils/global.setup.js',
  reporter: [
    ['list', { printSteps: true }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
        environmentInfo: {
          Environment: process.env.ENV,
          User: process.env.USER,
          NodeJS_version: process.version,
          OS: process.platform
        }
      }
    ],
    ['junit', { outputFile: `./report/playwright_${new Date().getTime()}.xml` }]
  ],
  use: {
    bypassCSP: true,
    screenshot: 'only-on-failure', // "on"
    video: 'on-first-retry', // "on"
    retries: 1,
    viewport: null,
    launchOptions: { args: ['--start-maximized'] },
    // viewport: { width: 1920, height: 1080 },
    baseURL: process.env.BASEURL,
    headless: true,
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Chrome Browser',
      testMatch: [/.*.spec.js/],
      use: {
        channel: 'chrome'
      }
    }
  ]
})
