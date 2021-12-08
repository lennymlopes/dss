import apartment from './apartment.js'
import device from './device.js'
import system from './system.js'
import state from './state.js'
import zone from './zone.js'

// const dss = async (options={}) => {
//   let sessionToken = undefined
//   if(!options.hasOwnProperty('url')) {
//     throw new Error('Please provide a valid url.')
//   }
//   if( options.token ) {
//     console.log('token')
//     sessionToken = await system.loginApplication(options.url, options.token)
//     console.log(sessionToken)
//     console.log(await apartment.getName(options.url, sessionToken))
//   } else if ( options.password) {
//     console.log('password')
//     sessionToken = await system.loginUser(options.url, options.password)
//     console.log(await apartment.getName(options.url, sessionToken))
//   } else {
//     throw new Error("Please provide a valid token or password.")
//   }

//   return {
//     apartment
//   }
// }

// export default dss

export default class Server {

  constructor({url, appToken, password}={}) {
    this.url = url
    this.appToken = appToken
    this.password = password
    this.sessionToken = undefined
  }

  /**
   * connect to a dss with either password or token
   */
  async connect () {
    console.log(this)
    console.log(this.url, this.appToken, this.password)

    if(!this.url) {
      throw new Error('Please provide a valid url.')
    }

    if( this.appToken ) {
      this.sessionToken = await system.loginApplication(this.url, this.appToken)
    } else if ( this.password) {
      this.sessionToken = await system.loginUser(this.url, this.password)
    } else {
      throw new Error("Please provide a valid token or password.")
    }

    return this.sessionToken
  }

  /**
   * get request, needs to accept unauthorized certificates 
   * because of self signed certificate
   * @params {string} url - url to make request to
   */
  get = async url => await got(url, { https: { rejectUnauthorized: false } })

}
