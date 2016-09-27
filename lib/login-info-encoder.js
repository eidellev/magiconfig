/**
 * Login info encoder module
 */

'use strict'

var isNode = require('./helpers/env.helper').isNode()

module.exports = {
    /**
     * Base64 encodes username and password
     *
     * @param  {String} userName    Username
     * @param  {String} password    Password
     * @return {String}             Base64 encoded info
     */
    encode: function (userName, password) {
        if (isNode) {
            return new Buffer(JSON.stringify({
                userName: userName,
                password: password
            })).toString('base64')
        }

        return btoa(JSON.stringify({
            userName: userName,
            password: password
        }))
    },

    /**
     * Decodes base64 encoded login info
     *
     * @param  {String} loginData    Base64 encoded string
     * @return {Object} Login info
     */
    decode: function (loginData) {
        if (isNode) {
            return JSON.parse(new Buffer(loginData, 'base64').toString())
        }

        return JSON.parse(atob(loginData))
    }
}
