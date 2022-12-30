
terser
/
terser
Público
🗜Kit de herramientas de analizador, triturador y compresor de JavaScript para ES6+

terser.org
Licencia
 Ver licencia
 7.6k estrellas 340 tenedores 
Código
Cuestiones
251
Solicitudes de extracción
22
Comportamiento
Proyectos
wiki
Seguridad
Perspectivas
terser / terser
Última confirmación
@fabiosantoscode
fabiosantoscode
…
last month
Estadísticas de Git
archivos
LÉAME.md
Terser
Versión de MNP Descargas de MNP Construir Travis Contribuyentes financieros de Opencollective

Un juego de herramientas de trituración/compresión de JavaScript para ES6+.

nota : Puedes apoyar este proyecto en patreon: [enlace] Terser Patreon se está cerrando a favor de opencollective . Visite PATRONS.md para conocer a nuestros patrocinadores de primer nivel.

Terser recomienda que use RollupJS para agrupar sus módulos, ya que eso produce un código más pequeño en general.

Embellecimiento no se ha documentado y se eliminará de terser, le recomendamos que use más bonito .

Encuentre el registro de cambios en CHANGELOG.md

¿Por qué elegir terser?
uglify-esya no se mantiene y uglify-jsno es compatible con ES6+.

terseres una bifurcación uglify-esque en su mayoría conserva la compatibilidad de API y CLI con uglify-esy uglify-js@3.

Instalar
Primero, asegúrese de haber instalado la última versión de node.js (es posible que deba reiniciar su computadora después de este paso).

De NPM para usar como una aplicación de línea de comandos:

npm install terser -g
De NPM para uso programático:

npm install terser
Uso de la línea de comandos
terser [input files] [options]
Terser puede tomar múltiples archivos de entrada. Se recomienda pasar primero los archivos de entrada y luego pasar las opciones. Terser analizará los archivos de entrada en secuencia y aplicará las opciones de compresión. Los archivos se analizan en el mismo ámbito global, es decir, una referencia de un archivo a alguna variable/función declarada en otro archivo coincidirá correctamente.

Los argumentos de la línea de comandos que toman opciones (como --parse, --compress, --mangle y --format) pueden tomar una lista separada por comas de anulaciones de opciones predeterminadas. Por ejemplo:

terser input.js --compress ecma=2015,computed_props=false
Si no se especifica ningún archivo de entrada, Terser leerá desde STDIN.

Si desea pasar sus opciones antes que los archivos de entrada, sepárelos con un guión doble para evitar que los archivos de entrada se utilicen como argumentos de opción:

terser --compress --mangle -- input.js
Opciones de la línea de comandos
    -h, --help                  Print usage information.
                                `--help options` for details on available options.
    -V, --version               Print version number.
    -p, --parse <options>       Specify parser options:
                                `acorn`  Use Acorn for parsing.
                                `bare_returns`  Allow return outside of functions.
                                                Useful when minifying CommonJS
                                                modules and Userscripts that may
                                                be anonymous function wrapped (IIFE)
                                                by the .user.js engine `caller`.
                                `expression`  Parse a single expression, rather than
                                              a program (for parsing JSON).
                                `spidermonkey`  Assume input files are SpiderMonkey
                                                AST format (as JSON).
    -c, --compress [options]    Enable compressor/specify compressor options:
                                `pure_funcs`  List of functions that can be safely
                                              removed when their return values are
                                              not used.
    -m, --mangle [options]      Mangle names/specify mangler options:
                                `reserved`  List of names that should not be mangled.
    --mangle-props [options]    Mangle properties/specify mangler options:
                                `builtins`  Mangle property names that overlaps
                                            with standard JavaScript globals and DOM
                                            API props.
                                `debug`  Add debug prefix and suffix.
                                `keep_quoted`  Only mangle unquoted properties, quoted
                                               properties are automatically reserved.
                                               `strict` disables quoted properties
                                               being automatically reserved.
                                `regex`  Only mangle matched property names.
                                `reserved`  List of names that should not be mangled.
    -f, --format [options]      Specify format options.
                                `preamble`  Preamble to prepend to the output. You
                                            can use this to insert a comment, for
                                            example for licensing information.
                                            This will not be parsed, but the source
                                            map will adjust for its presence.
                                `quote_style`  Quote style:
                                               0 - auto
                                               1 - single
                                               2 - double
                                               3 - original
                                `wrap_iife`  Wrap IIFEs in parenthesis. Note: you may
                                             want to disable `negate_iife` under
                                             compressor options.
                                `wrap_func_args`  Wrap function arguments in parenthesis.
    -o, --output <file>         Output file path (default STDOUT). Specify `ast` or
                                `spidermonkey` to write Terser or SpiderMonkey AST
                                as JSON to STDOUT respectively.
    --comments [filter]         Preserve copyright comments in the output. By
                                default this works like Google Closure, keeping
                                JSDoc-style comments that contain e.g. "@license",
                                or start with "!". You can optionally pass one of the
                                following arguments to this flag:
                                - "all" to keep all comments
                                - `false` to omit comments in the output
                                - a valid JS RegExp like `/foo/` or `/^!/` to
                                keep only matching comments.
                                Note that currently not *all* comments can be
                                kept when compression is on, because of dead
                                code removal or cascading statements into
                                sequences.
    --config-file <file>        Read `minify()` options from JSON file.
    -d, --define <expr>[=value] Global definitions.
    --ecma <version>            Specify ECMAScript release: 5, 2015, 2016, etc.
    -e, --enclose [arg[:value]] Embed output in a big function with configurable
                                arguments and values.
    --ie8                       Support non-standard Internet Explorer 8.
                                Equivalent to setting `ie8: true` in `minify()`
                                for `compress`, `mangle` and `format` options.
                                By default Terser will not try to be IE-proof.
    --keep-classnames           Do not mangle/drop class names.
    --keep-fnames               Do not mangle/drop function names.  Useful for
                                code relying on Function.prototype.name.
    --module                    Input is an ES6 module. If `compress` or `mangle` is
                                enabled then the `toplevel` option will be enabled.
    --name-cache <file>         File to hold mangled name mappings.
    --safari10                  Support non-standard Safari 10/11.
                                Equivalent to setting `safari10: true` in `minify()`
                                for `mangle` and `format` options.
                                By default `terser` will not work around
                                Safari 10/11 bugs.
    --source-map [options]      Enable source map/specify source map options:
                                `base`  Path to compute relative paths from input files.
                                `content`  Input source map, useful if you're compressing
                                           JS that was generated from some other original
                                           code. Specify "inline" if the source map is
                                           included within the sources.
                                `filename`  Name and/or location of the output source.
                                `includeSources`  Pass this flag if you want to include
                                                  the content of source files in the
                                                  source map as sourcesContent property.
                                `root`  Path to the original source to be included in
                                        the source map.
                                `url`  If specified, path to the source map to append in
                                       `//# sourceMappingURL`.
    --timings                   Display operations run time on STDERR.
    --toplevel                  Compress and/or mangle variables in top level scope.
    --wrap <name>               Embed everything in a big function, making the
                                “exports” and “global” variables available. You
                                need to pass an argument to this option to
                                specify the name that your module will take
                                when included in, say, a browser.
