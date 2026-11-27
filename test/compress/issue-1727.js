keep_fnames_iife_class_initializer: {
    options = {
        defaults: true,
        keep_fnames: true,
        module: true,
    }
    mangle = {
        keep_fnames: true,
        module: true,
    }
    input: {
        var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
        var ResizeObserverSize, size;
        var init_size = __esmMin(() => {
            ResizeObserverSize = (function () {
                function ResizeObserverSize(inlineSize, blockSize) {
                    this.inlineSize = inlineSize;
                    this.blockSize = blockSize;
                    Object.freeze(this);
                }
                return ResizeObserverSize;
            })();
        });
        var init_calc = __esmMin(() => {
            init_size();
            size = function (a, b) {
                return new ResizeObserverSize(a || 0, b || 0);
            };
        });
        init_calc();
        console.log(JSON.stringify(size(1, 2)));
    }
    expect_stdout: '{"inlineSize":1,"blockSize":2}'
}
