'use strict'

const assert = require('assert')
const terser = require('../../')

describe('equivalent_to', () => {
    it('(regression) two regexes should not be equivalent if their source or flags differ', () => {
        const ast = terser.parse('/^\s*$/u')
        const ast2 = terser.parse('/^\s*\*/u')
        assert.equal(ast.equivalent_to(ast2), false)
    })
})

