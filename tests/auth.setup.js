import { test as setup, expect } from '@playwright/test'
import fs from 'fs'
import 'dotenv/config'
const authFile = './utils/auth.json'

setup(`Login via API call`, async ({ request }) => {
  if (!process.env.USER || process.env.USER === '') {
    throw new Error('Env file is not correct or absent')
  }
  const stats = fs.existsSync(authFile.toString()) ? fs.statSync(authFile.toString()) : null
  if (stats && stats.mtimeMs > new Date().getTime() - 100_000_000) {
    console.log(`\x1b[2m\t***** Sign in skipped because storage state is fresh *****\x1b[0m`)
    return
  } else {
    console.log(`\x1b[2m\t***** Saving storage state *****\x1b[0m`)
    const response = await request.post(process.env.APIURL, {
      data: { username: process.env.USER, password: process.env.PASS }
    })
    expect(response.status()).toBe(200)
    const storageState = await request.storageState()
    const body = await response.json()
    const token = body.token
    storageState.origins = [
      {
        origin: process.env.BASEURL,
        localStorage: [
          {
            name: 'authToken',
            value: token
          },
          {
            name: 'userId',
            value: '19143'
          }
        ]
      }
    ]
    fs.writeFileSync('./utils/auth.json', JSON.stringify(storageState))
  }
})
