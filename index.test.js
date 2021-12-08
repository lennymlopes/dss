import dotenv from 'dotenv'
import Server from './index.js'
dotenv.config()

test('throw error if url param is missing', async () => {
  await expect(async () => {
    const dss = new Server()
    await dss.connect()
  }).rejects.toThrow('Please provide a valid url.')
})

test('throw error if auth data is missing', async () => {
  await expect(async () => {
    const dss = new Server()
    await dss.connect({ url: process.env.DSS_URL })
  }).rejects.toThrow('Please provide a valid token or password.')
})

test('throw error if token but no url', async () => {
  await expect(async () => {
    const dss = new Server()
    await dss.connect({ appToken: process.env.DSS_TOKEN })
  }).rejects.toThrow('Please provide a valid url.')
})

test('throw error if password but no url', async () => {
  await expect(async () => {
    const dss = new Server()
    await dss.connect({ password: 'dssadmin' })
  }).rejects.toThrow('Please provide a valid url.')
})

// test('checks stuff', async () => {
//   expect(await dss({url: process.env.DSS_URL, token: process.env.DSS_TOKEN}))
//   .toHaveProperty('apartment')
// })