Especifique --output( -o) para declarar el archivo de salida. De lo contrario, la salida va a STDOUT.

Opciones de mapa fuente CLI
Terser puede generar un archivo de mapa fuente, que es muy útil para depurar su JavaScript comprimido. Para obtener un mapa de origen, pase --source-map --output output.js(el mapa de origen se escribirá en output.js.map).

Opciones adicionales:

--source-map "filename='<NAME>'"para especificar el nombre del mapa de origen.

--source-map "root='<URL>'"para pasar la URL donde se pueden encontrar los archivos originales.

--source-map "url='<URL>'"para especificar la URL donde se puede encontrar el mapa de origen. De lo contrario, Terser asume X-SourceMapque se está utilizando HTTP y omitirá la //# sourceMappingURL=directiva.

Por ejemplo:

terser js/file1.js js/file2.js \
         -o foo.min.js -c -m \
         --source-map "root='http://foo.com/src',url='foo.min.js.map'"
Lo anterior se comprimirá y destrozará file1.jsy file2.jscolocará la salida foo.min.jsy el mapa de origen en foo.min.js.map. El mapeo de origen se referirá a http://foo.com/src/js/file1.jsy http://foo.com/src/js/file2.js(de hecho, aparecerá http://foo.com/src como la raíz del mapa de origen y los archivos originales como js/file1.jsy js/file2.js).

Mapa fuente compuesto
Cuando está comprimiendo código JS generado por un compilador como CoffeeScript, la asignación al código JS no será muy útil. En su lugar, le gustaría volver a mapear al código original (es decir, CoffeeScript). Terser tiene una opción para tomar un mapa de fuente de entrada. Suponiendo que tiene un mapeo de CoffeeScript → JS compilado, Terser puede generar un mapa desde CoffeeScript → JS comprimido asignando cada token en el JS compilado a su ubicación original.

Para usar esta función, pase --source-map "content='/path/to/input/source.map'" o --source-map "content=inline"si el mapa de origen se incluye en línea con las fuentes.

Opciones de compresión CLI
Necesita pasar --compress( -c) para habilitar el compresor. Opcionalmente, puede pasar una lista separada por comas de opciones de compresión .

Las opciones tienen la forma foo=bar, o simplemente foo(la última implica una opción booleana que desea configurar true; es efectivamente un atajo para foo=true).

Ejemplo:

terser file.js -c toplevel,sequences=false
Opciones de manipulación de la CLI
Para habilitar el triturador, debe pasar --mangle( -m). Se admiten las siguientes opciones (separadas por comas):

toplevel(predeterminado false) -- nombres de mangle declarados en el ámbito de nivel superior.

eval(predeterminado false) -- nombres de mangle visibles en ámbitos donde se usa evalo with.

Cuando la manipulación está habilitada pero desea evitar que ciertos nombres se alteren, puede declarar esos nombres con --mangle reserved: pasar una lista de nombres separados por comas. Por ejemplo:

terser ... -m reserved=['$','require','exports']
para evitar que se cambien los requirenombres y exports.$

CLI que manipula nombres de propiedades ( --mangle-props)
Nota: ESTO ROMPERÁ SU CÓDIGO. Una buena regla general es no usar esto a menos que sepa exactamente lo que está haciendo y cómo funciona y lea esta sección hasta el final.

La manipulación de nombres de propiedades es un paso separado, diferente de la manipulación de nombres de variables. Pase --mangle-propspara habilitarlo. La forma menos peligrosa de usar esto es usar la regexopción así:

terser example.js -c -m --mangle-props regex=/_$/
Esto destruirá todas las propiedades que terminen con un guión bajo. Así que puedes usarlo para destrozar métodos internos.

De forma predeterminada, alterará todas las propiedades en el código de entrada con la excepción de las propiedades DOM integradas y las propiedades en las clases principales de JavaScript, que es lo que romperá su código si no lo hace:

Controla todo el código que estás manipulando
Evite usar un paquete de módulos, ya que generalmente llamarán a Terser en cada archivo individualmente, lo que hace imposible pasar objetos destrozados entre módulos.
Evite llamar a funciones como definePropertyo hasOwnProperty, porque se refieren a las propiedades del objeto mediante cadenas y romperán su código si no sabe lo que está haciendo.
Un ejemplo:

// example.js
var x = {
    baz_: 0,
    foo_: 1,
    calc: function() {
        return this.foo_ + this.baz_;
    }
};
x.bar_ = 2;
x["baz_"] = 3;
console.log(x.calc());
Destrozar todas las propiedades (excepto JavaScript builtins) ( muy inseguro):

$ terser example.js -c passes=2 -m --mangle-props
var x={o:3,t:1,i:function(){return this.t+this.o},s:2};console.log(x.i());
Destrozar todas las propiedades excepto las reservedpropiedades (aún muy inseguras):

$ terser example.js -c passes=2 -m --mangle-props reserved=[foo_,bar_]
var x={o:3,foo_:1,t:function(){return this.foo_+this.o},bar_:2};console.log(x.t());
Destruya todas las propiedades que coincidan con a regex(no tan inseguras pero aún inseguras):

$ terser example.js -c passes=2 -m --mangle-props regex=/_$/
var x={o:3,t:1,calc:function(){return this.t+this.o},i:2};console.log(x.calc());
Combinando opciones de propiedades de mangle:

$ terser example.js -c passes=2 -m --mangle-props regex=/_$/,reserved=[bar_]
var x={o:3,t:1,calc:function(){return this.t+this.o},bar_:2};console.log(x.calc());
Para que esto sea útil, evitamos manipular los nombres JS estándar y las propiedades de la API DOM de forma predeterminada ( --mangle-props builtinspara anular).

Se puede usar una expresión regular para definir qué nombres de propiedad deben modificarse. Por ejemplo, --mangle-props regex=/^_/solo alterará los nombres de propiedades que comiencen con un guión bajo.

Cuando comprime varios archivos usando esta opción, para que funcionen juntos al final, debemos asegurarnos de alguna manera de que una propiedad se manipule con el mismo nombre en todos ellos. Para ello, pass --name-cache filename.json y Terser mantendrán estos mapeos en un archivo que luego podrá ser reutilizado. Debe estar inicialmente vacío. Ejemplo:

