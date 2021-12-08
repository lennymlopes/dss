const got = require('got')
const options = { https: { rejectUnauthorized: false } }

/**
 * calls a apartment scene
 * @param {string} url - server address
 * @param {number} id - zone id
 * @param {number} sceneNumber - scene number
 * @param {number} [groupID] - group id
 * @param {string} [groupName] - group name
 * @param {boolean} [force] - issue forced scene call
 */

const callScene = async (url, token, id, sceneNumber, groupID = undefined, groupName = undefined, force = undefined) => {
  let urlString = `${url}/json/zone/callScene?token=${token}&id=${id}&sceneNumber=${sceneNumber}`
  urlString = groupID ? urlString += `&groupID=${groupID}` : urlString
  urlString = groupName ? urlString += `&groupName=${groupName}` : urlString
  urlString = force ? urlString += `&force=${force}` : urlString

  return await got(urlString, options).json()
}

module.exports = {
  callScene
}
