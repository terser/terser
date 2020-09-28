import assert from "assert";

function decodeMap(mapData) {
    const buffer = new Buffer(mapData.replace('data:application/json;charset=utf-8;base64,', ''), 'base64');
    return JSON.parse(buffer.toString());
}

export function assertCodeWithInlineMapEquals(actual, expected) {
    if (actual === expected) return;
    const [actualCode, actualSourceMapData] = actual.split('//# sourceMappingURL=', 2);
    const [expectedCode, expectedSourceMapData] = expected.split('//# sourceMappingURL=', 2);
    const actualSourceMap = decodeMap(actualSourceMapData);
    const expectedSourceMap = decodeMap(expectedSourceMapData);
    assert.deepStrictEqual({code: actualCode, map: actualSourceMap}, {code: expectedCode, map: expectedSourceMap});
}

export async function for_each_async (array, async_fn) {
    for (const item of array) {
        await async_fn(item)
    }
}
