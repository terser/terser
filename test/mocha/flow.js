import {deepStrictEqual as equal, notDeepStrictEqual as notEqual } from 'assert'
import {parse} from '../../lib/parse.js'
import '../../lib/flow/flow.js'
import '../../main.js' // load node prototype stuff
import { Type, World, NOPE, LiteralType, FunctionType } from '../../lib/flow/tools.js'

let world = new World()
beforeEach(() => { world = new World() })

const test_stat = code => {
    let stat = parse(code)
    world = new World()
    world.flow_test = true
    world.define('LOG', new FunctionType(parse(`function LOG(l){}`).body[0], world))
    world.define('num', new Type(['number']))
    world.define('one', new LiteralType(1))
    return stat.flow_analysis(world)
}

const test_func_body = code => {
    let stat = parse(`function f(num) { ${code} } f(num)`)
    world = new World()
    world.flow_test = true
    world.define('LOG', new FunctionType(parse(`function LOG(l){}`).body[0], world))
    world.define('num', new Type(['number']))
    world.define('one', new LiteralType(1))
    return stat.flow_analysis(world)
}

beforeEach(() => {
    global.TERSER_FLOW_TEST = true
})

afterEach(() => {
    delete global.TERSER_FLOW_TEST
})

describe('Flow analysis: statements', () => {
    it('can do conditions', () => {
        let type;

        type = test_stat(`if (0) { num = 1 } else { num = 2 }`);
        equal(type.value, 2);
        equal(world.read_variable('num').value, 2);

        type = test_stat(`if (1) { num = 1 } else { num = 2 }`);
        equal(type.value, 1);
        equal(world.read_variable('num').value, 1);

        type = test_stat(`if (num) { num = 1 } else { num = 2 }`);
        equal(type, new Type(['number']));
        equal(world.read_variable('num'), new Type(['number']));
    });

    it('can do ternaries', () => {
        let type;

        type = test_stat(`1 ? (num = 2) : (num = throw_)`);
        equal(type.value, 2);
        equal(world.read_variable('num').value, 2);
    });

    it('can do conditions if they may throw', () => {
        equal(test_stat(`if (throw_) { num = 1 } else { num = 2 }`), NOPE);
        equal(test_stat(`if (1) { throw_ } else { num = 2 }`), NOPE);
        equal(test_stat(`if (0) { num = 1 } else { throw_ }`), NOPE);
        
        notEqual(test_stat(`if (1) { num = 1 } else { throw_ }`), NOPE);
        notEqual(test_stat(`if (0) { throw_ } else { num = 2 }`), NOPE);
    });

    it('can do conditions if they may return', () => {
        equal(test_func_body(`if (1) { return 99 } else { num = 2 }`), new LiteralType(99));
        equal(test_func_body(`if (0) { num = 1 } else { return 99 }`), new LiteralType(99));
        equal(test_func_body(`if (num) { return 99 } else { return 11 }`), new Type(['number']));

        equal(test_func_body(`if (num) { return 99 } else { num = 2 }`), NOPE);
        equal(test_func_body(`if (num) { num = 1 } else { return 99 }`), NOPE);
    });

    it('can do conditions where one side defines a variable')

    it('can do blocks', () => {
        let type;

        type = test_stat(`{ num = 1 }`);
        equal(type, new LiteralType(1));
        equal(world.read_variable('num').value, 1);

        type = test_stat(`{ num = 1; num = 2 }`);
        equal(type, new LiteralType(2));
        equal(world.read_variable('num').value, 2);

        equal(test_stat(`{ throw_; num = 1 }`), NOPE);
    });

    it('can do sequence (comma operator)', () => {
        let type;

        type = test_stat(`( num = 1 )`);
        equal(type, new LiteralType(1));
        equal(world.read_variable('num').value, 1);

        type = test_stat(`( num = 1, num = 2 )`);
        equal(type, new LiteralType(2));
        equal(world.read_variable('num').value, 2);

        equal(test_stat(`( throw_, num = 1 )`), NOPE);
    });
});

describe('Flow analysis: functions', () => {
    it('can do simple functions', () => {
        let type;

        type = test_stat(`function f() { num = 1 }`);
        equal(type, new LiteralType(undefined));
        equal(world.read_variable('f').node.print_to_string(), 'function f(){num=1}');
    });

    it('can call these functions', () => {
        let type;

        type = test_stat(`function f() { num = 1 } f()`);
        equal(type, new LiteralType(undefined));
        equal(world.read_variable('num').value, 1);

        type = test_stat(`function f() { return num } f()`);
        equal(type, new Type(['number']));
    });

    it('understands closure', () => {
        let type;

        type = test_stat(`
            function f(num) {
                function ret_f() { return num }
                return ret_f
            }
            f(42)()
        `);
        equal(type, new LiteralType(42));
        equal(world.read_variable('num'), new Type(['number'])); // untouched outer "num"

        type = test_stat(`function f() { return num } f()`);
        equal(type, new Type(['number']));
    });

    it('can call these functions with args', () => {
        let type;

        type = test_stat(`function f(a) { num = a } f(2)`);
        equal(type, new LiteralType(undefined));
        equal(world.read_variable('num').value, 2);
    });

    it('deals with hoisting and block-scoped defuns', () => {
        let type;

        type = test_stat(`
            f(10);
            function f(a) { return a + 1 }
            f(11);
        `)

        equal(type, new Type(['number']))
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

describe('dead code elimination', () => {
    it('', () => {
        const stat = test_stat(`
            function f(x) {
                if (one) { return 42 } else { return 0 }
            }
            f(one)
        `);
        console.log(stat)
    })
})
