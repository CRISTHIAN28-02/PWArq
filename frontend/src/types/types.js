// Definiciones solo como comentario JSDoc para mantener referencia (no obligatorias en JS)

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} username
 */

/**
 * @typedef {Object} AuthResponse
 * @property {{ user: User, accessToken: string, refreshToken: string }} body
 */

/**
 * @typedef {Object} AuthResponseError
 * @property {{ error: string }} body
 */

/**
 * @typedef {Object} AccessTokenResponse
 * @property {number} statusCode
 * @property {{ accessToken: string }} body
 * @property {string} [error]
 */
