import {deepStrictEqual as equal, notDeepStrictEqual as not_equal, throws } from 'assert'
import {parse} from '../../lib/parse.js'
import '../../lib/flow/flow.js'
import '../../main.js' // load node prototype stuff
import { World, NOPE } from '../../lib/flow/tools.js'
import { flow_drop_dead_code } from '../../lib/flow/dce.js'
import { Type, LiteralType, FunctionType} from "../../lib/flow/types.js"
import { assert_properties } from './utils.js'

let world = new World();
beforeEach(() => { test_world() });

describe('Flow analysis: statements', () => {
    it('can do conditions', () => {
        let type;

        type = test_stat(`if (0) { NUM = 1 } else { NUM = 2 }`);
        equal(type.value, 2);
        equal(world.read_variable('NUM').value, 2);

        type = test_stat(`if (1) { NUM = 1 } else { NUM = 2 }`);
        equal(type.value, 1);
        equal(world.read_variable('NUM').value, 1);

        type = test_stat(`if (NUM) { NUM = 1 } else { NUM = 2 }`);
        equal(type, new Type(['number']));
        equal(world.read_variable('NUM'), new Type(['number']));
    });

    it('can do ternaries', () => {
        let type;

        type = test_stat(`1 ? (NUM = 2) : (NUM = throw_)`);
        equal(type.value, 2);
        equal(world.read_variable('NUM').value, 2);
    });

    it('can do conditions if they may throw', () => {
        equal(test_stat(`if (throw_) { NUM = 1 } else { NUM = 2 }`), NOPE);
        equal(test_stat(`if (1) { throw_ } else { NUM = 2 }`), NOPE);
        equal(test_stat(`if (0) { NUM = 1 } else { throw_ }`), NOPE);

        not_equal(test_stat(`if (1) { NUM = 1 } else { throw_ }`), NOPE);
        not_equal(test_stat(`if (0) { throw_ } else { NUM = 2 }`), NOPE);
    });

    it('can do conditions if they may return', () => {
        equal(test_func_body(`if (1) { return 99 } else { NUM = 2 }`), new LiteralType(99));
        equal(test_func_body(`if (0) { NUM = 1 } else { return 99 }`), new LiteralType(99));
        equal(test_func_body(`if (NUM) { return 99 } else { return 11 }`), new Type(['number']));

        equal(test_func_body(`if (NUM) { return 99 } else { NUM = 2 }`), NOPE);
        equal(test_func_body(`if (NUM) { NUM = 1 } else { return 99 }`), NOPE);
    });

    it('can do blocks', () => {
        let type;

        type = test_stat(`{ NUM = 1 }`);
        equal(type, new LiteralType(1));
        equal(world.read_variable('NUM').value, 1);

        type = test_stat(`{ NUM = 1; NUM = 2 }`);
        equal(type, new LiteralType(2));
        equal(world.read_variable('NUM').value, 2);

        equal(test_stat(`{ throw_; NUM = 1 }`), NOPE);
    });

    it('can do sequence (comma operator)', () => {
        let type;

        type = test_stat(`( NUM = 1 )`);
        equal(type, new LiteralType(1));
        equal(world.read_variable('NUM').value, 1);

        type = test_stat(`( NUM = 1, NUM = 2 )`);
        equal(type, new LiteralType(2));
        equal(world.read_variable('NUM').value, 2);

        equal(test_stat(`( throw_, NUM = 1 )`), NOPE);
    });
});

describe('Flow analysis: vars', () => {
    it('can define vars', () => {
        equal(test_stat(`x = 1; var x; x`), new LiteralType(1));
        equal(world.read_variable_ambient('x'), new LiteralType(1));

        equal(test_stat(`x = 1; var x = 2; x`), new LiteralType(2));
        equal(world.read_variable_ambient('x'), new Type(['number']));
    });

    it('can define const, let', () => {
        equal(test_stat(`const x = 1; x`), new LiteralType(1));
        equal(world.read_variable_ambient('x'), new LiteralType(1));

        equal(test_stat(`x; let x`), NOPE);
        equal(test_stat(`const x = 1; x = 2`), NOPE);
    });

    it('can count reads and writes', () => {
        test_stat(`var x`);
        assert_properties(world.get_binding('x'), { reads: 0, writes: 0 });

        test_stat(`var x; x = 1`);
        assert_properties(world.get_binding('x'), { reads: 0, writes: 1 });

        test_stat(`var x; x`);
        assert_properties(world.get_binding('x'), { reads: 1, writes: 0 });

        test_stat(`var x; x = 1; x`);
        assert_properties(world.get_binding('x'), { reads: 1, writes: 1 });
    });

    it('allows block scope', () => {
        equal(test_stat('var x = 1; { const x = 2; x }'), new LiteralType(2));
        equal(test_stat('var x = 1; { const x = 2; x } x'), new LiteralType(1));
    });

    it('forbids weird vars and accessing globals', () => {
        equal(test_stat('var x; function x() {}'), NOPE);
        equal(test_stat('let x; function x() {}'), NOPE);
        equal(test_stat('var x; let x'), NOPE);
        equal(test_stat('var arguments'), NOPE);
        equal(test_stat('unknown'), NOPE);
    });
});