$ rm -f /tmp/cache.json  # start fresh
$ terser file1.js file2.js --mangle-props --name-cache /tmp/cache.json -o part1.js
$ terser file3.js file4.js --mangle-props --name-cache /tmp/cache.json -o part2.js
Ahora, part1.jsy part2.jsserán consistentes entre sí en términos de nombres de propiedad destrozados.

No es necesario usar el caché de nombres si comprime todos sus archivos en una sola llamada a Terser.

Destrozando nombres sin comillas ( --mangle-props keep_quoted)
El uso de nombre de propiedad entre comillas ( o["foo"]) reserva el nombre de propiedad ( foo) para que no se altere en todo el script, incluso cuando se usa en un estilo sin comillas ( o.foo). Ejemplo:

// stuff.js
var o = {
    "foo": 1,
    bar: 3
};
o.foo += o.bar;
console.log(o.foo);
$ terser stuff.js --mangle-props keep_quoted -c -m
var o={foo:1,o:3};o.foo+=o.o,console.log(o.foo);
Depuración de la manipulación del nombre de la propiedad
También puede pasar --mangle-props debugpara alterar los nombres de las propiedades sin oscurecerlos por completo. Por ejemplo, la propiedad o.foo se destrozaría o._$foo$_con esta opción. Esto permite la manipulación de propiedades de una gran base de código sin dejar de depurar el código e identificar dónde la manipulación está rompiendo las cosas.

$ terser stuff.js --mangle-props debug -c -m
var o={_$foo$_:1,_$bar$_:3};o._$foo$_+=o._$bar$_,console.log(o._$foo$_);
También puede pasar un sufijo personalizado usando --mangle-props debug=XYZ. Esto entonces se destrozaría o.fooa o._$foo$XYZ_. Puede cambiar esto cada vez que compila un script para identificar cómo se destruyó una propiedad. Una técnica es pasar un número aleatorio en cada compilación para simular el cambio de manipulación con diferentes entradas (por ejemplo, al actualizar el script de entrada con nuevas propiedades) y para ayudar a identificar errores como escribir claves alteradas en el almacenamiento.

Referencia de la API
Asumiendo la instalación a través de NPM, puede cargar Terser en su aplicación de esta manera:

const { minify } = require("terser");
O,

import { minify } from "terser";
También se admite la carga del navegador:

<script src="https://cdn.jsdelivr.net/npm/source-map@0.7.3/dist/source-map.js"></script>
<script src="https://cdn.jsdelivr.net/npm/terser/dist/bundle.min.js"></script>
Hay una única función asíncrona de alto nivel async minify(code, options), que realizará todas las fases de minificación de forma configurable. Por defecto minify()habilitará compress y mangle. Ejemplo:

var code = "function add(first, second) { return first + second; }";
var result = await minify(code, { sourceMap: true });
console.log(result.code);  // minified output: function add(n,d){return n+d}
console.log(result.map);  // source map
Puede tener minifymás de un archivo JavaScript a la vez usando un objeto para el primer argumento donde las claves son nombres de archivo y los valores son código fuente:

var code = {
    "file1.js": "function add(first, second) { return first + second; }",
    "file2.js": "console.log(add(1 + 2, 3 + 4));"
};
var result = await minify(code);
console.log(result.code);
// function add(d,n){return d+n}console.log(add(3,7));
La toplevelopción:

var code = {
    "file1.js": "function add(first, second) { return first + second; }",
    "file2.js": "console.log(add(1 + 2, 3 + 4));"
};
var options = { toplevel: true };
var result = await minify(code, options);
console.log(result.code);
// console.log(3+7);
La nameCacheopción:

var options = {
    mangle: {
        toplevel: true,
    },
    nameCache: {}
};
var result1 = await minify({
    "file1.js": "function add(first, second) { return first + second; }"
}, options);
var result2 = await minify({
    "file2.js": "console.log(add(1 + 2, 3 + 4));"
}, options);
console.log(result1.code);
// function n(n,r){return n+r}
console.log(result2.code);
// console.log(n(3,7));
Puede conservar el caché de nombres en el sistema de archivos de la siguiente manera:

var cacheFileName = "/tmp/cache.json";
var options = {
    mangle: {
        properties: true,
    },
    nameCache: JSON.parse(fs.readFileSync(cacheFileName, "utf8"))
};
fs.writeFileSync("part1.js", await minify({
    "file1.js": fs.readFileSync("file1.js", "utf8"),
    "file2.js": fs.readFileSync("file2.js", "utf8")
}, options).code, "utf8");
fs.writeFileSync("part2.js", await minify({
    "file3.js": fs.readFileSync("file3.js", "utf8"),
    "file4.js": fs.readFileSync("file4.js", "utf8")
}, options).code, "utf8");
fs.writeFileSync(cacheFileName, JSON.stringify(options.nameCache), "utf8");
Un ejemplo de una combinación de minify()opciones:

var code = {
    "file1.js": "function add(first, second) { return first + second; }",
    "file2.js": "console.log(add(1 + 2, 3 + 4));"
};
var options = {
    toplevel: true,
    compress: {
        global_defs: {
            "@console.log": "alert"
        },
        passes: 2
    },
    format: {
        preamble: "/* minified */"
    }
};
var result = await minify(code, options);
console.log(result.code);
// /* minified */
// alert(10);"
Un ejemplo de error:

try {
    const result = await minify({"foo.js" : "if (0) else console.log(1);"});
    // Do something with result
} catch (error) {
    const { message, filename, line, col, pos } = error;
    // Do something with error
}
Minificar opciones
ecma(predeterminado undefined): pase 5, 2015, 2016, etc. para anular las opciones de compressy .formatecma

enclose(predeterminado false) - pase true, o una cadena en el formato de "args[:values]", donde argsy valuesson nombres y valores de argumentos separados por comas, respectivamente, para incrustar la salida en una función grande con los argumentos y valores configurables.

parse(predeterminado {}): pase un objeto si desea especificar algunas opciones de análisis adicionales .

compress(predeterminado {}): pase falsepara omitir la compresión por completo. Pase un objeto para especificar opciones de compresión personalizadas .

mangle(predeterminado true): pase falsepara omitir la manipulación de nombres, o pase un objeto para especificar las opciones de manipulación (ver más abajo).

mangle.properties(predeterminado false): una subcategoría de la opción mangle. Pase un objeto para especificar opciones personalizadas de propiedad de mangle .
module(predeterminado false): se usa al minimizar un módulo ES6. El "uso estricto" está implícito y los nombres se pueden alterar en el alcance superior. Si compresso mangleestá habilitado, la toplevelopción estará habilitada.

