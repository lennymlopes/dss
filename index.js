import apartment from './apartment.js'
import device from './device.js'
import system from './system.js'
import state from './state.js'
import zone from './zone.js'

import got from 'got'

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
  get = async url => await got(url, { https: { rejectUnauthorized: false } }).json()

  /**
   * apartment functions
   * @namespace apartment
   * @method apartment
   */
  apartment = {
    /**
     * returns apartment name
     * @memberof apartment
     * @method apartment/getName
     */ 
    getName: async () => {
      let urlString= `${this.url}/json/apartment/getName?token=${this.sessionToken}`
      const response = this.get(urlString)
      return response.result.name
    },
    /**
     * calls a apartment scene
     * @memberof apartment
     * @method callScene
     * @param {number} sceneNumber - scene number
     * @param {number} [groupID] - group id
     * @param {string} [groupName] - group name
     * @param {boolean} [force] - issue forced scene call
     */

    callScene: async (sceneNumber, groupID = undefined, groupName = undefined, force = undefined) => {
      let urlString = `${this.url}/json/apartment/callScene?token=${this.sessionToken}&sceneNumber=${sceneNumber}`
      urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
      urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
      urlString = force ? urlString += `&force=${force}` : urlString
      return await this.get(urlString)
    },
    /**
     * undoes a apartment scene
     * @param {string} url - server address
     * @param {number} sceneNumber - scene number
     * @param {number} [groupID] - group id
     * @param {string} [groupName] - group name
     */
    undoScene: async (sceneNumber, groupID = undefined, groupName = undefined) => {
      let urlString = `${this.url}/json/apartment/undoScene?token=${this.sessionToken}&sceneNumber=${sceneNumber}`
      urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
      urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
      return this.get(urlString)
    },
    /**
     * returns apartment structure,
     * includes detailed information about all zones, groups and devices.
     * @param {string} url - server address
     */
    getStructure: async () => {
      let urlString = `${this.url}/json/apartment/getStructure?token=${this.sessionToken}`
      const response = this.get(urlString)
      return response.result.apartment
    },
    /**
     * returns all devices,
     * @param {string} url - server address
     */
    getDevices: async () => {
      let urlString = `${this.url}/json/apartment/getDevices?token=${this.sessionToken}`
      const response = this.get(urlString)
      return response.result
    },
    /**
     * sets output value of all devices of a specified group (not recommended)
     * @param {string} url - server address
     * @param {number} value - numerical value
     * @param {number} groupID - group id
     * @param {string} groupName - group name
     */

    setGroupValue: async (value, groupID = undefined, groupName = undefined) => {
      let urlString = `${this.url}/json/apartment/setValue?token=${this.sessionToken}&value=${value}`
      urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
      urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
      const response = this.get(urlString)
      return response.data
    }

  }

  zone = {
    /**
     * calls a apartment scene
     * @param {string} url - server address
     * @param {number} id - zone id
     * @param {number} sceneNumber - scene number
     * @param {number} [groupID] - group id
     * @param {string} [groupName] - group name
     * @param {boolean} [force] - issue forced scene call
     */
    callScene: async (id, sceneNumber, groupID = undefined, groupName = undefined, force = undefined) => {
      let urlString = `${this.url}/json/zone/callScene?token=${this.sessionToken}&id=${id}&sceneNumber=${sceneNumber}`
      urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
      urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
      urlString = force ? urlString += `&force=${force}` : urlString
      return await this.get(urlString)
    }
  }








  

}
