/**
 * Config builder module
 */

'use strict'

var chalk = require('chalk')
var fs    = require('fs-extra')
var _     = require('lodash')

var helper = require('./helpers/config-builder.helper')

// Enable 'requiring' toml files
require('toml-require').install()

var env = process.env.NODE_ENV

/**
 * Builds a configuration object based on NODE_ENV and oprional static config
 *
 * @param   {Object}            [params]                builder params
 * @param   {String}            [params.template]       Path to config template file
 * @param   {Object}            [params.envConfig]      Key-value pairs: { 'env name': 'env config file' }, i.e. { dev: './config/dev.toml' }
 * @param   {String}            [params.staticConfig]   Path to static config
 * @param   {Array[String]}     [params.mandatoryKeys]  A list of keys that require values.
 *                                                      Add single keys, or use `*` to signify that all keys are mandatory
 *                                                      and prefix with `-` the keys you'd like to exclude
 *
 * @return  {Object}                                    A merged config object (static config + env config)
 */
function build (params) {
    if (!env || _.isEmpty(env)) {
        throw new Error(chalk.bold.red('`NODE_ENV` is not set!'))
    }

    if (_.isEmpty(params.envConfig)) {
        throw new Error(chalk.bold.red('[params.envConfig] is mandatory!'))
    }

    if (!fs.existsSync(params.envConfig[env])) {
        throw new Error(chalk.bold.red('Env config file is missing!'))
    }

    var envConfig
    var template
    var staticConfig = {}

    try {
        envConfig = require(params.envConfig[env])
    } catch (err) {
        console.error(chalk.bold.red('Unable to parse env config file: ' + err.message))
        throw err
    }

    // Validate against a template file, if provided:
    if (params.templateFile) {
        if (!fs.existsSync(params.templateFile)) {
            throw new Error(chalk.bold.red('Template file is missing!'))
        }

        try {
            template = require(params.templateFile)
        } catch (err) {
            console.error(chalk.bold.red('Unable to parse template file: ' + err.message))
            throw err
        }

        try {
            helper.validateTemplate(envConfig, template)
        } catch (err) {
            console.error(chalk.bold.red(err.message))
            throw err
        }
    }

    // Validate mandatory keys
    if (params.mandatoryKeys) {
        try {
            helper.validateMandatory(envConfig, params.mandatoryKeys)
        } catch (err) {
            console.error(chalk.bold.red(err.message))
            throw err
        }
    }

    if (params.staticConfig) {
        if (!fs.existsSync(params.staticConfig)) {
            throw new Error(chalk.bold.red('Static config file is missing!'))
        }

        try {
            staticConfig = require(params.staticConfig)
        } catch (err) {
            console.error(chalk.bold.red('Unable to parse static config file: ' + err.message))
            throw err
        }
    }

    return _.merge(staticConfig, envConfig)
}

module.exports = build