formato output(predeterminado null): pase un objeto si desea especificar opciones de formato adicionales . Los valores predeterminados están optimizados para una mejor compresión.

sourceMap(predeterminado false): pase un objeto si desea especificar las opciones del mapa de origen .

toplevel(predeterminado false): configúrelo truesi desea habilitar la modificación de nombres de funciones y variables de nivel superior y descartar variables y funciones no utilizadas.

nameCache(predeterminado null): pase un objeto vacío {}o un nameCacheobjeto utilizado anteriormente si desea almacenar en caché nombres de propiedades y variables alterados en varias invocaciones de minify(). Nota: esta es una propiedad de lectura/escritura. minify()leerá el estado de caché de nombre de este objeto y lo actualizará durante la minificación para que el usuario pueda reutilizarlo o conservarlo externamente.

ie8(predeterminado false): configurado truepara admitir IE8.

keep_classnames(predeterminado: undefined) - pase truepara evitar descartar o alterar los nombres de las clases. Pase una expresión regular para que solo los nombres de las clases coincidan con esa expresión regular.

keep_fnames(predeterminado: false) - pase truepara evitar descartar o alterar los nombres de las funciones. Pase una expresión regular para que solo los nombres de las funciones coincidan con esa expresión regular. Útil para el código que se basa en Function.prototype.name. Si la opción de minimización de nivel superior keep_classnameses undefined, se anulará con el valor de la opción de minimización de nivel superior keep_fnames.

safari10(predeterminado: false) - pase truepara solucionar los errores de Safari 10/11 en el alcance del bucle y await. Ver safari10opciones en mangle y formatpara más detalles.

Minimizar la estructura de opciones
{
    parse: {
        // parse options
    },
    compress: {
        // compress options
    },
    mangle: {
        // mangle options

        properties: {
            // mangle property options
        }
    },
    format: {
        // format options (can also use `output` for backwards compatibility)
    },
    sourceMap: {
        // source map options
    },
    ecma: 5, // specify one of: 5, 2015, 2016, etc.
    enclose: false, // or specify true, or "args:values"
    keep_classnames: false,
    keep_fnames: false,
    ie8: false,
    module: false,
    nameCache: null, // or specify a name cache object
    safari10: false,
    toplevel: false
}
Opciones del mapa de origen
Para generar un mapa fuente:

var result = await minify({"file1.js": "var a = function() {};"}, {
    sourceMap: {
        filename: "out.js",
        url: "out.js.map"
    }
});
console.log(result.code); // minified output
console.log(result.map);  // source map
Tenga en cuenta que el mapa de origen no se guarda en un archivo, solo se devuelve en formato result.map. El valor pasado sourceMap.urlsolo se usa para //# sourceMappingURL=out.js.mapconfigurar result.code. El valor de filenamesolo se usa para establecer el fileatributo (consulte la especificación ) en el archivo de mapa de origen.

Puede configurar la opción sourceMap.urlpara que sea "inline"y el mapa de origen se agregará al código.

También puede especificar la propiedad sourceRoot para que se incluya en el mapa de origen:

var result = await minify({"file1.js": "var a = function() {};"}, {
    sourceMap: {
        root: "http://example.com/src",
        url: "out.js.map"
    }
});
Si está comprimiendo JavaScript compilado y tiene un mapa fuente para él, puede usar sourceMap.content:

var result = await minify({"compiled.js": "compiled code"}, {
    sourceMap: {
        content: "content from compiled.js.map",
        url: "minified.js.map"
    }
});
// same as before, it returns `code` and `map`
Si está utilizando el X-SourceMapencabezado en su lugar, simplemente puede omitir sourceMap.url.

Si por casualidad necesita el mapa de origen como un objeto sin procesar, configúrelo sourceMap.asObjecten true.

Opciones de análisis
bare_returns(predeterminado false): admite returndeclaraciones de nivel superior

html5_comments(predeterminado true)

shebang(predeterminado true) -- soporte #!commandcomo la primera línea

spidermonkey(predeterminado false) -- aceptar un Spidermonkey (Mozilla) AST

Comprimir opciones
defaults(predeterminado: true) -- Pase para deshabilitar la mayoría de las transformaciones falsehabilitadas por defecto . compressÚtil cuando solo desea habilitar algunas compressopciones y deshabilitar el resto.

arrows(predeterminado: true) -- Los métodos literales de clase y objeto que se convierten también se convertirán en expresiones de flecha si el código resultante es más corto: m(){return x}se convierte en m:()=>x. Para hacer esto con las funciones normales de ES5 que no usan thiso arguments, consulte unsafe_arrows.

arguments(predeterminado: false) -- reemplace arguments[index]con el nombre del parámetro de función siempre que sea posible.

booleans(predeterminado: true) -- varias optimizaciones para contexto booleano, por ejemplo!!a ? b : c → a ? b : c

booleans_as_integers(predeterminado: false) -- Convierte los valores booleanos en 0 y 1, también hace comparaciones con el uso de valores booleanos ==y !=en lugar de ===y !==.

collapse_vars(predeterminado: true) -- Contraer variables no constantes de un solo uso, si los efectos secundarios lo permiten.

comparisons(predeterminado: true) -- aplica ciertas optimizaciones a los nodos binarios, p. ej. !(a <= b) → a > b(solo cuando unsafe_comps), intenta negar los nodos binarios, p. ej ., a = !b && !c && !d && !e → a=!(b||c||d||e)etc.

computed_props(predeterminado: true) -- Transforma propiedades calculadas constantes en propiedades regulares: {["computed"]: 1}se convierte en {computed: 1}.

conditionals(predeterminado: true) -- aplicar optimizaciones para if-s y expresiones condicionales

dead_code(predeterminado: true) -- elimina el código inalcanzable

directives(predeterminado: true) -- eliminar directivas redundantes o no estándar

drop_console(predeterminado: false) -- Pase truepara descartar llamadas a console.*funciones. Si desea descartar una llamada de función específica, como console.infoy/o retener los efectos secundarios de los argumentos de la función después de descartar la llamada de función, use en su pure_funcslugar.

drop_debugger(predeterminado: true) -- eliminar debugger;sentencias

ecma(predeterminado: 5) -- Pase 2015o mayor para habilitar las compressopciones que transformarán el código ES5 en formas equivalentes ES6+ más pequeñas.

evaluate(predeterminado: true) -- intenta evaluar expresiones constantes

expression(predeterminado: false) -- Pase truepara conservar los valores de finalización de las sentencias de terminal sin return, por ejemplo, en bookmarklets.

