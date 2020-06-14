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
            esModule: false,
        },
        external: "source-map",
    };
};