describe('Flow analysis: functions', () => {
    it('can do simple functions', () => {
        let type;

        type = test_stat(`function f() { NUM = 1 }`);
        equal(type, new LiteralType(undefined));
        equal(world.read_variable('f').node.print_to_string(), 'function f(){NUM=1}');
    });

    it('can call these functions', () => {
        let type;

        type = test_stat(`function f() { NUM = 1 } f()`);
        equal(type, new LiteralType(undefined));
        equal(world.read_variable('NUM').value, 1);

        type = test_stat(`function f() { return NUM } f()`);
        equal(type, new Type(['number']));
    });

    it('understands closure', () => {
        let type;

        type = test_stat(`
            function f(NUM) {
                function ret_f() { return NUM }
                return ret_f
            }
            f(42)()
        `);
        equal(type, new LiteralType(42));
        equal(world.read_variable('NUM'), new Type(['number'])); // untouched outer "NUM"

        type = test_stat(`function f() { return NUM } f()`);
        equal(type, new Type(['number']));
    });

    it('can call these functions with args', () => {
        let type;

        type = test_stat(`function f(a) { NUM = a } f(2)`);
        equal(type, new LiteralType(undefined));
        equal(world.read_variable('NUM').value, 2);
    });

    it('deals with hoisting and block-scoped defuns', () => {
        let type;

        type = test_stat(`
            f(10);
            function f(a) { return a + 1 }
            f(11);
        `);

        equal(type, new Type(['number']));
    });

    it('deals with recursion, simple and mutual', () => {
        let type;

        type = test_stat(`function f(x) { return x ? f(x - 1) : 42 } f(9)`);
        equal(type, new LiteralType(42));

        equal(test_stat(`function f(x) { return x ? f(x - 1) : 42 } f(-9)`), NOPE);

        equal(test_stat(`
            function f(x) { return f_mut(x) }
            function f_mut(x) { return f(x) }
            f(9)
        `), NOPE);
    });
});

describe('Flow analysis: knowability', () => {
    it('does it know all the usages of a function?', () => {
        let stat
        stat = test_stat(`
            function f(x) {}
            f(1)
        `);
        not_equal(world.variable_facts('f'), undefined);

        stat = test_stat(`
            function f(x) {}
            LEAK(f)
            f(1)
        `);
        equal(world.variable_facts('f'), undefined);
    });
});

describe('Flow analysis: new World()', () => {
    it('can describe a variable before definition', () => {
        world.define('written_later');
        equal(world.read_variable('written_later'), new LiteralType(undefined));
        world.write_variable('written_later', new LiteralType(10));
        equal(world.read_variable_ambient('written_later'), new Type(['undefined', 'number']));
        equal(world.read_variable('written_later'), new LiteralType(10));
    });

    it('can ignore a variable\'s undefinedness during hoist', () => {
        world.define('hoisted_but_known')
        // it's hoisted but we don't read it now
        world.write_variable('hoisted_but_known', new LiteralType(10));
        // now we can read it
        equal(world.read_variable_ambient('hoisted_but_known'), new LiteralType(10));
        equal(world.read_variable('hoisted_but_known'), new LiteralType(10));
    });

    it('a world in a condition cannot change outer scopes', () => {
        world.define('nonlocal', new LiteralType(1));

        world = world.callee_world();

        const forked = world.fork();
        try {
            forked.write_variable('nonlocal', new LiteralType(2), { is_definition: false });
            equal(true, false, 'should throw!');
        } catch (e) {
            equal(e, NOPE);
        }
    });
});

describe('Flow analysis: powering DCE', () => {
    it('understands hoisting drama', () => {
        equal(
            test_stat(`
                if (0) { fn() }
                var DEBUG = 1234
                function fn() { return DEBUG }
                fn()
            `),
            new LiteralType(1234)
        );
        equal(world.read_variable_ambient('DEBUG'), new LiteralType(1234));

        equal(
            test_stat(`
                if (1) { fn() }
                var DEBUG = 1234
                function fn() { return DEBUG }
                fn()
            `),
            new LiteralType(1234)
        );
        equal(world.read_variable_ambient('DEBUG'), new Type(['undefined', 'number']));
    });

    it('can drop dead code', () => {
        test_dce(`
            var DEBUG = 1
            function fn() { return DEBUG ? 42 : -1 }
            fn()
        `, `
            function fn() { return 42 }
            fn()
        `);

        test_dce(`
            var DEBUG = 1
            function fn() { if (DEBUG) { return 42 } else { return -1 } }
            fn()
        `, `
            function fn() { { return 42 } }
            fn()
        `);

        test_dce(`
            var DEBUG = 1
            var OTHER
            if (DEBUG) { OTHER = 42 } else { OTHER = -1 }
            OTHER
        `, `
            var OTHER
            { OTHER = 42 }
            OTHER
        `);
    });
});

const test_world = world_opts => {
    world = new World(world_opts);
    world.flow_test = true;
    world.define('LOG', new FunctionType(parse(`function LOG(l){}`).body[0], world));
    world.define('NUM', new Type(['number']));
    world.define('ONE', new LiteralType(1));
    return world;
};

const test_stat = (code, world_opts) => {
    const stat = parse(code);
    return stat.flow_analysis(test_world(world_opts));
};

const test_func_body = (code, world_opts) => {
    const stat = parse(`function f(NUM) { ${code} } f(NUM)`);
    return stat.flow_analysis(test_world(world_opts));
};

const test_dce = (code, expected, world_opts) => {
    const stat = parse(code);
    stat.figure_out_scope({ toplevel: true });
    const type = stat.flow_analysis(test_world(world_opts));

    not_equal(type, NOPE);

    const dropped = flow_drop_dead_code(world, stat);

    equal(dropped.print_to_string(), parse(expected).print_to_string());
};

