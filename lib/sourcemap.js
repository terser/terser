/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

import {GenMapping, maybeAddMapping, toDecodedMap, toEncodedMap, setSourceContent} from "@jridgewell/gen-mapping";
import {AnyMap, originalPositionFor} from "@jridgewell/trace-mapping";
import {defaults, HOP} from "./utils/index.js";

// a small wrapper around source-map and @jridgewell/trace-mapping
function SourceMap(options) {
    options = defaults(options, {
        file : null,
        root : null,
        orig : null,
        files: {},
    });

    var orig_map;
    var generator = new GenMapping({
        file       : options.file,
        sourceRoot : options.root
    });

    let sourcesContent = {__proto__: null};
    let files = options.files;
    for (var name in files) if (HOP(files, name)) {
        sourcesContent[name] = files[name];
    }
    if (options.orig) {
        orig_map = new AnyMap(options.orig);
        if (orig_map.sourcesContent) {
            orig_map.resolvedSources.forEach(function(source, i) {
                var content = orig_map.sourcesContent[i];
                if (content) {
                    sourcesContent[source] = content;
                }
            });
        }
    }

    function add(source, gen_line, gen_col, orig_line, orig_col, name) {
        if (orig_map) {
            var info = originalPositionFor(orig_map, {
                line: orig_line,
                column: orig_col
            });
            if (info.source === null) {
                return;
            }
            source = info.source;
            orig_line = info.line;
            orig_col = info.column;
            name = info.name || name;
        }
        maybeAddMapping(generator, {
            generated : { line: gen_line, column: gen_col },
            original  : { line: orig_line, column: orig_col },
            source    : source,
            name      : name
        });
        setSourceContent(generator, source, sourcesContent[source]);
    }

    function clean(map) {
        const allNull = map.sourcesContent.every(c => c == null);
        if (allNull) delete map.sourcesContent;
        if (map.file === undefined) delete map.file;
        if (map.sourceRoot === undefined) delete map.sourceRoot;
        return map;
    }

    return {
        add             : add,
        getDecoded      : function() { return clean(toDecodedMap(generator)); },
        getEncoded      : function() { return clean(toEncodedMap(generator)); },
    };
}

export {
    SourceMap,
};
