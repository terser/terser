"use strict"

var Console = require("console").Console;

if (process.version.slice(0, 3) === "v10") {
    global.console = new Console({
        stdout: process.stdout,
        stderr: process.stderr,
        colorMode: false
    });
}