global_defs(predeterminado: {}) -- ver compilación condicional

hoist_funs(predeterminado: false) -- declaraciones de la función de elevación

hoist_props(predeterminado: true) -- eleva las propiedades del objeto constante y los literales de matriz en variables regulares sujetas a un conjunto de restricciones. Por ejemplo: var o={p:1, q:2}; f(o.p, o.q);se convierte en f(1, 2);. Nota: hoist_props funciona mejor con manglehabilitado, la compressopción passesconfigurada en 2o superior y la compressopción toplevelhabilitada.

hoist_vars(predeterminado: false) -- vardeclaraciones de elevación (esto es false por defecto porque parece aumentar el tamaño de la salida en general)

if_return(predeterminado: true) -- optimizaciones para if/return y if/continue

inline(predeterminado: true) -- llamadas en línea para funcionar con returndeclaración simple/:

false-- igual que0
0-- deshabilitado en línea
1-- funciones simples en línea
2-- funciones en línea con argumentos
3-- funciones en línea con argumentos y variables
true-- igual que3
join_vars(predeterminado: ) -- unir sentencias trueconsecutivasvar

keep_classnames(predeterminado: false) -- Pase truepara evitar que el compresor descarte nombres de clase. Pase una expresión regular para que solo los nombres de las clases coincidan con esa expresión regular. Ver también: la keep_classnames opción mangle .

keep_fargs(predeterminado: true) -- Evita que el compresor descarte los argumentos de función no utilizados. Necesita esto para el código que se basa en Function.length.

keep_fnames(predeterminado: false) -- Pase truepara evitar que el compresor descarte nombres de funciones. Pase una expresión regular para que solo los nombres de las funciones coincidan con esa expresión regular. Útil para el código que se basa en Function.prototype.name. Ver también: la keep_fnames opción mangle .

keep_infinity(predeterminado: false) -- Pase truepara evitar Infinityque se comprima en 1/0, lo que puede causar problemas de rendimiento en Chrome.

loops(predeterminado: true) -- optimizaciones para y dobucles cuando podemos determinar estáticamente la condición.whilefor

module(predeterminado false) -- Aprobado trueal comprimir un módulo ES6. El modo estricto está implícito y la toplevelopción también.

negate_iife(predeterminado: true) -- niega las "Expresiones de función llamadas inmediatamente" donde se descarta el valor de retorno, para evitar los paréntesis que insertaría el generador de código.

passes(predeterminado: 1) -- El número máximo de veces para ejecutar compress. En algunos casos, más de un pase conduce a un código más comprimido. Tenga en cuenta que más pases llevarán más tiempo.

properties(predeterminado: true) -- reescribe el acceso a la propiedad usando la notación de puntos, por ejemplofoo["bar"] → foo.bar

pure_funcs(predeterminado: null) -- Puede pasar una matriz de nombres y Terser asumirá que esas funciones no producen efectos secundarios. PELIGRO: no verificará si el nombre se redefine en el alcance. Un caso de ejemplo aquí, por ejemplo var q = Math.floor(a/b). Si la variable qno se usa en otro lugar, Terser la descartará, pero aún conservará el Math.floor(a/b), sin saber qué hace. Puede pasar pure_funcs: [ 'Math.floor' ]para informarle que esta función no producirá ningún efecto secundario, en cuyo caso se descartaría toda la instrucción. La implementación actual agrega algo de sobrecarga (la compresión será más lenta).

pure_getters(predeterminado: "strict") -- Si pasa truepor esto, Terser asumirá que el acceso a la propiedad del objeto (por ejemplo, foo.baro foo["bar"]) no tiene ningún efecto secundario. Especifique "strict"que se trate foo.barcomo libre de efectos secundarios solo cuando foose tenga la certeza de que no se producirá, es decir, no nullo undefined.

reduce_vars(predeterminado: true) -- Mejore la optimización de las variables asignadas y utilizadas como valores constantes.

reduce_funcs(predeterminado: true) -- Funciones de un solo uso en línea cuando sea posible. Depende de reduce_varsestar habilitado. Deshabilitar esta opción a veces mejora el rendimiento del código de salida.

sequences(predeterminado: true) -- une declaraciones simples consecutivas usando el operador de coma. Puede establecerse en un número entero positivo para especificar el número máximo de secuencias de comas consecutivas que se generarán. Si esta opción se establece en , el límite truepredeterminado es . Establezca la opción en o para deshabilitar. La longitud más pequeña es . Un valor de está protegido para ser equivalente a y como tal significa . En raras ocasiones, el límite de secuencias predeterminado conduce a tiempos de compresión muy lentos, en cuyo caso se recomienda un valor igual o inferior.sequences200false0sequences2sequences1true20020

side_effects(predeterminado: true) -- Elimina expresiones que no tienen efectos secundarios y cuyos resultados no se usan.

switches(predeterminado: true) -- desduplicar y eliminar switchramas inalcanzables

toplevel(predeterminado: false) -- eliminar funciones no referenciadas ( "funcs") y/o variables ( "vars") en el alcance de nivel superior ( falsede forma predeterminada, truepara eliminar funciones y variables no referenciadas)

top_retain(predeterminado: null) -- evita que se eliminen funciones y variables específicas de nivel superior unused(pueden ser una matriz, separadas por comas, RegExp o función. Implica toplevel)

typeofs(predeterminado: true) -- Se transforma typeof foo == "undefined"en foo === void 0. Nota: se recomienda establecer este valor falsepara IE10 y versiones anteriores debido a problemas conocidos.

unsafe(predeterminado: false) -- aplica transformaciones "no seguras" ( detalles ).

unsafe_arrows(predeterminado: false) -- Convierte expresiones de funciones anónimas al estilo ES5 en funciones de flecha si el cuerpo de la función no hace referencia a this. Nota: no siempre es seguro realizar esta conversión si el código se basa en que la función tiene un prototype, del que carecen las funciones de flecha. Esta transformación requiere que la ecmaopción de compresión esté establecida en 2015o mayor.

unsafe_comps(predeterminado: ) -- falseInvertir <y <=para permitir una compresión mejorada. Esto podría no ser seguro cuando al menos uno de dos operandos es un objeto con valores calculados debido al uso de métodos como , o . Esto podría provocar un cambio en el orden de ejecución después de que se cambien los operandos en la comparación. La compresión solo funciona si ambos y están configurados como verdaderos.>>=getvalueOfcomparisonsunsafe_comps

unsafe_Function(predeterminado: false) -- comprimir y destrozar Function(args, code) cuando ambos argsy codeson literales de cadena.

unsafe_math(predeterminado: false) -- optimice expresiones numéricas como 2 * x * 3into 6 * x, que pueden dar resultados imprecisos de punto flotante.

