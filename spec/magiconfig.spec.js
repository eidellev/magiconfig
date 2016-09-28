/**
 * Magiconfig unit tests
 */

'use strict'

const chai       = require('chai')
const expect     = chai.expect
const magiconfig = require('../magiconfig')
const Path       = require('path')

describe('Config magiconfig module', () => {
    it('Should load a `.toml` config file', () => {
        const config = magiconfig({
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            }
        })
        expect(config).to.eql({ a: 'a', b: 'b', c: 'c', d: { e: 'e', f: { g: '' } } })
    })

    it('Should validate env config file against a template', () => {
        magiconfig({
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            }
        })
    })

    it('Should reject env config file that has missing key (compared to template)', () => {
        expect(magiconfig.bind('params', {
            templateFile: Path.join(__dirname, './files/template2.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            }
        })).to.throw('Missing keys: d.f.h')
    })

    it('Should reject env config file that has missing mandatory key values', () => {
        expect(magiconfig.bind('params', {
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            },
            mandatoryKeys: ['d.f.g']
        })).to.throw('Missing values for mandatory keys: d.f.g')
    })

    it('Should reject env config file that has missing mandatory key values (using `*` to signify that all keys are mandatory)', () => {
        expect(magiconfig.bind('params', {
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            },
            mandatoryKeys: ['*']
        })).to.throw('Missing values for mandatory keys: d.f.g')
    })

    it('Should exclude key from mandatory keys when using the `-` prefix (using `*` to signify that all keys are mandatory)', () => {
        expect(magiconfig.bind('params', {
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            },
            mandatoryKeys: ['*', '-d.f.g']
        })).to.not.throw()
    })

    it('Should exclude key from mandatory keys when using the `-` prefix (using `*` to signify that all keys are mandatory)', () => {
        expect(magiconfig.bind('params', {
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            },
            mandatoryKeys: ['*', '-d.f.g']
        })).to.not.throw()
    })

    it('Should pass custom validation)', () => {
        expect(magiconfig.bind('params', {
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            },
            validate: (config, cb) => {
                cb(null)
            }
        })).to.not.throw()
    })

    it('Should fail custom validation)', () => {
        expect(magiconfig.bind('params', {
            templateFile: Path.join(__dirname, './files/template.toml'),
            envConfig: {
                'test': Path.join(__dirname, './files/test.toml')
            },
            validate: (config, cb) => {
                cb(new Error('blah'))
            }
        })).to.throw()
    })
})
