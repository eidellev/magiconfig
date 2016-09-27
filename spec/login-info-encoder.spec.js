'use strict'

var chai   = require('chai')
var expect = chai.expect
var encoder = require('../main').loginInfoEncoder

describe('Login info encoder module', function () {
    it('Should encode login info', function () {
        var encoded = encoder.encode('hello', 'world')
        expect(encoded).to.equal('eyJ1c2VyTmFtZSI6ImhlbGxvIiwicGFzc3dvcmQiOiJ3b3JsZCJ9')
    })

    it('Should decode login info', function () {
        var decoded = encoder.decode('eyJ1c2VyTmFtZSI6ImhlbGxvIiwicGFzc3dvcmQiOiJ3b3JsZCJ9')
        expect(decoded).to.eql({ userName: 'hello', password: 'world' })
    })
})
