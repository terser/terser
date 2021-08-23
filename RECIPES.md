## Terser for Gulp
An example of how you can use the Terser plugin in your Gulp build.
```javascript
const { src, dest, series } = require('gulp');
const { minify } = require('terser');
function js() {
    const options = {
        parse: {
            bare_returns: true, // (default false) -- support top level return statements.
            html5_comments: true, // (default true)
            shebang: true // (default true) -- support #!command as the first line.
        }
    };
    return src('app/**/*.js')
        .on('data', function(file) {
            async function getJs() {
                const result = await minify(file.contents.toString(), options);
                return await minify(result)
            }
            (async function() {
                try {
                    file.contents = Buffer.from(JSON.parse(Buffer.from(JSON.stringify(await getJs()))).code)
                } catch (error) {
                    const { message, line, col, pos } = error
                    console.log('message: ' + message)
                    console.log('filename: ' + file.basename)
                    console.log('line: ' + line)
                    console.log('col: ' + col)
                    console.log('pos: ' + pos)
                }
            })();
        })
        .pipe(dest('build'))
}
exports.js = series(js)
```
