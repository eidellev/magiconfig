/**
 * Config builder module
 */

'use strict'

const _ = require('lodash')

const helper = require('./helpers/magiconfig.helper')

/**
 * Builds a configuration object based on NODE_ENV and oprional static config
 *
 * @param   {Object}            [params]                builder params
 * @param   {String}            [params.template]       Path to config template file
 * @param   {Object}            [params.envConfig]      Key-value pairs: { 'env name': 'env config file' }, i.e. { dev: './config/dev.toml' }
 * @param   {String}            [params.staticConfig]   Path to static config
 * @param   {Function}          [params.validate]       Custom validation function
 * @param   {Array[String]}     [params.mandatoryKeys]  A list of keys that require values.
 *                                                      Add single keys, or use `*` to signify that all keys are mandatory
 *                                                      and prefix with `-` the keys you'd like to exclude
 *
 * @return  {Object}                                    A merged config object (static config + env config)
 */
function build (params) {
    const env          = helper.getEnv()
    const envConfig    = helper.getEnvConfig(params.envConfig, env)
    const template     = helper.getTemplate(params.templateFile)
    const staticConfig = helper.getStaticConfig(params.staticConfig)

    helper.validateAgainstTemplate(envConfig, template)
    helper.validateMandatoryKeys(envConfig, params.mandatoryKeys)

    const finalConfig = _.merge(staticConfig, envConfig)
    helper.customValidate(params.validate, finalConfig)

    return finalConfig
}

module.exports = build
