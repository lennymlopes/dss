require('dotenv').config()
const dss = require('./index.js')

test('checks if errors ar thrown if options are missing', async () => {

    await expect(async () => { 
      await dss() 
    }).rejects.toThrow('Please provide a valid url.')

    await expect(async () => { 
      await dss({url: process.env.DSS_URL}) 
    }).rejects.toThrow('Please provide a valid token or password.')
})

test('checks stuff', async () => {
  expect(await dss({url: process.env.DSS_URL, token: process.env.DSS_TOKEN}))
  .toHaveProperty('apartment')
})

