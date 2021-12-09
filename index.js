import apartment from './apartment.js'
import device from './device.js'
import system from './system.js'
import state from './state.js'
import zone from './zone.js'

export default class Server {

  constructor() {
    this.url = undefined
    this.appToken = undefined
    this.password = undefined
    this.sessionToken = undefined
  }

  /**
   * connect to a dss with either password or token
   */
  async connect ({url=null, appToken=null, password=null}={}) {
    
    this.url = url
    this.appToken = appToken
    this.password = password

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
