'use strict'

const traverse = require('traverse')
const _        = require('lodash')
const chalk    = require('chalk')
const fs       = require('fs-extra')
const Path     = require('path')
const appRoot  = require('app-root-path').path

// Allow 'requiring' TOML files
require('toml-require').install()
// Allow 'requireing' YAML files
require('require-yaml')

module.exports = {
    getEnv: () => {
        const env = process.env.NODE_ENV

        if (!env) {
            throw new Error(chalk.bold.red('NODE_ENV is not set!'))
        }

        return env
    },

    getEnvConfig: (envConfig, env) => {
        if (_.isEmpty(envConfig)) {
            throw new Error(chalk.bold.red('[params.envConfig] is mandatory!'))
        }

        console.log(appRoot)
        const path = Path.resolve(appRoot, envConfig[env])
        if (!path) {
            throw new Error(chalk.bold.red(`There is no config path for ENV=${env}`))
        }

        if (!fs.existsSync(path)) {
            throw new Error(chalk.bold.red(`Env config '${path}' file is missing!`))
        }

        try {
            const config = require(path)

            return config
        } catch (err) {
            console.error(chalk.bold.red(`Unable to parse env config file: ${err.message}`))
            throw err
        }
    },

    getTemplate: (templateFile) => {
        if (!templateFile) {
            return {}
        }

        const path = Path.resolve(appRoot, templateFile)

        if (!fs.existsSync(path)) {
            throw new Error(chalk.bold.red(`Template file '${path}' is missing!`))
        }

        try {
            const template = require(path)

            return template
        } catch (err) {
            console.error(chalk.bold.red(`Unable to parse template file: ${err.message}`))
            throw err
        }
    },

    getStaticConfig: (staticConfig) => {
        if (!staticConfig) {
            return {}
        }

        const path = Path.resolve(appRoot, staticConfig)

        if (!fs.existsSync(path)) {
            throw new Error(chalk.bold.red(`Static config file '${path}' is missing!`))
        }

        try {
            const config = require(path)

            return config
        } catch (err) {
            console.error(chalk.bold.red(`Unable to parse static config file: ${err.message}`))
            throw err
        }
    },

    validateAgainstTemplate: (envConfig, template) => {
        if (!template) {
            return
        }

        const missingKeys = []

        traverse(template).forEach(function () {
            if (typeof traverse(envConfig).get(this.path) === 'undefined') {
                missingKeys.push(this.path.join('.'))
            }
        })

        if (!_.isEmpty(missingKeys)) {
            throw new Error(chalk.bold.red(`Missing keys: ${missingKeys.join(', ')}`))
        }
    },

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
