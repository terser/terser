'use strict'

const assert = require('assert')
const Terser = require('../..')

describe('Terser (functional tests)', () => {
    it('does not have a __esModule property', () => {
        assert(!Terser.__esModule)
    })
})