unsafe_symbols(predeterminado: false) -- elimina las claves de las declaraciones de símbolos nativos, por ejemplo, Symbol("kDog")se convierte en Symbol().

unsafe_methods(predeterminado: falso) -- Convierte { m: function(){} }a { m(){} }. ecmadebe establecerse en 6o mayor para habilitar esta transformación. Si unsafe_methodses RegExp, los pares clave/valor con claves que coincidan con RegExp se convertirán en métodos concisos. Nota: si está habilitado, existe el riesgo de obtener un <method name>TypeError "no es un constructor" en caso de que algún código intente newla función anterior.

unsafe_proto(predeterminado: false) -- optimizar expresiones como Array.prototype.slice.call(a)into[].slice.call(a)

unsafe_regexp(predeterminado: false) -- habilita las sustituciones de variables con RegExpvalores de la misma manera que si fueran constantes.

unsafe_undefined(predeterminado: false) -- sustituya void 0si hay una variable nombrada undefineden el alcance (el nombre de la variable se alterará, generalmente se reducirá a un solo carácter)

unused(predeterminado: true) -- eliminar funciones y variables no referenciadas (las asignaciones de variables directas simples no cuentan como referencias a menos que se establezcan en "keep_assign")

Opciones de Destrozar
eval(predeterminado false) -- Pase truea los nombres de mangle visibles en los ámbitos donde se usan evalo .with

keep_classnames(predeterminado false) -- Pase truepara no alterar los nombres de las clases. Pase una expresión regular para que solo los nombres de las clases coincidan con esa expresión regular. Ver también: la keep_classnames opción de compresión .

keep_fnames(predeterminado false) -- Pase truepara no alterar los nombres de las funciones. Pase una expresión regular para que solo los nombres de las funciones coincidan con esa expresión regular. Útil para el código que se basa en Function.prototype.name. Ver también: la keep_fnames opción de compresión .

module(predeterminado false) -- Pasar truemódulos ES6, donde el ámbito de nivel superior no es el ámbito global. implica toplevel_

nth_identifier(predeterminado: un modificador interno que pondera según el análisis de frecuencia de caracteres): pase un objeto con una get(n)función que convierte un ordinal en el enésimo identificador más favorecido (generalmente el más corto). Opcionalmente, también proporcione reset(), sort()y consider(chars, delta)para usar el análisis de frecuencia de caracteres del código fuente.

reserved(predeterminado []): pasa una matriz de identificadores que deben excluirse de la manipulación. Ejemplo: ["foo", "bar"].

toplevel(predeterminado false) -- Pase truea los nombres de mangle declarados en el ámbito de nivel superior.

safari10(predeterminado false): pase para evitar el errortrue del iterador de bucle de Safari 10 "No se puede declarar una variable let dos veces". Ver también: la opción de formato .safari10

Ejemplos:

// test.js
var globalVar;
function funcName(firstLongName, anotherLongName) {
    var myVariable = firstLongName +  anotherLongName;
}
var code = fs.readFileSync("test.js", "utf8");

await minify(code).code;
// 'function funcName(a,n){}var globalVar;'

await minify(code, { mangle: { reserved: ['firstLongName'] } }).code;
// 'function funcName(firstLongName,a){}var globalVar;'

await minify(code, { mangle: { toplevel: true } }).code;
// 'function n(n,a){}var a;'
Opciones de propiedades de Mangle
builtins(predeterminado: false) — Utilícelo truepara permitir la manipulación de las propiedades DOM integradas. No se recomienda anular esta configuración.

debug(predeterminado: false) — Mangle nombres con el nombre original todavía presente. Pase una cadena vacía ""para habilitar o una cadena no vacía para establecer el sufijo de depuración.

keep_quoted(predeterminado: false) — Cómo las propiedades entre comillas ( {"prop": ...}y obj["prop"]) controlan lo que se altera.

"strict"(recomendado) -- obj.propestá destrozado.
false-- obj["prop"]está destrozado.
true-- obj.propestá alterado a menos que haya obj["prop"]otra parte en el código.
nth_identifer(predeterminado: un modificador interno que pondera según el análisis de frecuencia de caracteres): pase un objeto con una get(n)función que convierte un ordinal en el enésimo identificador más favorecido (generalmente el más corto). Opcionalmente, también proporcione reset(), sort()y consider(chars, delta)para usar el análisis de frecuencia de caracteres del código fuente.

regex(predeterminado: null) — Pase una cadena de patrón o literal RegExp para modificar solo la propiedad que coincida con la expresión regular.

reserved(predeterminado: []) — No altere los nombres de propiedad enumerados en la reservedmatriz.

undeclared(predeterminado: false) - Destruya esos nombres cuando se accede a ellos como propiedades de variables de nivel superior conocidas, pero sus declaraciones nunca se encuentran en el código de entrada. Puede ser útil cuando solo se minimizan partes de un proyecto. Ver #397 para más detalles.

Opciones de formato
Estas opciones controlan el formato del código de salida de Terser. Anteriormente conocido como "opciones de salida".

ascii_only(predeterminado false): escape de caracteres Unicode en cadenas y expresiones regulares (afecta a las directivas con caracteres que no son ascii que se vuelven inválidos)

beautify(predeterminado false) -- (DEPRECATED) si embellecer la salida. Cuando se utiliza el indicador CLI heredado -b, se establece en verdadero de forma predeterminada.

braces(predeterminado false): inserte siempre llaves en las declaraciones if, for, o do, incluso si su cuerpo es una sola declaración.whilewith

comments(predeterminado "some") -- por defecto mantiene los comentarios de estilo JSDoc que contienen "@license", "@copyright", "@preserve" o comienzan con !, pasa true o "all"para conservar todos los comentarios, falsepara omitir comentarios en la salida, una expresión regular cadena (por ejemplo /^!/) o una función.

ecma(predeterminado 5): establezca la versión estándar de EcmaScript deseada para la salida. Establézcalo ecmaen 2015o más para emitir propiedades de objeto abreviadas, es decir: {a}en lugar de {a: a}. La ecmaopción solo cambiará la salida en control directo del embellecedor. Las características no compatibles en su entrada aún se mostrarán como están. Por ejemplo: una ecmaconfiguración de 5no convertirá el código moderno a ES5 .

indent_level(predeterminado 4)

indent_start(predeterminado 0): prefije todas las líneas con tantos espacios

inline_script(predeterminado true): escapar de los comentarios HTML y la barra oblicua en las apariciones de </script>cadenas

keep_numbers(predeterminado false): mantiene los números literales como estaban en el código original (deshabilita optimizaciones como convertir 1000000en 1e6)

