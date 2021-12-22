# dss

This npm package provides a simple way to connect to and interact with a digitalSTROM Server

## Disclaimer

This package is still in development.
Use at your own risk.

## Installation

Install dss with npm

```bash
  npm install dss
```

## Usage

```javascript
// create a new server
const dss = new Server(process.env.DSS_URL)
// connect via token
await dss.connect({ appToken: process.env.DSS_TOKEN })
// or connect via password
await dss.connect({ password: process.env.DSS_PASSWORD })
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
