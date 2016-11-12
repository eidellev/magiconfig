/**
 * Helper module
 */

'use strict'

const traverse      = require('traverse')
const _             = require('lodash')
const chalk         = require('chalk')
const fs            = require('fs-extra')
const Path          = require('path')
// The base path of the app that uses 'magiconfig'
const appRoot       = require('app-root-path').path
const typeValidator = require('./type-validation.helper')

// Allow 'requiring' TOML files
require('toml-require').install()
// Allow 'requireing' YAML files
require('require-yaml')

/**
 * Requires file and returns an object
 * @param  {String} file    File relative path
 * @return {Object}         File content serialized into object
 */
function _reqFile(file) {
    const path = Path.resolve(appRoot, file)

    if (!path) {
        throw new Error(chalk.bold.red(`File '${path}' not found!`))
    }

    if (!fs.existsSync(path)) {
        throw new Error(chalk.bold.red(`Env config '${path}' file is missing!`))
    }

    try {
        const data = require(path)

        return data
    } catch (err) {
        throw new Error(chalk.bold.red(`Unable to parse env config file: ${err.message}`))
    }
}

module.exports = {

    /**
     * Returns the app environment
     * @return {String} App environment (based on NODE_ENV)
     */
    getEnv: () => {
        const env = process.env.NODE_ENV

        if (!env) {
            throw new Error(chalk.bold.red('NODE_ENV is not set!'))
        }

        return env
    },

    /**
     * Returns environment config
     * @param  {Object} envConfig   Key-value pairs of environments and relative file paths
     * @param  {String} env         Environment name
     * @return {String}             Environment config
     */
    getEnvConfig: (envConfig, env) => {
        if (_.isEmpty(envConfig)) {
            throw new Error(chalk.bold.red('[params.envConfig] is mandatory!'))
        }

        if (!envConfig[env]) {
            throw new Error(chalk.bold.red(`Missing config for NODE_ENV=${env}`))
        }

        return _reqFile(envConfig[env])
    },

    /**
     * Returns config template
     * @param  {String} templateFile Template file relative path
     * @return {Object}              Config template
     */
    getTemplate: (templateFile) => {
        if (!templateFile) {
            return {}
        }

        return _reqFile(templateFile)
    },

    /**
     * Returns static config
     * @param  {String} staticConfig Static configrelative path
     * @return {Object}              Static config
     */
    getStaticConfig: (staticConfig) => {
        if (!staticConfig) {
            return {}
        }

        return _reqFile(staticConfig)
    },

    /**
     * Validates environment config against template.
     * When validation fails, throws error.
     * @param  {Object} envConfig Environment config
     * @param  {Object} template  Config template
     */
    validateAgainstTemplate: (envConfig, template, doTypeValidation = false) => {
        if (!template) {
            return
        }

        const missingKeys = []

        traverse(template).forEach(function () {
            const envParam = traverse(envConfig).get(this.path)
            const path = this.path.join('.')

            if (typeof envParam === 'undefined') {
                missingKeys.push(path)
            }

            if (this.isLeaf && doTypeValidation) {
                typeValidator(this.node, envParam, path)
            }
        })

        if (!_.isEmpty(missingKeys)) {
            throw new Error(chalk.bold.red(`Missing keys: ${missingKeys.join(', ')}`))
        }
    },

    /**
     * Validates environment config against list of mandatory keys
     * When validation fails, throws error.
     * @param  {Object} envConfig       Environment config
     * @param  {Array}  mandatoryKeys   Mandatory keys
     */
    validateMandatoryKeys: (envConfig, mandatoryKeys) => {
        if (!mandatoryKeys) {
            return
        }

        if (!_.isArray(mandatoryKeys)) {
            throw new Error(chalk.bold.red('Invalid mandatory keys parameters. Expected array!'))
        }

        var missingValues = []

        traverse(envConfig).forEach(function () {
            if (_.includes(mandatoryKeys, '-' + this.path.join('.'))) {
                return
            }

            if (this.isLeaf && (_.includes(mandatoryKeys, this.path.join('.')) || _.includes(mandatoryKeys, '*'))) {
                var value = traverse(envConfig).get(this.path)

                if (typeof value === 'string' && !value.trim().length) {
                    missingValues.push(this.path.join('.'))
                }
            }
        })

        if (!_.isEmpty(missingValues)) {
            throw new Error(chalk.bold.red(`Missing values for mandatory keys: ${missingValues.join(', ')}`))
        }
    },

    /**
     * Performas custom validation.
     * When validation fails, throws error.
     * @param  {Function}   validateFn   Validation function signature: `function(config, cb)`
     * @param  {Object}     config       Final config which is the result of merging static config with environment config
     */
    customValidate: (validateFn, config) => {
        if (!validateFn) {
            return
        }

        if (typeof validateFn !== 'function') {
            throw new Error(chalk.bold.red('[params.validate] must be a function!'))
        }

        validateFn(config, (err) => {
            if (err) {
                throw new Error(chalk.bold.red(err.message || 'Custom validation failed'))
            }
        })
    }
}
