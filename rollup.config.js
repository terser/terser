export default () => {
    return {
        input: "main.js",
        output: {
            file: "dist/bundle.min.js",
            format: "umd",
            globals: {
                "source-map": "sourceMap",
            },
            name: "Terser",
            sourcemap: true,
            sourcemapExcludeSources: true,
            esModule: false,
            indent: false
        },
        external: "source-map",
    };
};
