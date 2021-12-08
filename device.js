const got = require('got')
const options = { https: { rejectUnauthorized: false } }

/**
 * calls a device scene
 * @param {string} url - server address
 * @param {string} token - session token
 * @param {string} dsid - device digitalstrom id
 * @param {number} sceneNumber - scene number
 * @param {boolean} [force] - issue forced scene call
 */

const callScene = async (url, token, dsid, sceneNumber, force = undefined) => {
  let urlString = `${url}/json/device/callScene?token=${token}&dsid=${dsid}&sceneNumber=${sceneNumber}`
  urlString = force ? urlString += `&force=${force}` : urlString

  return await got(urlString, options).json()
}

/**
 * sets device value
 * @param {string} url - server address
 * @param {string} token - session token
 * @param {string} dsid - device digitalstrom id
 * @param {number} value - numerical 8 bit value (0-255)
 */

const setValue = async (url, token, dsid, value) => {
  let urlString = `${url}/json/device/callScene?token=${token}&dsid=${dsid}&value=${value}`

  return await got(urlString, options).json()
}

module.exports = {
  callScene,
  setValue
}
