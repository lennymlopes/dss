import apartment from './apartment.js'
import device from './device.js'
import system from './system.js'
import state from './state.js'
import zone from './zone.js'

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

export default dss
