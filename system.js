import got from 'got'
const options = { https: { rejectUnauthorized: false } }

// -- auth ----------------------------------------------------------------------
/**
 * creates a new session with user credentials
 * returns session token
 * @param {string} url - server address
 * @param {string} passwort - user password
 * @param {string} user - user name, default is dssadmin
 */

const loginUser = async (url, password, user = 'dssadmin') => {
  const response = await got(`${url}/json/system/login?user=${user}&password=${password}`, options).json()
  return response.result.token
}

/**
 * destroys session, logs out user
 * @param {string} url - server address
 */

const logoutUser = async url => await got(`${url}/json/system/logout`, options).json()

/**
 * get application token for login without authentification
 * caller must not be logged in
 * token needs to be approved by user
 * @param {string} url - server address
 * @param {string} name - application name
 */

const getToken = async (url, name) => {
  const response = await got(`${url}/json/system/requestApplicationToken?applicationName=${name}`, options).json()
  return response.result.applicationToken
}

/**
 * enable application token
 * caller must be logged in
 * @param {string} url - server address
 * @param {string} token - application token
 */

const enableToken = async (url, appToken, sessionToken) => {
  return await got(`${url}/json/system/enableToken?applicationToken=${appToken}&token=${sessionToken}`, options).json()
}

/**
 * revoke application token
 * caller must be logged in
 * @param {string} url - server address
 * @param {string} token - application token
 */

const revokeToken = async (url, token) => {
  return await got(`${url}/json/system/revokeToken?applicationToken=${token}`, options).json()
}

/**
 * create new session with application token
 * @param {string} url - server address
 * @param {string} token - application token
 */

const loginApplication = async (url, token) => {
  const response = await got(`${url}/json/system/loginApplication?loginToken=${token}`, options).json()
  return response.result.token
}

export default {
  loginUser,
  logoutUser,
  getToken,
  enableToken,
  revokeToken,
  loginApplication
}
