/**
 * Type validation helepr
 */

'use strict'

const _ = require('lodash')

function handleNumber (value, path) {
    if (!_.isFinite(value)) {
        throw new Error(`Expected '${path}' to be a number (instead got '${value}' of type '${typeof value}')`)
    }
}

function handleBoolean (value, path) {
    if (!_.isBoolean(value)) {
        throw new Error(`Expected '${path}' to be boolean (instead got '${value}' of type '${typeof value}')`)
    }
}

function handleString (value, path) {
    if (!_.isString(value)) {
        throw new Error(`Expected '${path}' to be a string (instead got '${value}' of type '${typeof value}')`)
    }
}

function handleArray (value, path) {
    if (!_.isArray(value)) {
        throw new Error(`Expected '${path}' to be an array (instead got '${value}' of type '${typeof value}')`)
    }
}

function handleObject (value, path) {
    if (!_.isPlainObject(value)) {
        throw new Error(`Expected '${path}' to be an object (instead got '${value}' of type '${typeof value}')`)
    }
}

const typeDoctionary = {
    number: handleNumber,
    boolean: handleBoolean,
    string: handleString,
    array: handleArray,
    object: handleObject
}

module.exports = function (type, value, path) {
    const handler = typeDoctionary[type.toLowerCase()]

    if (!handler) {
        throw new Error(`Unknown type '${type}'`)
    }

    handler(value, path)
}
