import { test, expect } from '@playwright/test'
import { user } from '@utils/data-factory'
import fs from 'fs'
test.describe(`Bookstore web application "Elements" >> `, async () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://securepubads.g.doubleclick.net/**', route => route.abort())
    await page.goto('/')
    await page.getByText('Elements').click()
  })
  test.use({ storageState: { cookies: [], origins: [] } })
  test(`"Text Box"`, async ({ page }) => {
    await expect.soft(page.getByText('Please select an item from left to start practice.')).toBeVisible()
    await page.getByText('Text Box').click()
    await page.locator('#userName').fill(user.firstName)
    await page.locator('#userEmail').fill(user.email)
    await page.locator('#currentAddress').fill(`${user.street}, ${user.city}, ${user.state}`)
    await page.locator('#permanentAddress').fill(`${user.street}, ${user.city}, ${user.state}`)
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect
      .soft(page.locator('#output'))
      .toContainText(
        `Name:${user.firstName}Email:${user.email}Current Address :${user.street}, ${user.city}, ${user.state} Permananet Address :${user.street}, ${user.city}, ${user.state}`
      )
  })
  test(`"Check Box"`, async ({ page }) => {
    await page.getByText('Check Box').click()
    await page.locator('#tree-node').getByRole('img').nth(3).check()
    await page.getByLabel('Toggle').click()
    await expect
      .soft(page.locator('#result'))
      .toHaveText(
        'You have selected :homedesktopnotescommandsdocumentsworkspacereactangularveuofficepublicprivateclassifiedgeneraldownloadswordFileexcelFile'
      )
    const resultsElements = page.locator('#result span')
    await expect.soft(resultsElements).toHaveCount(18)
    await expect
      .soft(resultsElements)
      .toContainText([
        'You have selected :',
        'home',
        'desktop',
        'notes',
        'commands',
        'documents',
        'workspace',
        'react',
        'angular',
        'veu',
        'office',
        'public',
        'private',
        'classified',
        'general',
        'downloads',
        'wordFile',
        'excelFile'
      ])
    await Promise.all([
      page.getByText('Desktop', { exact: true }).isChecked(),
      page.getByText('Documents', { exact: true }).isChecked(),
      page.getByText('Downloads', { exact: true }).isChecked()
    ])
    await page.locator('label').filter({ hasText: 'Desktop' }).locator('path').first().uncheck()
    await expect.soft(resultsElements).toHaveCount(14)
    await expect
      .soft(resultsElements)
      .toContainText([
        'You have selected :',
        'documents',
        'workspace',
        'react',
        'angular',
        'veu',
        'office',
        'public',
        'private',
        'classified',
        'general',
        'downloads',
        'wordFile',
        'excelFile'
      ])
  })
  test(`"Radio Button"`, async ({ page }) => {
    await page.getByText('Radio Button').click()
    await expect.soft(page.getByText('Do you like the site?')).toBeVisible()
    await expect.soft(page.locator('.custom-control-label')).toHaveText(['Yes', 'Impressive', 'No'])
    await expect.soft(page.locator('#noRadio')).toBeDisabled()
    await expect.soft(page.locator('#yesRadio')).toBeEnabled()
    await page.locator('#yesRadio').click({ force: true })
    await expect.soft(page.getByText('You have selected Yes')).toBeInViewport()
    await expect.soft(page.locator('.text-success')).toHaveCSS('color', 'rgb(40, 167, 69)')
  })
  test(`"Web Tables"`, async ({ page }) => {
    await page.getByText('Web Tables').click()
    await expect.soft(page.locator('[role="rowgroup"]')).toHaveCount(10)
    await page.locator('div[role="rowgroup"]').filter({ hasText: 'Cierra' }).locator('[title="Delete"]').click()
    await expect.soft(page.getByText('Cierra')).toBeHidden()
    await page.locator('div[role="rowgroup"]').filter({ hasText: 'Alden' }).locator('[title="Edit"]').click()
    await page.locator('#firstName').fill(user.firstName)
    await page.locator('#lastName').fill(user.lastName)
    await page.locator('#age').fill('' + user.age)
    await page.getByPlaceholder('name@example.com').fill(user.email)
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect.soft(page.getByText('Alden', { exact: true })).toBeHidden()
    await expect.soft(page.getByText(user.firstName)).toBeVisible()
    await expect
      .soft(page.locator('div[role="rowgroup"]').filter({ hasText: user.firstName }).getByText(user.lastName))
      .toBeVisible()
    await expect
      .soft(page.locator('div[role="rowgroup"]').filter({ hasText: user.firstName }).getByText(user.email))
      .toBeVisible()
    await page.reload()
    await expect.soft(page.getByText('Alden', { exact: true })).toBeVisible()
    await expect.soft(page.getByText(user.firstName)).toBeHidden()
  })
  test(`"Buttons"`, async ({ page }) => {
    await page.getByText('Buttons').click()
    await page.getByText('Double Click Me', { exact: true }).dblclick()
    await expect.soft(page.getByText('You have done a double click')).toBeVisible()
    await page.getByText('Right Click Me', { exact: true }).click({ button: 'right' })
    await expect.soft(page.getByText('You have done a right click')).toBeVisible()
    await page.getByText('Click Me', { exact: true }).click()
    await expect.soft(page.getByText('You have done a dynamic click')).toBeVisible()
    expect.soft(await page.context().cookies()).toHaveLength(6)
    console.log(await page.context().cookies())
    await page.context().clearCookies()
    expect.soft(await page.context().cookies()).toHaveLength(0)
  })
  test(`"Links"`, async ({ page }) => {
    await page.getByText('Links', { exact: true }).click()
    const links = await page.locator('#linkWrapper a').all()
    const responses = {
      endpoint: ['created', 'no-content', 'moved', 'bad-request', 'unauthorized', 'forbidden', 'not-found'],
      messages: ['Created', 'No Content', 'Moved Permanently', 'Bad Request', 'Unauthorized', 'Forbidden', 'Not Found'],
      codes: [201, 204, 301, 400, 401, 403, 404]
    }
    for (let i = 2; i < links.length; i++) {
      await page.route(`/${responses.endpoint[i]}`, async route => {
        const response = await route.fetch()
        expect.soft(response.status()).toBe(responses.codes[i])
        expect.soft(response.statusText()).toBe(responses.messages[i])
        await route.continue()
      })
      await links[i].click()
    }

    const popupPromise = page.waitForEvent('popup')
    const homeLinks = await page.getByText('Home').all()
    for await (let link of homeLinks) {
      await link.click()
      const popup = await popupPromise
      // Wait for the popup to load.
      await popup.waitForLoadState()
      expect.soft(await popup.title()).toBe('DEMOQA')
    }
  })
  test('Dynamic Properties', async ({ page }) => {
    await page.getByText('Dynamic Properties', { exact: true }).click()
    await expect.soft(page.locator('#enableAfter')).toBeDisabled()
    await expect.soft(page.locator('#visibleAfter')).toBeHidden()
    await expect.soft(page.locator('#colorChange')).toHaveCSS('color', 'rgb(255, 255, 255)')
    await expect.soft(page.locator('#enableAfter')).toBeEnabled()
    await expect.soft(page.locator('#colorChange')).toHaveCSS('color', 'rgb(220, 53, 69)')
    await expect.soft(page.locator('#visibleAfter')).toBeVisible()
  })
  test('Broken Links - Images', async ({ page, request }) => {
    await page.getByText('Broken Links - Images', { exact: true }).click()
    const imgs = page
      .locator('div')
      .filter({ has: page.getByText('Valid image') })
      .locator('img')
    const srcs = [await imgs.nth(1).getAttribute('src'), await imgs.nth(2).getAttribute('src')]
    let response = await request.get(`https://demoqa.com/images/${srcs[0]}`)
    expect(response.status()).toBe(200)
    response = await request.get(`https://demoqa.com/images/${srcs[1]}`)
    expect(response.status()).toBe(200)
    const links = page
      .locator('div')
      .filter({ has: page.getByText('Valid link') })
      .locator('a')
    const hrefs = [await links.nth(0).getAttribute('href'), await links.nth(2).getAttribute('href')]
    response = await request.get(`https://demoqa.com/images/${hrefs[0]}`)
    expect(response.status()).toBe(200)
    response = await request.get(`https://demoqa.com/images/${hrefs[1]}`)
    expect(response.status()).toBe(200)
    await page.goto(hrefs[1])
    await expect(page.getByText('This page returned a 500 status code.')).toBeVisible()
  })
  test('Upload and Download', async ({ page }) => {
    await page.getByText('Upload and Download', { exact: true }).click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('link', { name: 'Download' }).click({ force: true })
    const download = await downloadPromise
    await download.saveAs(`./data/${download.suggestedFilename()}`)
    fs.stat('./data/' + download.suggestedFilename(), error => {
      error ? console.log('file not found') : console.log('file downloaded successfully')
    })
    expect(download.suggestedFilename()).toBe('sampleFile.jpeg')
    expect((await fs.promises.stat('./data/' + download.suggestedFilename())).size).toBeGreaterThan(4_000)
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.locator('#uploadFile').click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(`./data/${download.suggestedFilename()}`)
    await expect(page.getByText(download.suggestedFilename())).toBeVisible()
  })
})
test.describe(`Bookstore web application "Forms" >> `, async () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://securepubads.g.doubleclick.net/**', route => route.abort())
    await page.goto('/')
    await page.getByText('Forms').click()
  })
  test.use({ storageState: { cookies: [], origins: [] } })
  test(`Practice Form`, async ({ page }) => {
    await page.getByText('Practice Form', { exact: true }).click()
    await expect(page.getByText('Student Registration Form')).toBeVisible()
    await page.getByPlaceholder('First Name').fill(user.firstName)
    await page.getByPlaceholder('Last Name').fill(user.lastName)
    await page.getByPlaceholder('name@example.com').fill(user.email)
    await page.locator('#gender-radio-1').check({ force: true })
    await page.getByPlaceholder('Mobile Number').fill('' + user.phoneNumber)
    await page.locator('#dateOfBirthInput').fill(user.dateOfBirth, { force: true })
    await page.locator('#subjectsInput').fill('E', { force: true })
    await page.getByText('English', { exact: true }).click()
    await page.locator('#subjectsInput').pressSequentially('Comp')
    await page.getByText('Computer Science', { exact: true }).click()

    await page.locator('#hobbies-checkbox-1').check({ force: true })
    await page.locator('#hobbies-checkbox-2').check({ force: true })
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.locator('#uploadPicture').click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(`./data/sampleFile.jpeg`)
    await page
      .getByPlaceholder('Current Address')
      .fill(`${user.street}, ${user.city}, ${user.country}, ${user.postalCode}`)
    await page.getByText('Select State').click()
    await page.getByText('Haryana', { exact: true }).click({ force: true })
    await page.getByText('Select City').click()
    await page.getByText('Karnal', { exact: true }).click({ force: true })
    await page.getByRole('button', { name: 'Submit' }).click({ force: true })
    const successForm = await page.locator('tbody tr td:nth-child(2)').allTextContents()
    successForm.splice(4, 1)
    expect(successForm).toStrictEqual([
      `${user.firstName} ${user.lastName}`,
      user.email,
      'Male',
      '' + user.phoneNumber,
      // /.*/,
      'English, Computer Science',
      'Sports, Reading',
      'sampleFile.jpeg',
      `${user.street}, ${user.city}, ${user.country}, ${user.postalCode}`,
      'Haryana Karnal'
    ])
    await page.getByRole('button', { name: 'Close' }).click({ force: true })
  })
})
test.describe(`Bookstore web application "Alerts, Frame & Windows" >> `, async () => {
  test(`Browser Windows`, async ({ page }) => {})
})
