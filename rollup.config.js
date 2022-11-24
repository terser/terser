export default () => {
    return {
        input: "main.js",
        output: {
            file: "dist/bundle.min.js",
            format: "umd",
            globals: {
                "@jridgewell/source-map": "sourceMap",
            },
            name: "Terser",
            sourcemap: false,
            sourcemapExcludeSources: true,
            esModule: false,
            indent: false
        },
        external: "source-map",
    };
};
