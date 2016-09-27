/**
 * Config builder unit tests
 */

'use strict'

var chai   = require('chai')
var expect = chai.expect
var builder = require('../main').configBuilder
var Path = require('path')

describe('Config builder module', function () {
    it('Should load a `.toml` config file', function () {
        var config = builder.build({
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            }
        })
        expect(config).to.eql({ a: 'a', b: 'b', c: 'c', d: { e: 'e', f: { g: '' } } })
    })

    it('Should validate env config file against a template', function () {
        builder.build({
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            }
        })
    })

    it('Should reject env config file that has missing key (compared to template)', function () {
        expect(builder.build.bind('params', {
            templateFile: Path.join(__dirname, './files/template2.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            }
        })).to.throw('Missing keys: d.f.h')
    })

    it('Should reject env config file that has missing mandatory key values', function () {
        expect(builder.build.bind('params', {
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            },
            mandatoryKeys: ['d.f.g']
        })).to.throw('Missing values for mandatory keys: d.f.g')
    })

    it('Should reject env config file that has missing mandatory key values (using `*` to signify that all keys are mandatory)', function () {
        expect(builder.build.bind('params', {
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            },
            mandatoryKeys: ['*']
        })).to.throw('Missing values for mandatory keys: d.f.g')
    })

    it('Should exclude key from mandatory keys when using the `-` prefix (using `*` to signify that all keys are mandatory)', function () {
        expect(builder.build.bind('params', {
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            },
            mandatoryKeys: ['*', '-d.f.g']
        })).to.not.throw()
    })
})
