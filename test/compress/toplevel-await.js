'use strict'

// Tests for toplevel await need strict mode which messes with the other tests in async.js

/* eslint-ignore */

toplevel_await: {
    input: {
        'use strict';
        await x;
    }
    expect: {
        'use strict';
        await x;
    }
}

toplevel_await_for: {
    input: {
        'use strict'
        for await (const x of y) {
            foo();
        }
    }
    expect: {
        'use strict'
        for await (const x of y) foo();
    }
}
