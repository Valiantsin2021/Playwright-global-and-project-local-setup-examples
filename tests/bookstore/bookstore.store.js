import { test, expect } from '@playwright/test'
import { user } from '@utils/data-factory'
test.describe(`Bookstore web application`, async () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://securepubads.g.doubleclick.net/**', route => route.abort())
    await page.goto('/')
    await page.getByText('Elements').click()
  })
  test.use({ storageState: { cookies: [], origins: [] } })
  test(`"Elements" >> "Text Box"`, async ({ page }) => {
    await expect(page.getByText('Please select an item from left to start practice.')).toBeVisible()
    await page.getByText('Text Box').click()
    await page.locator('#userName').fill(user.firstName)
    await page.locator('#userEmail').fill(user.email)
    await page.locator('#currentAddress').fill(`${user.street}, ${user.city}, ${user.state}`)
    await page.locator('#permanentAddress').fill(`${user.street}, ${user.city}, ${user.state}`)
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('#output')).toContainText(
      `Name:${user.firstName}Email:${user.email}Current Address :${user.street}, ${user.city}, ${user.state} Permananet Address :${user.street}, ${user.city}, ${user.state}`
    )
  })
  test(`"Elements" >> "Check Box"`, async ({ page }) => {
    await page.getByText('Check Box').click()
    await page.locator('#tree-node').getByRole('img').nth(3).check()
    await page.getByLabel('Toggle').click()
    await expect(page.locator('#result')).toHaveText(
      'You have selected :homedesktopnotescommandsdocumentsworkspacereactangularveuofficepublicprivateclassifiedgeneraldownloadswordFileexcelFile'
    )
    const resultsElements = page.locator('#result span')
    await expect(resultsElements).toHaveCount(18)
    await expect(resultsElements).toContainText([
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
    await expect(resultsElements).toHaveCount(14)
    await expect(resultsElements).toContainText([
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
  test(`"Elements" >> "Radio Button"`, async ({ page }) => {
    await page.getByText('Radio Button').click()
    await expect(page.getByText('Do you like the site?')).toBeVisible()
    await expect(page.locator('.custom-control-label')).toHaveText(['Yes', 'Impressive', 'No'])
    await expect(page.locator('#noRadio')).toBeDisabled()
    await expect(page.locator('#yesRadio')).toBeEnabled()
    await page.locator('#yesRadio').click({ force: true })
    await expect(page.getByText('You have selected Yes')).toBeInViewport()
    await expect(page.locator('.text-success')).toHaveCSS('color', 'rgb(40, 167, 69)')
  })
  test(`"Elements" >> "Web Tables"`, async ({ page }) => {
    await page.getByText('Web Tables').click()
    await expect(page.locator('[role="rowgroup"]')).toHaveCount(10)
    await page.locator('div[role="rowgroup"]').filter({ hasText: 'Cierra' }).locator('[title="Delete"]').click()
    await expect(page.getByText('Cierra')).toBeHidden()
    await page.locator('div[role="rowgroup"]').filter({ hasText: 'Alden' }).locator('[title="Edit"]').click()
    await page.locator('#firstName').fill(user.firstName)
    await page.locator('#lastName').fill(user.lastName)
    await page.locator('#age').fill('' + user.age)
    await page.getByPlaceholder('name@example.com').fill(user.email)
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Alden', { exact: true })).toBeHidden()
    await expect(page.getByText(user.firstName)).toBeVisible()
    await expect(
      page.locator('div[role="rowgroup"]').filter({ hasText: user.firstName }).getByText(user.lastName)
    ).toBeVisible()
    await expect(
      page.locator('div[role="rowgroup"]').filter({ hasText: user.firstName }).getByText(user.email)
    ).toBeVisible()
    await page.reload()
    await expect(page.getByText('Alden', { exact: true })).toBeVisible()
    await expect(page.getByText(user.firstName)).toBeHidden()
  })
  test(`"Elements" >> "Buttons"`, async ({ page }) => {
    await page.getByText('Buttons').click()
    await page.getByText('Double Click Me', { exact: true }).dblclick()
    await expect(page.getByText('You have done a double click')).toBeVisible()
    await page.getByText('Right Click Me', { exact: true }).click({ button: 'right' })
    await expect(page.getByText('You have done a right click')).toBeVisible()
    await page.getByText('Click Me', { exact: true }).click()
    await expect(page.getByText('You have done a dynamic click')).toBeVisible()
  })
})
