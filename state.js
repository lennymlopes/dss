const got = require('got')
const options = { https: { rejectUnauthorized: false } }

/**
 * get system state
 * @param {string} url - server address
 * @param {string} name - state identifier
 * @param {string} [addon] - owner of state, e.g.system-addon-user-defined-states
 */

const getState = async (url, token, name, addon = undefined) => {
  const urlString = `${url}/json/state/get?token=${token}&name=${name}`
  // urlString = addon ? urlString += `&addon=${addon}` : urlString
  const response = await got(urlString, options).json()
  return response.result.value
}

/**
 * set system state
 * @param {string} url - server address
 * @param {string} name - state identifier
 * @param {string} value - new value
 * @param {string} [addon] - owner of state, e.g.system-addon-user-defined-states
 */

const setState = async (url, token, name, value, addon = undefined) => {
  let urlString = `${url}/json/state/set?name=${name}&value=${value}&token=${token}`
  urlString = addon ? urlString += `&addon=${addon}` : urlString
  console.log(urlString)
  try {
    return await got(urlString, options).json()
  } catch (e) {
    return e
  }
}

module.exports = {
  getState,
  setState
}