keep_quoted_props(predeterminado false): cuando está activado, evita eliminar las comillas de los nombres de propiedad en los objetos literales.

max_line_len(predeterminado false) -- longitud máxima de línea (para código minimizado)

preamble(predeterminado null): cuando se pasa, debe ser una cadena y se antepondrá a la salida literalmente. El mapa de origen se ajustará a este texto. Se puede usar para insertar un comentario que contenga información de licencia, por ejemplo.

quote_keys(predeterminado false) -- pase truepara citar todas las claves en objetos literales

quote_style(predeterminado 0) -- estilo de comillas preferido para cadenas (también afecta a los nombres de propiedades y directivas entre comillas):

0-- prefiere comillas dobles, cambia a comillas simples cuando hay más comillas dobles en la propia cadena. 0es mejor para el tamaño gzip.
1-- utilice siempre comillas simples
2-- utilice siempre comillas dobles
3-- utilice siempre las comillas originales
preserve_annotations-- (predeterminado false) -- Conservar las anotaciones de Terser en la salida.

safari10(predeterminado false): configure esta opción para trueevitar el error de espera de Safari 10/11 . Ver también: la safari10 opción mangle .

semicolons(predeterminado true) -- sentencias separadas con punto y coma. Si aprueba false, siempre que sea posible, usaremos una nueva línea en lugar de un punto y coma, lo que generará una salida más legible del código minimizado (el tamaño antes de gzip podría ser más pequeño; el tamaño después de gzip podría ser insignificantemente más grande).

shebang(predeterminado true) -- preservar shebang #!en el preámbulo (guiones de bash)

spidermonkey(predeterminado false) -- producir un Spidermonkey (Mozilla) AST

webkit(predeterminado false): habilite soluciones alternativas para errores de WebKit. Los usuarios de PhantomJS deben establecer esta opción en true.

wrap_iife(predeterminado false) -- pase truepara envolver expresiones de función invocadas inmediatamente. Ver #640 para más detalles.

wrap_func_args(predeterminado true) -- pasar falsesi no desea ajustar las expresiones de función que se pasan como argumentos, entre paréntesis. Consulte OptimizeJS para obtener más detalles.

Misceláneas
Mantener avisos de derechos de autor u otros comentarios
Puede pasar --commentsa retener ciertos comentarios en la salida. De forma predeterminada, mantendrá los comentarios que comiencen con "!" y comentarios estilo JSDoc que contienen "@preserve", "@copyright", "@license" o "@cc_on" (compilación condicional para IE). Puede pasar --comments allpara mantener todos los comentarios, o una expresión regular de JavaScript válida para mantener solo los comentarios que coincidan con esta expresión regular. Por ejemplo --comments /^!/ , mantendrá comentarios como /*! Copyright Notice */.

Tenga en cuenta, sin embargo, que puede haber situaciones en las que se pierdan los comentarios. Por ejemplo:

function f() {
    /** @preserve Foo Bar */
    function g() {
        // this function is never called
    }
    return something();
}
Aunque tiene "@preserve", el comentario se perderá porque el gcompresor descarta la función interna (que es el nodo AST al que se adjunta el comentario) como no referenciada.

Los comentarios más seguros donde colocar la información de derechos de autor (u otra información que deba mantenerse en la salida) son los comentarios adjuntos a los nodos de nivel superior.

la unsafe compressopción
Habilita algunas transformaciones que podrían romper la lógica del código en ciertos casos artificiales, pero debería estar bien para la mayoría del código. Asume que las funciones y clases integradas estándar de ECMAScript no se han modificado ni reemplazado. Es posible que desee probarlo en su propio código; debería reducir el tamaño minificado. Algunos ejemplos de las optimizaciones realizadas cuando esta opción está habilitada:

new Array(1, 2, 3)o Array(1, 2, 3)→[ 1, 2, 3 ]
Array.from([1, 2, 3])→[1, 2, 3]
new Object()→{}
String(exp)o exp.toString()→"" + exp
new Object/RegExp/Function/Error/Array (...)→ descartamos elnew
"foo bar".substr(4)→"bar"
compilación condicional
Puede usar el interruptor --define( -d) para declarar variables globales que Terser asumirá como constantes (a menos que esté definido en el alcance). Por ejemplo, si aprueba --define DEBUG=falseentonces, junto con la eliminación de código muerto, Terser descartará lo siguiente de la salida:

if (DEBUG) {
    console.log("debug stuff");
}
Puede especificar constantes anidadas en forma de --define env.DEBUG=false.

Otra forma de hacerlo es declarar sus globales como constantes en un archivo separado e incluirlo en la compilación. Por ejemplo, puede tener un build/defines.jsarchivo con lo siguiente:

var DEBUG = false;
var PRODUCTION = true;
// etc.
y construye tu código así:

terser build/defines.js js/foo.js js/bar.js... -c
Terser notará las constantes y, dado que no se pueden modificar, evaluará las referencias a ellas con el valor en sí y eliminará el código inalcanzable como de costumbre. La compilación contendrá las constdeclaraciones si las usa. Si está apuntando a entornos <ES6 que no son compatibles const, usar varwith reduce_vars(habilitado de forma predeterminada) debería ser suficiente.

API de compilación condicional
También puede usar la compilación condicional a través de la API programática. Con la diferencia de que el nombre de la propiedad es global_defsy es una propiedad del compresor:

var result = await minify(fs.readFileSync("input.js", "utf8"), {
    compress: {
        dead_code: true,
        global_defs: {
            DEBUG: false
        }
    }
});
Para reemplazar un identificador con una expresión arbitraria no constante, es necesario anteponer la global_defsclave con "@"para indicar a Terser que analice el valor como una expresión:

await minify("alert('hello');", {
    compress: {
        global_defs: {
            "@alert": "console.log"
        }
    }
}).code;
// returns: 'console.log("hello");'
De lo contrario, sería reemplazado como cadena literal:

await minify("alert('hello');", {
    compress: {
        global_defs: {
            "alert": "console.log"
        }
    }
}).code;
// returns: '"console.log"("hello");'
Anotaciones
Las anotaciones en Terser son una forma de indicarle que trate una determinada llamada de función de manera diferente. Están disponibles las siguientes anotaciones:

/*@__INLINE__*/- obliga a una función a estar en línea en algún lugar.
/*@__NOINLINE__*/- Se asegura de que la función llamada no esté insertada en el sitio de la llamada.
/*@__PURE__*/- Marca una llamada de función como pura. Eso significa que se puede dejar caer de forma segura.
Puede usar un @signo al comienzo o un #.

Aquí hay algunos ejemplos de cómo usarlos:

