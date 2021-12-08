const got = require('got')
const options = { https: { rejectUnauthorized: false } }

/**
 * calls a apartment scene
 * @param {string} url - server address
 * @param {number} sceneNumber - scene number
 * @param {number} [groupID] - group id
 * @param {string} [groupName] - group name
 * @param {boolean} [force] - issue forced scene call
 */

const callScene = async (url, token, sceneNumber, groupID = undefined, groupName = undefined, force = undefined) => {
  let urlString = `${url}/json/apartment/callScene?token=${token}&sceneNumber=${sceneNumber}`
  urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
  urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
  urlString = force ? urlString += `&force=${force}` : urlString
  return await got(urlString, options).json()
}

/**
 * undoes a apartment scene
 * @param {string} url - server address
 * @param {number} sceneNumber - scene number
 * @param {number} [groupID] - group id
 * @param {string} [groupName] - group name
 */

const undoScene = async (url, token, sceneNumber, groupID = undefined, groupName = undefined) => {
  let urlString = `${url}/json/apartment/undoScene?token=${token}&sceneNumber=${sceneNumber}`
  urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
  urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
  return await got(urlString, options).json()
}

/**
 * returns apartment structure,
 * includes detailed information about all zones, groups and devices.
 * @param {string} url - server address
 */

const getStructure = async (url, token) => {
  const response = await got(`${url}/json/apartment/getStructure?token=${token}`, options).json()
  return response.result.apartment
}

/**
 * returns all devices,
 * @param {string} url - server address
 */

const getDevices = async (url, token) => {
  const response = await got(`${url}/json/apartment/getDevices?token=${token}`, options).json()
  return response.result
}

/**
 * returns apartment name
 * @param {string} url - server address
 */

const getName = async (url, token) => {
  const response = await got(`${url}/json/apartment/getName?token=${token}`, options).json()
  return response.result.name
}

/**
 * sets output value of all devices of a specified group (not recommended)
 * @param {string} url - server address
 * @param {number} value - numerical value
 * @param {number} groupID - group id
 * @param {string} groupName - group name
 */

const setGroupValue = async (url, token, value, groupID = undefined, groupName = undefined) => {
  let urlString = `${url}/json/apartment/setValue?token=${token}&value=${value}`
  urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
  urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
  const response = await got(urlString, options).json()
  return response.data
}

module.exports = {
  callScene,
  undoScene,
  getStructure,
  getDevices,
  getName
}
