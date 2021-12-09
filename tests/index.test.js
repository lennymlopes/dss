import dotenv from 'dotenv'
import Server from '../src/index.js'
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

test('get apartment name', async () => {
  const dss = new Server()
    console.log(await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' }))
    let name = await dss.apartment.getName()
    expect(name).toBe('dSS')
})

test('call zone scene', async () => {
  const dss = new Server()
    console.log(await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' }))
    expect(await dss.zone.callScene(10,17)).toHaveProperty('ok', true)
})

test('call apartment scene', async () => {
  const dss = new Server()
    console.log(await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' }))
    expect(await dss.apartment.callScene(72)).toHaveProperty('ok', true)
})



