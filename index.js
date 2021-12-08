const apartment = require('./apartment')
const device = require('./device')
const system = require('./system')
const state = require('./state')
const zone = require('./zone')

const dss = async (options={}) => {
  let sessionToken = undefined
  if(!options.hasOwnProperty('url')) {
    throw new Error('Please provide a valid url.')
  }
  if( options.token ) {
    console.log('token')
    sessionToken = await system.loginApplication(options.url, options.token)
    console.log(sessionToken)
    console.log(await apartment.getName(options.url, sessionToken))
  } else if ( options.password) {
    console.log('password')
    sessionToken = await system.loginUser(options.url, options.password)
    console.log(await apartment.getName(options.url, sessionToken))
  } else {
    throw new Error("Please provide a valid token or password.")
  }

  return {
    apartment
  }
}

module.exports = dss
