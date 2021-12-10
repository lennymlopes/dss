const got = require('got')

/**
 * interact with digitalstrom server
 * @class 
 * @classdesc test
 * @example <caption>Connecting to a server and getting its name</caption>
 * const dss = new Server()
 * await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' }))
 * console.log(await dss.apartment.getName())
 */

class Server {
  /**
   * constructor
   */
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
      this.sessionToken = await this.system.loginApplication()
    } else if ( this.password) {
      this.sessionToken = await this.system.loginUser(this.password)
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
   */

  apartment = {
    /**
     * returns apartment name
     * @memberof apartment
     * @method getName
     */ 
    getName: async () => {
      let urlString= `${this.url}/json/apartment/getName?token=${this.sessionToken}`
      const response = await this.get(urlString)
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
     * @memberof apartment
     * @method undoScene
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
     * @memberof apartment
     * @method getStructure
     */
    getStructure: async () => {
      let urlString = `${this.url}/json/apartment/getStructure?token=${this.sessionToken}`
      const response = this.get(urlString)
      return response.result.apartment
    },
    /**
     * returns all devices,
     * @memberof apartment
     * @method getDevices
     */
    getDevices: async () => {
      let urlString = `${this.url}/json/apartment/getDevices?token=${this.sessionToken}`
      const response = await this.get(urlString)
      return response.result
    },
    /**
     * sets output value of all devices of a specified group (not recommended)
     * @memberof system
     * @method setGroupValue
     * @param {number} value - numerical value
     * @param {number} groupID - group id
     * @param {string} groupName - group name
     */

    setGroupValue: async (value, groupID = undefined, groupName = undefined) => {
      let urlString = `${this.url}/json/apartment/setValue?token=${this.sessionToken}&value=${value}`
      urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
      urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
      const response = await this.get(urlString)
      return response
    }

  }

  /**
   * zone functions
   * @exports dss/zone
   * @namespace zone
   */

  zone = {
    /**
     * calls a apartment scene
     * @memberof zone
     * @method callScene
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

  /**
   * system functions
   * @exports dss/system
   * @namespace system
   */

  system = {
    /**
     * creates a new session with user credentials
     * returns session token
     * @memberof system
     * @method loginUser
     * @param {string} url - server address
     * @param {string} passwort - user password
     * @param {string} user - user name, default is dssadmin
     */

    loginUser: async (password, user = 'dssadmin') => {
      let urlString = `${this.url}/json/system/login?user=${user}`
      urlString += `&password=${password}`
      const response = await this.get(urlString)
      return response.result.token
    },

    /**
     * destroys session, logs out user
     * @memberof system
     * @method logoutUser
     */

    logoutUser: async () => {
      this.get(`${this.url}/json/system/logout`)
    },

    /**
     * get application token for login without authentification
     * caller must not be logged in
     * token needs to be approved by user
     * @memberof system
     * @method getToken
     * @param {string} name - application name
     */

    getToken: async name => {
      let urlString = `${this.url}/json/system/requestApplicationToken?applicationName=${name}`
      const response = await this.get(urlString)
      return response.result.applicationToken
    },

    /**
     * enable application token
     * caller must be logged in
     * @memberof system
     * @method enableToken
     */

    enableToken: async () => {
      return await this.get(`${this.url}/json/system/enableToken?applicationToken=${this.appToken}&token=${this.sessionToken}`)
    },

    /**
     * revoke application token
     * caller must be logged in
     * @memberof system
     * @method revokeToken
     */

    revokeToken: async () => {
      return await this.get(`${this.url}/json/system/revokeToken?applicationToken=${this.sessionToken}`)
    },

    /**
     * create new session with application token
     * @memberof system
     * @method loginApplication
     */

    loginApplication: async () => {
      let urlString = `${this.url}/json/system/loginApplication?loginToken=${this.appToken}`
      const response = await this.get(urlString)
      return response.result.token
    }   
  }


  /**
   * state functions
   * @exports dss/state
   * @namespace state
   */

  state = {
    /**
     * get system state
     * @memberof state
     * @method getState
     * @param {string} name - state identifier
     * @param {string} [addon] - owner of state, e.g.system-addon-user-defined-states
     */

    getState: async (name, addon = undefined) => {
      const urlString = `${this.url}/json/state/get?token=${this.sessionToken}&name=${name}`
      // urlString = addon ? urlString += `&addon=${addon}` : urlString
      const response = await get(urlString)
      return response.result.value
    },

    /**
     * set system state
     * @memberof state
     * @method setState
     * @param {string} name - state identifier
     * @param {string} value - new value
     * @param {string} [addon] - owner of state, e.g.system-addon-user-defined-states
     */

    setState: async (name, value, addon = undefined) => {
      let urlString = `${this.url}/json/state/set?name=${name}&value=${value}&token=${this.sessionToken}`
      urlString = addon ? urlString += `&addon=${addon}` : urlString
      try {
        return await get(urlString)
      } catch (e) {
        return e
      }
    }
  }


  /**
   * device functions
   * @exports dss/device
   * @namespace device
   */

  device = {
    /**
     * calls a device scene
     * @memberof device
     * @method callScene
     * @param {string} dsid - device digitalstrom id
     * @param {number} sceneNumber - scene number
     * @param {boolean} [force] - issue forced scene call
     */

    callScene: async (dsid, sceneNumber, force = undefined) => {
      let urlString = `${this.url}/json/device/callScene?token=${this.sessionToken}&dsid=${dsid}&sceneNumber=${sceneNumber}`
      urlString = force ? urlString += `&force=${force}` : urlString

      return await get(urlString)
    },

    /**
     * sets device value
     * @memberof device
     * @method setValue
     * @param {string} dsid - device digitalstrom id
     * @param {number} value - numerical 8 bit value (0-255)
     */

    setValue: async (dsid, value) => {
      const urlString = `${this.url}/json/device/setValue?token=${this.sessionToken}&dsid=${dsid}&value=${value}`

      return await this.get(urlString)
    }
  }

}

module.exports = Server
