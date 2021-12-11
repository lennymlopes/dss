const dotenv = require('dotenv')
const Server = require('../src/index.js')
dotenv.config()

jest.setTimeout(20000)

//-- Server --------------------------------------------------------------------

test('test Server.get, make request to server', async() => {
  const dss = new Server()
  let urlString = `${process.env.DSS_URL}/json/system/loginApplication`
      urlString += `?loginToken=${process.env.DSS_TOKEN}`

  let response = await dss.get(urlString)
  expect(response.result.token.length).toBe(64)
}) 



test('test Server.connect, get a session token', async() => {
  const dss = new Server()
  let sessionToken = await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
  expect(sessionToken.length).toBe(64)
}) 

//-- Server.apartment ----------------------------------------------------------

test('test Server.apartment.getName, get apartment name', async () => {
  const dss = new Server()
  await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
  let name = await dss.apartment.getName()
  expect(name).toBe('dSS')
})

test('test Server.apartment.callScene, call apartment scene', async () => {
  const dss = new Server()
  await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
  expect(await dss.apartment.callScene(72)).toHaveProperty('ok', true)
})

test('test Server.apartment.undoScene, undo apartment scene', async () => {
  const dss = new Server()
  await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
  expect(await dss.apartment.undoScene(72)).toHaveProperty('ok', true)
})

test('test Server.apartment.getStructure, get apartment structure', async () => {
  const dss = new Server()
  await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
  let structure = await dss.apartment.getStructure()
  // console.log(structure)
  // expect(structure).toHaveProperty('ok', true)
})

// test('throw error if url param is missing', async () => {
//   await expect(async () => {
//     const dss = new Server()
//     await dss.connect()
//   }).rejects.toThrow('Please provide a valid url.')
// })

// test('throw error if auth data is missing', async () => {
//   await expect(async () => {
//     const dss = new Server()
//     await dss.connect({ url: process.env.DSS_URL })
//   }).rejects.toThrow('Please provide a valid token or password.')
// })

// test('throw error if token but no url', async () => {
//   await expect(async () => {
//     const dss = new Server()
//     await dss.connect({ appToken: process.env.DSS_TOKEN })
//   }).rejects.toThrow('Please provide a valid url.')
// })

// test('throw error if password but no url', async () => {
//   await expect(async () => {
//     const dss = new Server()
//     await dss.connect({ password: 'dssadmin' })
//   }).rejects.toThrow('Please provide a valid url.')
// })



// test('call zone scene', async () => {
//   const dss = new Server()
//   await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
//   expect(await dss.zone.callScene(10, 5)).toHaveProperty('ok', true)
//   expect(await dss.zone.callScene(10, 0, undefined, undefined, true)).toHaveProperty('ok', true)
// })



// test('get all devices', async () => {
//   const dss = new Server()
//     await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
//     let devices = await dss.apartment.getDevices()
//     // console.log(devices[0])
//     // expect(await dss.apartment.getDevices()).toHaveProperty('ok', true)
// })

// test('turn on all lights', async () => {
//   const dss = new Server()
//     await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
//     expect(await dss.apartment.callScene(5, 1)).toHaveProperty('ok', true)
//     // expect(await dss.apartment.setGroupValue(255, 1)).toHaveProperty('ok', true)
// })

// test('turn off all lights', async () => {
//   const dss = new Server()
//     await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
//     expect(await dss.apartment.setGroupValue(0, 1)).toHaveProperty('ok', true)
// })

// test('turn off all devices', async () => {
//   const dss = new Server()
//     await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
//     expect(await dss.apartment.setGroupValue(0)).toHaveProperty('ok', true)
// })
