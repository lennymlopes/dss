# dss

This npm package provides a simple way to connect to and interact with a digitalSTROM Server


## Installation

Install dss with npm

```bash
  npm install dss
```

## Usage
```javascript
// create a new server
const dss = new Server()
// connect via token
await dss.connect({ url: process.env.DSS_URL, appToken: process.env.DSS_TOKEN })
// or connect via password
await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' })
// get the apartments name
console.log(await dss.apartment.getName())
// get all devices
let devices = await dss.apartment.getDevices()
// turn all lights on
await dss.apartment.callScene(5, 1)
// set apartment state to absent
await dss.apartment.callScene(72)

```

    
## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Documentation

[Documentation](docs/index.html)


## Environment Variables

To run the tests, you will need to add the following environment variables to your .env file


`DSS_URL` and
`DSS_TOKEN`
