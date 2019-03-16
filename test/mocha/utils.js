function decodeMap(mapData) {
    const buffer = new Buffer(mapData.replace('data:application/json;charset=utf-8;base64,', ''), 'base64');
    return JSON.parse(buffer.toString());
}

function assertCodeWithInlineMapEquals(actual, expected) {
    if (actual === expected) return;
    const [actualCode, actualSourceMapData] = actual.split('//# sourceMappingURL=', 2);
    const [expectedCode, expectedSourceMapData] = expected.split('//# sourceMappingURL=', 2);
    const actualSourceMap = decodeMap(actualSourceMapData);
    const expectedSourceMap = decodeMap(expectedSourceMapData);
    assert.deepStrictEqual({code: actualCode, map: actualSourceMap}, {code: expectedCode, map: expectedSourceMap});
}

module.exports.assertCodeWithInlineMapEquals = assertCodeWithInlineMapEquals;