/*@__INLINE__*/
function_always_inlined_here()

/*#__NOINLINE__*/
function_cant_be_inlined_into_here()

const x = /*#__PURE__*/i_am_dropped_if_x_is_not_used()
ESTree / SpiderMonkey AST
Terser tiene su propio formato de árbol de sintaxis abstracta; por razones prácticas, no podemos cambiar fácilmente a SpiderMonkey AST internamente. Sin embargo, Terser ahora tiene un convertidor que puede importar un SpiderMonkey AST.

Por ejemplo , Acorn es un analizador súper rápido que produce un SpiderMonkey AST. Tiene una pequeña utilidad CLI que analiza un archivo y vuelca el AST en JSON en la salida estándar. Para usar Terser para destrozar y comprimir eso:

acorn file.js | terser -p spidermonkey -m -c
La -p spidermonkeyopción le dice a Terser que todos los archivos de entrada no son JavaScript, sino código JS descrito en SpiderMonkey AST en JSON. Por lo tanto, no usamos nuestro propio analizador en este caso, sino que simplemente transformamos ese AST en nuestro AST interno.

spidermonkeytambién está disponible en minifyforma parsey formatopciones para aceptar y/o producir un AST mono araña.

Use Acorn para analizar
Más por diversión, agregué la -p acornopción que usará Acorn para hacer todo el análisis. Si pasa esta opción, Terser lo hará require("acorn").

Acorn es realmente rápido (por ejemplo, 250 ms en lugar de 380 ms en un código de 650 K), pero convertir el árbol SpiderMonkey que produce Acorn requiere otros 150 ms, por lo que en total es un poco más que usar el propio analizador de Terser.

Modo Minimizar Rápido Terser
No es muy conocido, pero la eliminación de espacios en blanco y la manipulación de símbolos representan el 95 % de la reducción de tamaño en el código minimizado para la mayoría de JavaScript, no las transformaciones de código elaboradas. Uno puede simplemente deshabilitar compresspara acelerar las compilaciones de Terser de 3 a 4 veces.

d3.js	Talla	tamaño gzip	tiempo (s)
original	451,131	108,733	-
terser@3.7.5 destrozar=falso, comprimir=falso	316,600	85,245	0.82
terser@3.7.5 destrozar=verdadero, comprimir=falso	220,216	72,730	1.45
terser@3.7.5 destrozar=verdadero, comprimir=verdadero	212,046	70,954	5.87
babili@0.1.4	210,713	72,140	12.64
babel-minify@0.4.3	210,321	72,242	48.67
babel-minify@0.5.0-alpha.01eac1c3	210.421	72,238	14.17
Para habilitar el modo minificar rápido desde el uso de la CLI:

terser file.js -m
Para habilitar el modo minificar rápido con el uso de la API:

await minify(code, { compress: false, mangle: true });
Mapas fuente y depuración
Se sabe que varias compresstransformaciones que simplifican, reorganizan, insertan y eliminan código tienen un efecto adverso en la depuración con mapas de origen. Esto es de esperar ya que el código está optimizado y las asignaciones a menudo simplemente no son posibles porque parte del código ya no existe. Para obtener la máxima fidelidad en la depuración del mapa de origen, deshabilite la compressopción y simplemente use mangle.

Suposiciones del compilador
Para permitir mejores optimizaciones, el compilador hace varias suposiciones:

.toString()y .valueOf()no tienen efectos secundarios, y para los objetos integrados no se han anulado.
undefinedy no NaNse Infinityhan redefinido externamente.
arguments.callee, arguments.callery Function.prototype.callerno se utilizan.
El código no espera que el contenido Function.prototype.toString()sea Error.prototype.stacknada en particular.
Obtener y establecer propiedades en un objeto simple no causa otros efectos secundarios (usar .watch()o Proxy).
Las propiedades del objeto se pueden agregar, eliminar y modificar (no se impide con , Object.defineProperty(), Object.defineProperties()o Object.freeze()) .Object.preventExtensions()Object.seal()
document.allno es== null
Asignar propiedades a una clase no tiene efectos secundarios y no arroja.
Cree herramientas y adaptadores con Terser
https://www.npmjs.com/browse/depended/terser

Reemplazando uglify-escon terseren un proyecto usandoyarn
Varios empaquetadores JS y envoltorios uglify todavía usan versiones con errores uglify-esy aún no se han actualizado a terser. Si está utilizando yarn , puede agregar el siguiente alias al package.jsonarchivo de su proyecto:

  "resolutions": {
    "uglify-es": "npm:terser"
  }
para usar terseren lugar de uglify-esen todas las dependencias profundamente anidadas sin cambiar ningún código.

Nota: para que este cambio surta efecto, debe ejecutar los siguientes comandos para eliminar el yarnarchivo de bloqueo existente y reinstalar todos los paquetes:

$ rm -rf node_modules yarn.lock
$ yarn
Informes de problemas
En la CLI terser usamos source-map-support para producir buenas pilas de errores. En su propia aplicación, se espera que habilite el soporte de mapa de origen (lea sus documentos) para tener buenos seguimientos de pila que lo ayudarán a escribir buenos problemas.

Obtener el código fuente entregado a Terser
Debido a que los usuarios a menudo no controlan la llamada await minify()o sus argumentos, Terser proporciona una TERSER_DEBUG_DIRvariable de entorno para hacer que terser genere algunos registros de depuración. Si está utilizando un paquete o un proyecto que incluye un paquete y no está seguro de qué salió mal con su código, pase esa variable así:

$ TERSER_DEBUG_DIR=/path/to/logs command-that-uses-terser
$ ls /path/to/logs
terser-debug-123456.log
Si no está seguro de cómo configurar una variable de entorno en su shell (el ejemplo anterior funciona en bash), puede intentar usar cross-env:

> npx cross-env TERSER_DEBUG_DIR=/path/to/logs command-that-uses-terser
Usuarios de README.md:
nota : Puedes apoyar este proyecto en patreon: [enlace] Terser Patreon se está cerrando a favor de opencollective . Visite PATRONS.md para conocer a nuestros patrocinadores de primer nivel.

Estos son los patrocinadores de segundo nivel. ¡Muchas gracias por su apoyo!

CKEditor
38elementos
Colaboradores
Colaboradores de código
Este proyecto existe gracias a todas las personas que contribuyen. [ Contribuir ]. 

Contribuyentes Financieros
Conviértase en un contribuyente financiero y ayúdenos a mantener nuestra comunidad. [ Contribuir ]

Individuos


Organizaciones
Apoya este proyecto con tu organización. Su logotipo aparecerá aquí con un enlace a su sitio web. [ Contribuir ]

         

Lanzamientos
