const got = require('got')

/**
 * interact with digitalstrom server
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
   * @param  {object} options 
   * @param  {string} options.url
   * @param  {string} [options.appToken]
   * @param  {string} [options.password]
   * @return {string} this.sessionToken 
   * @example <caption>Connecting to a server with a application token</caption>
   * const dss = new Server()
   * await dss.connect({ url: process.env.DSS_URL, process.env.DSS_TOKEN }))
   * @example <caption>Connecting to a server with a password</caption>
   * const dss = new Server()
   * await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' }))
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
   * @param {string} url - url to make request to
   * @return {Object}
   */
  async get (url) {
    const options = { 
      https: { 
        rejectUnauthorized: false 
      } 
    }
    return await got(url, options).json()
  }


  /**
   * apartment functions
   * @namespace Server.apartment
   */
  apartment = {

    /**
     * returns apartment name
     * @memberof Server.apartment
     * @return {string}
     */
    getName: async () => {
      let urlString= `${this.url}/json/apartment/getName`
      urlString += `?token=${this.sessionToken}`
      const response = await this.get(urlString)
      return response.result.name
    },
    /**
     * calls a apartment scene
     * @memberof Server.apartment
     * @param {number} sceneNumber - scene number
     * @param {number} [groupID] - group id
     * @param {string} [groupName] - group name
     * @param {boolean} [force] - issue forced scene call
     * @return {object} 
     * @example <caption>Connecting to a server with a password</caption>
     * const dss = new Server()
     * await dss.connect({ url: process.env.DSS_URL, password: 'dssadmin' }))
     * await dss.apartment.callScene
     */

    callScene: async (sceneNumber, groupID = undefined, groupName = undefined, force = undefined) => {
      let urlString = `${this.url}/json/apartment/callScene`
      urlString += `?token=${this.sessionToken}&sceneNumber=${sceneNumber}`
      urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
      urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
      urlString = force ? urlString += `&force=${force}` : urlString
      return await this.get(urlString)
    },
    /**
     * undoes a apartment scene
     * @memberof Server.apartment
     * @param {number} sceneNumber - scene number
     * @param {number} [groupID] - group id
     * @param {string} [groupName] - group name
     */
    undoScene: async (sceneNumber, groupID = undefined, groupName = undefined) => {
      let urlString = `${this.url}/json/apartment/undoScene`
      urlString += `?token=${this.sessionToken}&sceneNumber=${sceneNumber}`
      urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
      urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
      return this.get(urlString)
    },
    /**
     * returns apartment structure,
     * includes detailed information about all zones, groups and devices.
     * @memberof Server.apartment
     */
    getStructure: async () => {
      let urlString = `${this.url}/json/apartment/getStructure`
      urlString += `?token=${this.sessionToken}`

      const response = this.get(urlString)
      return response.result.apartment
    },
    /**
     * returns all devices,
     * @memberof Server.apartment
     */
    getDevices: async () => {
      let urlString = `${this.url}/json/apartment/getDevices`
      urlString += `?token=${this.sessionToken}`

      const response = await this.get(urlString)
      return response.result
    },
    /**
     * sets output value of all devices of a specified group (not recommended)
     * @memberof Server.apartment
     * @param {number} value - numerical value
     * @param {number} groupID - group id
     * @param {string} groupName - group name
     */

    setGroupValue: async (value, groupID = undefined, groupName = undefined) => {
      let urlString = `${this.url}/json/apartment/setValue`
      urlString += `?token=${this.sessionToken}&value=${value}`

      urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
      urlString = groupName ? urlString += `&groupName=${groupName}` : urlString

      const response = await this.get(urlString)
      return response
    }

  }

  /**
   * zone functions
   * @namespace Server.zone
   */

  zone = {
    /**
     * calls a zone scene
     * @memberof Server.zone
     * @param {number} id - zone id
     * @param {number} sceneNumber - scene number
     * @param {number} [groupID] - group id
     * @param {string} [groupName] - group name
     * @param {boolean} [force] - issue forced scene call
     */
    callScene: async (id, sceneNumber, groupID = undefined, groupName = undefined, force = undefined) => {
      let urlString = `${this.url}/json/zone/callScene`
      urlString += `?token=${this.sessionToken}`
      urlString += `&id=${id}&sceneNumber=${sceneNumber}`

      urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
      urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
      urlString = force ? urlString += `&force=${force}` : urlString

      return await this.get(urlString)
    }
  }

  /**
   * system functions
   * @namespace Server.system
   */

  system = {
    /**
     * creates a new session with user credentials
     * returns session token
     * @memberof system
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
     * @memberof Server.system
     */

    logoutUser: async () => {
      this.get(`${this.url}/json/system/logout`)
    },

    /**
     * get application token for login without authentification
     * caller must not be logged in
     * token needs to be approved by user
     * @memberof Server.system
     * @param {string} name - application name
     */

    getToken: async name => {
      let urlString = `${this.url}/json/system/requestApplicationToken`
      urlString += `?applicationName=${name}`

      const response = await this.get(urlString)
      return response.result.applicationToken
    },

    /**
     * enable application token
     * caller must be logged in
     * @memberof Server.system
     */

    enableToken: async () => {
      let urlString = `${this.url}/json/system/enableToken`
      urlString += `?applicationToken=${this.appToken}`
      urlString += `&token=${this.sessionToken}`

      return await this.get(urlString)
    },

    /**
     * revoke application token
     * caller must be logged in
     * @memberof Server.system
     */

    revokeToken: async () => {
      let urlString = `${this.url}/json/system/revokeToken`
      urlString += `?applicationToken=${this.sessionToken}`

      return await this.get(urlString)

    },

    /**
     * create new session with application token
     * @memberof Server.system
     */

    loginApplication: async () => {
      let urlString = `${this.url}/json/system/loginApplication`
      urlString += `?loginToken=${this.appToken}`

      const response = await this.get(urlString)
      return response.result.token
    }   
  }


  /**
   * state functions
   * @namespace Server.state
   */

  state = {
    /**
     * get system state
     * @memberof Server.state
     * @param {string} name - state identifier
     * @param {string} [addon] - owner of state, 
     * e.g. system-addon-user-defined-states
     */

    getState: async (name, addon = undefined) => {
      let urlString = `${this.url}/json/state/get`
      urlString += `?token=${this.sessionToken}&name=${name}`

      urlString = addon ? urlString += `&addon=${addon}` : urlString

      const response = await this.get(urlString)
      return response.result.value
    },

    /**
     * set system state
     * @memberof Server.state
     * @param {string} name - state identifier
     * @param {string} value - new value
     * @param {string} [addon] - owner of state, 
     * e.g. system-addon-user-defined-states
     */

    setState: async (name, value, addon = undefined) => {
      let urlString = `${this.url}/json/state/set`
      urlString += `?name=${name}&value=${value}`
      urlString += `&token=${this.sessionToken}`

      urlString = addon ? urlString += `&addon=${addon}` : urlString

      try {
        return await this.get(urlString)
      } catch (e) {
        return e
      }
    }
  }


  /**
   * device functions
   * @namespace Server.device
   */

  device = {
    /**
     * calls a device scene
     * @memberof Server.device
     * @param {string} dsid - device digitalstrom id
     * @param {number} sceneNumber - scene number
     * @param {boolean} [force] - issue forced scene call
     * @returns {object} response
     * @example <caption>Call scene 5 for device with id 32893</caption>
     * await dss.device.callScene("32893", 5)
     */

    callScene: async (dsid, sceneNumber, force = undefined) => {
      let urlString = `${this.url}/json/device/callScene`
      urlString += `?token=${this.sessionToken}`
      urlString += `&dsid=${dsid}`
      urlString += `&sceneNumber=${sceneNumber}`
      urlString = force ? urlString += `&force=${force}` : urlString

      return await this.get(urlString)
    },

    /**
     * sets device value
     * @memberof Server.device
     * @param {string} dsid - device digitalstrom id
     * @param {number} value - numerical 8 bit value (0-255)
     * @returns {object} response
     * @example <caption>Set output value to 200 for device with id 32893</caption>
     * await dss.device.callScene("32893", 200)
     */

    setValue: async (dsid, value) => {
      let urlString = `${this.url}/json/device/setValue`
      urlString += `?token=${this.sessionToken}`
      urlString += `&dsid=${dsid}&value=${value}`

      return await this.get(urlString)
    }
  }

}

module.exports = Server


