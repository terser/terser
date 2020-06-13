"use strict"

import { Console } from "console";

global.console = new Console({
    stdout: process.stdout,
    stderr: process.stderr,
    colorMode: false
});

