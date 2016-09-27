'use strict'

var traverse = require('traverse')
var _        = require('lodash')

module.exports = {
    validateTemplate: function (envConfig, template) {
        var missingKeys = []

        traverse(template).forEach(function () {
            if (typeof traverse(envConfig).get(this.path) === 'undefined') {
                missingKeys.push(this.path.join('.'))
            }
        })

        if (!_.isEmpty(missingKeys)) {
            throw new Error('Missing keys: ' + missingKeys.join(', '))
        }
    },

    validateMandatory: function (envConfig, mandatoryKeys) {
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
            throw new Error('Missing values for mandatory keys: ' + missingValues.join(', '))
        }
    }
}
