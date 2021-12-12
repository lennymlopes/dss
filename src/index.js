const https = require('https')

/**
 * interact with digitalstrom server
 * @example <caption>Connecting to a server and getting its name</caption>
 * const dss = new Server(process.env.DSS_URL)
 * await dss.connect({ password: 'dssadmin' })
 * console.log(await dss.apartment.getName())
 */

class Server {
  /**
   * constructor
   */
  /**
   * @param  {string} url - server url
   */
  constructor(url) {
    this.url = url
    this.appToken = undefined
    this.password = undefined
    this.sessionToken = undefined
  }


  /**
   * connect to a dss with either password or token
   * @param  {object} options 
   * @param  {string} [options.appToken]
   * @param  {string} [options.password]
   * @return {string} this.sessionToken 
   * @example <caption>Connecting to a server with a application token</caption>
   * const dss = new Server(process.env.DSS_URL)
   * await dss.connect({ appToken: process.env.DSS_TOKEN })
   * @example <caption>Connecting to a server with a password</caption>
   * const dss = new Server(process.env.DSS_URL)
   * await dss.connect({ password: 'dssadmin' })
   */
  async connect ({appToken=null, password=null}={}) {
    
    this.appToken = appToken
    this.password = password

    if(!this.url) {
      throw new Error('Please provide a valid url.')
    }

    if( this.appToken ) {
      this.sessionToken = await this.system.loginApplication(this.appToken)
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
   * @return {object} response
   * @example <caption>Logging into the server</caption>
   * const dss = new Server(process.env.DSS_URL)
   * let urlString = `${process.env.DSS_URL}/system/login?user=dssadmin`
   * urlString += `&password=${process.env.DSS_PASSWORD}`
   * await dss.get(urlString)
   */


  async get (url) {
    return new Promise ( async (resolve, reject) => {
      const options = { 
          rejectUnauthorized: false,
          port: 8080
      }
      let data = []
      await https.get(url, options, res => {
        res.setEncoding('utf8')
        res.on('data', chunk => data += chunk)
        res.on('error', e => reject(e.message))
        res.on('end', () => resolve(JSON.parse(data)))
      }) 
    })
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
     * @example <caption>Calling a apartment scene</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.connect({ password: 'dssadmin' }))
     * console.log(await dss.apartment.getName())
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
     * @example <caption>Calling a apartment scene</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.connect({ password: 'dssadmin' }))
     * await dss.apartment.callScene(5, 1)
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
     * @example <caption>Connecting to a server with a application token</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.connect({ password: process.env.DSS_PASSWORD }))
     * await dss.apartment.undoScene(5, 1)
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
     * @example <caption>Get apartment structure</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.connect({ password: process.env.DSS_PASSWORD }))
     * let structure = await dss.apartment.getStructure()
     * console.log(structure)
     */
    getStructure: async () => {
      let urlString = `${this.url}/json/apartment/getStructure`
      urlString += `?token=${this.sessionToken}`

      const response = await this.get(urlString)
      return response.result.apartment
    },
    /**
     * returns all devices,
     * @memberof Server.apartment
     * @example <caption>Get apartment structure</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.connect({ password: process.env.DSS_PASSWORD }))
     * let devices = await dss.apartment.getDevices()
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
     * @example <caption>Set all lights to half power</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.connect({ password: process.env.DSS_PASSWORD }))
     * await dss.apartment.setGroupValue(127, 1)
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
     * @example <caption>Turn devices in zone 10 on</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.connect({ password: process.env.DSS_PASSWORD }))
     * await dss.zone.callScene(10, 5)
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
     * @param {string} password - user password
     * @param {string} user - user name, default is dssadmin
     * @example <caption>Get a session token with password</caption>
     * const dss = new Server(process.env.DSS_URL)
     * let token = await dss.system.loginUser(process.env.DSS_PASSWORD)
     */

    loginUser: async (password, user = 'dssadmin') => {
      let urlString = `${this.url}/json/system/login?user=${user}`
      urlString += `&password=${password}`

      const response = await this.get(urlString)
      this.sessionToken = response.result.token
      return response.result.token
    },

    /**
     * destroys session, logs out user
     * @memberof Server.system
     * @example <caption>Get a session token with password</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.system.logoutUser()
     */

    logoutUser: async () => {
      this.sessionToken = undefined
      return await this.get(`${this.url}/json/system/logout`)
    },

    /**
     * get application token for login without authentification
     * caller must not be logged in
     * token needs to be approved by user
     * @memberof Server.system
     * @param {string} name - application name
     * @example <caption>Create a new app</caption>
     * const dss = new Server(process.env.DSS_URL)
     * let appToken = await dss.system.getToken('your_app_name')
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
     * @param  {string} appToken - application token to enable
     * @return {string}
     * @example <caption>Enable new app</caption>
     * const dss = new Server(process.env.DSS_URL)
     * let appToken = await dss.system.getToken('your_app_name')
     * await dss.connect({ password: process.env.DSS_PASSWORD })
     * await dss.system.enableToken(appToken)
     */
    enableToken: async (appToken) => {
      let urlString = `${this.url}/json/system/enableToken`
      urlString += `?applicationToken=${appToken}`
      urlString += `&token=${this.sessionToken}`

      return await this.get(urlString)
    },

    /**
     * revoke application token
     * caller must be logged in
     * @memberof Server.system
     * @example <caption>Revoke app token</caption>
     * const dss = new Server(process.env.DSS_URL)
     * let appToken = await dss.system.getToken('your_app_name')
     * await dss.connect({ password: process.env.DSS_PASSWORD })
     * await dss.system.enableToken(appToken)
     * await dss.system.revokeToken(appToken)
     */

    revokeToken: async (appToken) => {
      let urlString = `${this.url}/json/system/revokeToken`
      urlString += `?applicationToken=${appToken}`
      urlString += `&token=${this.sessionToken}`

      return await this.get(urlString)

    },

    /**
     * create new session with application token
     * @memberof Server.system
     * @example <caption>Create new session with valid app token</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.system.loginApplication(process.env.DSS_TOKEN)
     */

    loginApplication: async (appToken) => {
      let urlString = `${this.url}/json/system/loginApplication`
      urlString += `?loginToken=${appToken}`

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
     * @example <caption>Create new session with valid app token</caption>
     * const dss = new Server(process.env.DSS_URL)
     * await dss.connect({ appToken: process.env.DSS_TOKEN })
     * let state = await dss.state.getState('presence')
     */

    getState: async (name, addon = undefined) => {
      let urlString = `${this.url}/json/state/get`
      urlString += `?token=${this.sessionToken}&name=${name}`

      urlString = addon ? urlString += `&addon=${addon}` : urlString

      const response = await this.get(urlString)
      return response.result.value
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
     * @example <caption>Call scene 5 for device with 
     * id 3504175fe000000000017ef3</caption>
     * await dss.device.callScene("3504175fe000000000017ef3", 5)
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
     * @example <caption>Set output value to 200 for device with 
     * id 3504175fe000000000017ef3</caption>
     * await dss.device.callScene("3504175fe000000000017ef3", 200)
     */

    setValue: async (dsid, value) => {
      let urlString = `${this.url}/json/device/setValue`
      urlString += `?token=${this.sessionToken}`
      urlString += `&dsid=${dsid}&value=${value}`

      return await this.get(urlString)
    },

    /**
     * executes the "blink" function
     * @memberof Server.device
     * @param {string} dsid - device digitalstrom id
     * @returns {object} response
     * @example <caption>Blink device with 
     * id 3504175fe000000000017ef3</caption>
     * await dss.device.blink("3504175fe000000000017ef3")
     */

    blink: async dsid => {
      let urlString = `${this.url}/json/device/blink`
      urlString += `?token=${this.sessionToken}`
      urlString += `&dsid=${dsid}`

      return await this.get(urlString)
    }
  }

}

module.exports = Server


