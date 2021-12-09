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

  system = {
    /**
     * creates a new session with user credentials
     * returns session token
     * @param {string} url - server address
     * @param {string} passwort - user password
     * @param {string} user - user name, default is dssadmin
     */

    loginUser: async (password, user = 'dssadmin') => {
      let urlString = `${this.url}/json/system/login?user=${user}&password=${password}`
      const response = await this.get(urlString)
      return response.result.token
    },

    /**
     * destroys session, logs out user
     * @param {string} url - server address
     */

    logoutUser: async () => {
      this.get(`${this.url}/json/system/logout`)
    },

    /**
     * get application token for login without authentification
     * caller must not be logged in
     * token needs to be approved by user
     * @param {string} url - server address
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
     * @param {string} url - server address
     * @param {string} token - application token
     */

    enableToken: async () => {
      return await this.get(`${this.url}/json/system/enableToken?applicationToken=${this.appToken}&token=${this.sessionToken}`)
    },

    /**
     * revoke application token
     * caller must be logged in
     * @param {string} url - server address
     * @param {string} token - application token
     */

    revokeToken: async () => {
      return await this.get(`${this.url}/json/system/revokeToken?applicationToken=${this.sessionToken}`)
    },

    /**
     * create new session with application token
     * @param {string} url - server address
     * @param {string} token - application token
     */

    loginApplication: async () => {
      let urlString = `${this.url}/json/system/loginApplication?loginToken=${this.appToken}`
      const response = await this.get(urlString)
      return response.result.token
    }   
  }

  state = {
    /**
     * get system state
     * @param {string} url - server address
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
     * @param {string} url - server address
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

  device = {
    /**
     * calls a device scene
     * @param {string} url - server address
     * @param {string} token - session token
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
     * @param {string} url - server address
     * @param {string} token - session token
     * @param {string} dsid - device digitalstrom id
     * @param {number} value - numerical 8 bit value (0-255)
     */

    setValue: async (dsid, value) => {
      const urlString = `${this.url}/json/device/callScene?token=${this.sessionToken}&dsid=${dsid}&value=${value}`

      return await get(urlString)
    }
  }

}
