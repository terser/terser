drop_assert_1: {
    options = {}
    input: {
        assert.equal(true, true);
        assert.equal.apply(assert, arguments);
    }
    expect: {
        assert.equal(true, true);
        assert.equal.apply(assert, arguments);
    }
}

drop_assert_2: {
    options = {
        drop_assert: true,
    }
    input: {
        assert.equal(true, true);
        assert.equal.apply(assert, arguments);
    }
    expect: {
        // with regular compression these will be stripped out as well
        void 0;
        void 0;
    }
}