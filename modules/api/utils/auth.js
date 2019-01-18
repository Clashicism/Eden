/**
 * Authenticates a given APIKey
 * @author The Gateway Project Developers <hello@gateway.cash>
 */
let mysql = require('./SQLWrapper')
let handleError = require('./handleError')

module.exports = async (APIKey, res) => {
  // fail if no API key was provided
  if (!APIKey) {
    return handleError(
      'No API Key',
      'An API key is required in order to use this endpoint.',
      res
    )
  }

  // search the APIKeys table for the key
  let response = await mysql.query(
    `SELECT
      userIndex,
      active,
      revokedDate
    FROM APIKeys
    WHERE
      APIKey = ?
    LIMIT 1`,
    [APIKey]
  )

  // fail if the key was not found
  if (response.length !== 1) {
    return handleError(
      'API Key Not Found',
      'The API key you provided could not be found',
      res
    )
  }

  // fail if the key was deactivated
  if (response.active !== 1) {
    return handleError(
      'API Key Not Active',
      'This API key was deactivated on ' + response.revokedDate,
      res
    )
  }

  // return the userIndex
  return response.userIndex
}
