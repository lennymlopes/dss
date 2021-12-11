const dotenv = require('dotenv')
const Server = require('../src/index.js')
dotenv.config()

jest.setTimeout(20000)

//-- Server --------------------------------------------------------------------

test('test Server.get, make request to server', async() => {
  const dss = new Server(process.env.DSS_URL)
  let urlString = `${process.env.DSS_URL}/json/system/loginApplication`
      urlString += `?loginToken=${process.env.DSS_TOKEN}`

  let response = await dss.get(urlString)
  expect(response.result.token.length).toBe(64)
}) 



test('test Server.connect, get a session token', async() => {
  const dss = new Server(process.env.DSS_URL)
  let sessionToken = await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })
  expect(sessionToken.length).toBe(64)
}) 

// exceptions

test('throw error if url param is missing', async () => {
  await expect(async () => {
    const dss = new Server()
    await dss.connect()
  }).rejects.toThrow('Please provide a valid url.')
})

test('throw error if auth data is missing', async () => {
  await expect(async () => {
    const dss = new Server(process.env.DSS_URL)
    await dss.connect()
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


//-- Server.apartment ----------------------------------------------------------

test('test Server.apartment.getName, get apartment name', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })
  let name = await dss.apartment.getName()
  expect(name).toBe('dSS')
})

test('test Server.apartment.callScene, call apartment scene', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })
  expect(await dss.apartment.callScene(72)).toHaveProperty('ok', true)
  // expect(await dss.apartment.callScene(17,1)).toHaveProperty('ok', true)
})

test('test Server.apartment.undoScene, undo apartment scene', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })
  expect(await dss.apartment.undoScene(72)).toHaveProperty('ok', true)
})

test('test Server.apartment.getStructure, get apartment structure', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })
  let structure = await dss.apartment.getStructure()
  expect(structure).toHaveProperty('clusters')
  expect(structure).toHaveProperty('zones')
  expect(structure).toHaveProperty('floors')
})

test('test Server.apartment.getDevices, get all devices', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })
  let devices = await dss.apartment.getDevices()
  expect(typeof devices).toBe("object")
})


test('test Server.apartment.setGroupValue, turn off all lights', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })
  expect(await dss.apartment.setGroupValue(127, 1)).toHaveProperty('ok', true)
  expect(await dss.apartment.setGroupValue(0, 1)).toHaveProperty('ok', true)
})

//-- Server.zone ---------------------------------------------------------------

test('test Server.zone.callScene, turn on and off lights', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })
  expect(await dss.zone.callScene(10, 5)).toHaveProperty('ok', true)
  expect(await dss.zone.callScene(10, 0, undefined, undefined, true)).toHaveProperty('ok', true)
})

//-- Server.system -------------------------------------------------------------

test('test Server.system.loginUser, get session token', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })

  let token = await dss.system.loginUser(process.env.DSS_PASSWORD)
  expect(token.length).toBe(64)
})

test('test Server.system.logoutUser, destroy session', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })

  await dss.system.logoutUser()
  expect(await dss.zone.callScene(10, 5)).toHaveProperty('ok', false)

})

test('test getToken, enableToken and revokeToken', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })

  let appToken = await dss.system.getToken('dss.js-testing')
  await dss.connect({ 
    password: process.env.DSS_PASSWORD 
  })
  await dss.system.enableToken(appToken)
  expect(await dss.system.revokeToken(appToken)).toHaveProperty('ok', true)

})

test('test getToken, enableToken and revokeToken', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })

  let token = await dss.system.loginApplication(process.env.DSS_TOKEN)
  expect(token.length).toBe(64)

})

//-- Server.state --------------------------------------------------------------

test('test Server.state.getState, get current presence state', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })

  let state = await dss.state.getState('presence')
  expect(state == 'present' || state == 'absent').toBeTruthy()
})

//-- Server.device -------------------------------------------------------------


test('test Server.device, get current presence state', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })

  let devices = await dss.apartment.getDevices()

  let lights = devices.filter(device => {
    return device.isPresent == true && device.groups.includes(1) && device.outputMode != 0
  }).map(light => light.id)

  expect(await dss.device.callScene(lights[0], 5)).toHaveProperty('ok', true)
})

test('test Server.device, get current presence state', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })

  let devices = await dss.apartment.getDevices()

  let lights = devices.filter(device => {
    return device.isPresent == true && device.groups.includes(1) && device.outputMode != 0
  }).map(light => light.id)


  expect(await dss.device.setValue(lights[0], 0)).toHaveProperty('ok', true)

})

test('test Server.device, get current presence state', async () => {
  const dss = new Server(process.env.DSS_URL)
  await dss.connect({ 
    appToken: process.env.DSS_TOKEN 
  })

  let devices = await dss.apartment.getDevices()

  let lights = devices.filter(device => {
    return device.isPresent == true && device.groups.includes(1) && device.outputMode != 0
  }).map(light => light.id)

  expect(await dss.device.blink(lights[2])).toHaveProperty('ok', true)
})








