constant_switch_1: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        switch (1+1) {
          case 1: foo(); break;
          case 1+1: bar(); break;
          case 1+1+1: baz(); break;
        }
    }
    expect: {
        bar();
    }
}

constant_switch_2: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        switch (1) {
          case 1: foo();
          case 1+1: bar(); break;
          case 1+1+1: baz();
        }
    }
    expect: {
        foo();
        bar();
    }
}

constant_switch_3: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        switch (10) {
          case 1: foo();
          case 1+1: bar(); break;
          case 1+1+1: baz();
          default:
            def();
        }
    }
    expect: {
        def();
    }
}

constant_switch_4: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        switch (2) {
          case 1:
            x();
            if (foo) break;
            y();
            break;
          case 1+1:
            bar();
          default:
            def();
        }
    }
    expect: {
        bar();
        def();
    }
}

constant_switch_5: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        switch (1) {
          case 1:
            x();
            if (foo) break;
            y();
            break;
          case 1+1:
            bar();
          default:
            def();
        }
    }
    expect: {
        // the break inside the if ruins our job
        // we can still get rid of irrelevant cases.
        switch (1) {
          case 1:
            x();
            if (foo) break;
            y();
        }
        // XXX: we could optimize this better by inventing an outer
        // labeled block, but that's kinda tricky.
    }
}

constant_switch_6: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        OUT: {
            foo();
            switch (1) {
              case 1:
                x();
                if (foo) break OUT;
                y();
              case 1+1:
                bar();
                break;
              default:
                def();
            }
        }
    }
    expect: {
        OUT: {
            foo();
            x();
            if (foo) break OUT;
            y();
            bar();
        }
    }
}

constant_switch_7: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        OUT: {
            foo();
            switch (1) {
              case 1:
                x();
                if (foo) break OUT;
                for (var x = 0; x < 10; x++) {
                    if (x > 5) break; // this break refers to the for, not to the switch; thus it
                                      // shouldn't ruin our optimization
                    console.log(x);
                }
                y();
              case 1+1:
                bar();
                break;
              default:
                def();
            }
        }
    }
    expect: {
        OUT: {
            foo();
            x();
            if (foo) break OUT;
            for (var x = 0; x < 10; x++) {
                if (x > 5) break;
                console.log(x);
            }
            y();
            bar();
        }
    }
}

constant_switch_8: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        OUT: switch (1) {
          case 1:
            x();
            for (;;) break OUT;
            y();
            break;
          case 1+1:
            bar();
          default:
            def();
        }
    }
    expect: {
        OUT: {
            x();
            for (;;) break OUT;
            y();
        }
    }
}

constant_switch_9: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        OUT: switch (1) {
          case 1:
            x();
            for (;;) if (foo) break OUT;
            y();
          case 1+1:
            bar();
          default:
            def();
        }
    }
    expect: {
        OUT: {
            x();
            for (;;) if (foo) break OUT;
            y();
            bar();
            def();
        }
    }
}

drop_default_1: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 'bar': baz();
          default:
        }
    }
    expect: {
        if (foo === "bar") baz();
    }
}

drop_default_2: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 'bar': baz(); break;
          default:
            break;
        }
    }
    expect: {
        if (foo === "bar") baz();
    }
}

keep_default: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 'bar': baz();
          default:
            something();
            break;
        }
    }
    expect: {
        if (foo === 'bar') baz();
        something();
    }
}

remove_switch_1: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case 1:
            1;
          case 2:
            invariant();
          case 3:
          default:
            doSomething();
        }
        function invariant() {
            /* production build */
        }
    }
    expect: {
        foo;
        doSomething();
    }
}

remove_switch_2: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case 1:
            doSomething();
            break;
          default:
            doSomething();
            break;
        }
    }
    expect: {
        foo;
        doSomething();
    }
}

remove_switch_3: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          default:
            doSomething();
            break;
          case 1:
            doSomething();
            break;
        }
    }
    expect: {
        foo;
        doSomething();
    }
}

remove_switch_4: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case 1:
            doSomething();
            break;
          default:
            doSomething();
            break;
          case 2:
            doSomething();
            break;
        }
    }
    expect: {
        foo;
        doSomething();
    }
}

remove_switch_5: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case "bar":
            doSomething();
            break;
          default:
            doSomething();
            break;
          case "qux":
            doSomething();
            break;
        }

    }
    expect: {
        foo;
        doSomething();
    }
}

remove_switch_6: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case 1:
            doSomething();
            break;
          default:
            doSomething();
            break;
          case 2:
            doSomething();
        }
    }
    expect: {
        foo;
        doSomething();
    }
}

remove_switch_7: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            doSomething();
            break;
          default:
            doSomething();
            break;
          case qux:
            doSomething();
            break;
        }
    }
    expect: {
        switch (foo) {
          case bar:
          case qux:
        }
        doSomething();
    }
}

remove_switch_8: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        function test(foo) {
            switch (foo) {
              case 1:
                return 1;
              case 2:
              default:
              case 3:
            }
        }

        console.log(test(1));
    }
    expect: {
        console.log(function (foo) {
            if (foo === 1) return 1;
        }(1));
    }
}

remove_switch_9: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case 1:
            doSomethting();
            break;
          case 2:
          default:
            break;
          case 3:
        }
    }
    expect: {
        if (foo === 1) doSomethting();
    }
}

remove_switch_10: {
    options = {
        dead_code: true,
        switches: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (1) {
          case 0:
            var x = 1;
          case bar():
          default:
          case bar():
          case 1:
            console.log(x);
        }
        function bar() {}
    }
    expect: {
        var x;
        switch (1) {
          case bar():
          case bar():
        }
        console.log(x);
        function bar() {}
    }
    expect_stdout: ["undefined"]
}

remove_switch_11: {
    options = {
        dead_code: true,
        switches: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (1) {
          case 0:
            var x = 1;
          case 1:
            console.log(x);
        }
    }
    expect: {
        var x;
        console.log(x);
    }
    expect_stdout: ["undefined"]
}

remove_switch_12: {
    options = {
        dead_code: true,
        switches: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (1) {
          case 0:
            var x = 1;
          case foo():
            console.log('foo');
          case 1:
            console.log(x);
        }
        function foo() {}
    }
    expect: {
        if (1 === foo()) {
            var x;
            console.log('foo');
        }
        console.log(x);
        function foo() {}
    }
    expect_stdout: ["undefined"]
}

remove_switch_13: {
    options = {
        dead_code: true,
        switches: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (1) {
          case 0:
            var x = 1;
          case foo():
            console.log('foo');
            break;
          case 1:
            console.log(x);
        }
        function foo() {}
    }
    expect: {
        if (1 === foo()) {
            var x;
            console.log('foo');
        } else console.log(x);
        function foo() {}
    }
    expect_stdout: ["undefined"]
}

remove_switch_14: {
    options = {
        dead_code: true,
        switches: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        function test(foo) {
            var x = 1;
            switch (foo) {
              case 0:
              case 1:
              default:
              case x--:
                console.log(x);
            }
        }
        test(0);
        test(1);
        test(2);
    }
    expect: {
        function test(foo) {
            var x = 1;
            switch (foo) {
              case 0:
              case 1:
              case x--:
            }
            console.log(x);
        }
        test(0);
        test(1);
        test(2);
    }
    expect_stdout: ["1", "1", "0"]
}

remove_switch_15: {
    options = {
        dead_code: true,
        switches: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        function test(foo) {
            var x = 1;
            switch (foo) {
              case 0:
              default:
              case x--:
                console.log(x);
            }
        }
        test(0);
        test(1);
        test(2);
    }
    expect: {
        function test(foo) {
            var x = 1;
            switch (foo) {
              case 0:
              case x--:
            }
            console.log(x);
        }
        test(0);
        test(1);
        test(2);
    }
    expect_stdout: ["1", "0", "0"]
}

remove_switch_16: {
    options = {
        dead_code: true,
        switches: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        function test(foo) {
            var x = 1;
            switch (foo) {
              case 0:
              default:
              case x--:
            }
            console.log(x);
        }
        test(0);
        test(1);
        test(2);
    }
    expect: {
        function test(foo) {
            var x = 1;
            switch (foo) {
              case 0:
              case x--:
            }
            console.log(x);
        }
        test(0);
        test(1);
        test(2);
    }
    expect_stdout: ["1", "0", "0"]
}

collapse_into_default_1: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case 'bar':
            bar();
          case 'baz':
            baz();
          case 'qux':
          default:
            other();
        }
    }
    expect: {
        switch (foo) {
          case 'bar':
            bar();
          case 'baz':
            baz();
          default:
            other();
        }
    }
}

collapse_into_default_2: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case 'bar':
            bar();
          case 'baz':
            baz();
          default:
          case 'qux':
            other();
        }
    }
    expect: {
        switch (foo) {
          case 'bar':
            bar();
          case 'baz':
            baz();
          default:
            other();
        }
    }
}

collapse_into_default_3: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case qux:
          default:
            other();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case qux:
          default:
            other();
        }
    }
}

collapse_into_default_4: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          default:
          case qux:
            other();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          default:
          case qux:
            other();
        }
    }
}

collapse_into_default_5: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case 'qux':
          case qux:
          default:
            other();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case 'qux':
          case qux:
          default:
            other();
        }
    }
}

collapse_into_default_6: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case qux:
          case 'qux':
          default:
            other();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case qux:
          default:
            other();
        }
    }
}

collapse_into_default_7: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          default:
          case 'qux':
          case qux:
            other();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          default:
          case 'qux':
          case qux:
            other();
        }
    }
}

collapse_into_default_8: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          default:
          case qux:
          case 'qux':
            other();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          default:
          case qux:
            other();
        }
    }
}

collapse_into_default_9: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case 'qux':
          default:
          case qux:
            other();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case 'qux':
          default:
          case qux:
            other();
        }
    }
}

collapse_into_default_10: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case qux:
          default:
          case 'qux':
            other();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case baz:
            baz();
          case qux:
          default:
            other();
        }
    }
}

collapse_into_default_11: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case 'qux':
          case qux:
          default:
            other();
          case 'baz':
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case 'qux':
          case qux:
          default:
            other();
          case 'baz':
            baz();
        }
    }
}

collapse_into_default_12: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case qux:
          case 'qux':
          default:
            other();
          case 'baz':
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case qux:
          case 'qux':
          default:
            other();
          case 'baz':
            baz();
        }
    }
}

collapse_into_default_13: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          default:
          case 'qux':
          case qux:
            other();
          case 'baz':
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          default:
          case 'qux':
          case qux:
            other();
          case 'baz':
            baz();
        }
    }
}

collapse_into_default_14: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          default:
          case qux:
          case 'qux':
            other();
          case 'baz':
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          default:
          case qux:
          case 'qux':
            other();
          case 'baz':
            baz();
        }
    }
}

collapse_into_default_15: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case 'qux':
          default:
          case qux:
            other();
          case 'baz':
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case 'qux':
          default:
          case qux:
            other();
          case 'baz':
            baz();
        }
    }
}

collapse_into_default_16: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case qux:
          default:
          case 'qux':
            other();
          case 'baz':
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case qux:
          default:
          case 'qux':
            other();
          case 'baz':
            baz();
        }
    }
}

collapse_into_default_17: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case 'qux':
          case qux:
          default:
            other();
          case baz:
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case 'qux':
          case qux:
          default:
            other();
          case baz:
            baz();
        }
    }
}

collapse_into_default_18: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case qux:
          case 'qux':
          default:
            other();
          case baz:
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case qux:
          case 'qux':
          default:
            other();
          case baz:
            baz();
        }
    }
}

collapse_into_default_19: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          default:
          case 'qux':
          case qux:
            other();
          case baz:
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          default:
          case 'qux':
          case qux:
            other();
          case baz:
            baz();
        }
    }
}

collapse_into_default_20: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          default:
          case qux:
          case 'qux':
            other();
          case baz:
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          default:
          case qux:
          case 'qux':
            other();
          case baz:
            baz();
        }
    }
}

collapse_into_default_21: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case 'qux':
          default:
          case qux:
            other();
          case baz:
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case 'qux':
          default:
          case qux:
            other();
          case baz:
            baz();
        }
    }
}

collapse_into_default_22: {
    options = {
        dead_code: true,
        switches: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        module: true,
        evaluate: true,
    }
    input: {
        switch (foo) {
          case bar:
            bar();
          case qux:
          default:
          case 'qux':
            other();
          case baz:
            baz();
        }
    }
    expect: {
        switch (foo) {
          case bar:
            bar();
          case qux:
          default:
          case 'qux':
            other();
          case baz:
            baz();
        }
    }
}

issue_1663: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        var a = 100, b = 10;
        function f() {
            switch (1) {
              case 1:
                b = a++;
                return ++b;
              default:
                var b;
            }
        }
        f();
        console.log(a, b);
    }
    expect: {
        var a = 100, b = 10;
        function f() {
            var b;
            b = a++;
            return ++b;
        }
        f();
        console.log(a, b);
    }
    expect_stdout: true
}

drop_case: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 'bar': baz(); break;
          case 'moo':
            break;
        }
    }
    expect: {
        if (foo === 'bar') baz();
    }
}

drop_case_2: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 'bar': bar(); break;
          case 'moo':
          case moo:
          case 'baz':
            break;
        }
    }
    expect: {
        switch (foo) {
          case 'bar': bar();
          case 'moo':
          case moo:
        }
    }
}

keep_case: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 'bar': baz(); break;
          case moo:
            break;
        }
    }
    expect: {
        switch (foo) {
          case 'bar': baz();
          case moo:
        }
    }
}

if_else: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 'bar':
            bar();
            break;
          default:
            other();
        }
    }
    expect: {
        if (foo === 'bar') bar();
        else other();
    }
}

if_else2: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 'bar':
            bar();
          default:
            other();
        }
    }
    expect: {
        if (foo === 'bar') bar();
        other();
    }
}

if_else3: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          default:
            other();
            break;
          case 'bar':
            bar();
        }
    }
    expect: {
        if (foo === 'bar') bar();
        else other();
    }
}

if_else4: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          default:
            other();
          case 'bar':
            bar();
        }
    }
    expect: {
        if (foo !== 'bar') other();
        bar();
    }
}

if_else5: {
    options = {
        dead_code: true,
        switches: true,
        evaluate: true,
    }
    input: {
        switch (1) {
          case bar:
            bar();
            break;
          case 1:
            other();
        }
    }
    expect: {
      if (1 === bar) bar();
      else {
          1;
          other();
      }
    }
}

if_else6: {
    options = {
        dead_code: true,
        switches: true,
        evaluate: true,
    }
    input: {
        switch (1) {
          case bar:
            bar();
          case 1:
            other();
        }
    }
    expect: {
        if (1 === bar) bar();
        1;
        other();
    }
}

if_else7: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 'bar':
            break;
            bar();
          default:
            other();
        }
    }
    expect: {
        if (foo === 'bar');
        else other();
    }
}

if_else8: {
    options = {
        defaults: true,
    }
    input: {
        function test(foo) {
            switch (foo) {
            case 'bar':
                return 'PASS';
            default:
                return 'FAIL';
            }
        }
        console.log(test('bar'));
    }
    expect: {
        function test(foo) {
            return 'bar' === foo ? 'PASS' : 'FAIL';

        }
        console.log(test('bar'));
    }
    expect_stdout: ["PASS"]
}

issue_376: {
    options = {
        dead_code: true,
        evaluate: true,
        switches: true,
    }
    input: {
        switch (true) {
          case boolCondition:
            console.log(1);
            break;
          case false:
            console.log(2);
            break;
        }
    }
    expect: {
        if (true === boolCondition) console.log(1);
    }
}

issue_441_1: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case bar:
            qux();
            break;
          case baz:
            qux();
            break;
          default:
            qux();
            break;
        }
    }
    expect: {
        switch (foo) {
          case bar:
          case baz:
        }
        qux();
    }
}

issue_441_2: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case bar:
            qux();
            break;
          case fall:
          case baz:
            qux();
            break;
          default:
            qux();
            break;
        }
    }
    expect: {
        switch (foo) {
          case bar:
          case fall:
          case baz:
        }
        qux();
    }
}

issue_441_3: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case bar:
            qux();
            break;
          case fall:
          case baz:
            qux();
            break;
        }
    }
    expect: {
        switch (foo) {
          case bar:
          case fall:
          case baz:
            qux();
        }
    }
}

issue_441_4: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (foo) {
          case 1:
            qux();
            break;
          case fall1:
          case 2:
            qux();
            break;
          case 3:
            other();
            break;
          case 4:
            qux();
            break;
          case fall2:
          case 5:
            qux();
            break;
        }
    }
    expect: {
        switch (foo) {
          case 1:
          case fall1:
          case 2:
            qux();
            break;
          case 3:
            other();
            break;
          case 4:
          case fall2:
          case 5:
            qux()
        }
    }
}

issue_1674: {
    options = {
        dead_code: true,
        evaluate: true,
        side_effects: true,
        switches: true,
    }
    input: {
        switch (0) {
          default:
            console.log("FAIL");
            break;
          case 0:
            console.log("PASS");
            break;
        }
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_1679: {
    options = {
        dead_code: true,
        evaluate: true,
        switches: true,
        conditionals: true,
        side_effects: true,
    }
    input: {
        var a = 100, b = 10;
        function f() {
            switch (--b) {
              default:
              case !function x() {}:
                break;
              case b--:
                switch (0) {
                  default:
                  case a--:
                }
                break;
              case (a++):
                break;
            }
        }
        f();
        console.log(a, b);
    }
    expect: {
        var a = 100, b = 10;
        function f() {
            switch (--b) {
              default:
              case !function x() {}:
                break;
              case b--:
                a--;
              case (a++):
            }
        }
        f();
        console.log(a, b);
    }
    expect_stdout: ["99 8"]
}

issue_1680_1: {
    options = {
        dead_code: true,
        evaluate: true,
        switches: true,
    }
    input: {
        function f(x) {
            console.log(x);
            return x + 1;
        }
        switch (2) {
          case f(0):
          case f(1):
            f(2);
          case 2:
          case f(3):
          case f(4):
            f(5);
        }
    }
    expect: {
        function f(x) {
            console.log(x);
            return x + 1;
        }
        switch (2) {
          case f(0):
          case f(1):
            f(2);
          case 2:
            f(5);
        }
    }
    expect_stdout: [
        "0",
        "1",
        "2",
        "5",
    ]
}

issue_1680_2: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        var a = 100, b = 10;
        switch (b) {
          case a--:
            break;
          case b:
            var c;
            break;
          case a:
            break;
          case a--:
            break;
        }
        console.log(a, b);
    }
    expect: {
        var a = 100, b = 10;
        switch (b) {
          case a--:
          case b:
            var c;
          case a:
          case a--:
        }
        console.log(a, b);
    }
    expect_stdout: ["99 10"]
}

issue_1690_1: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (console.log("PASS")) {}
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_1690_2: {
    options = {
        dead_code: false,
        switches: true,
    }
    input: {
        switch (console.log("PASS")) {}
    }
    expect: {
        switch (console.log("PASS")) {}
    }
    expect_stdout: "PASS"
}

if_switch_typeof: {
    options = {
        conditionals: true,
        dead_code: true,
        side_effects: true,
        switches: true,
    }
    input: {
        if (a) switch(typeof b) {}
    }
    expect: {
        a;
    }
}

issue_1698: {
    options = {
        side_effects: true,
        switches: true,
    }
    input: {
        var a = 1;
        !function() {
            switch (a++) {}
        }();
        console.log(a);
    }
    expect: {
        var a = 1;
        !function() {
            switch (a++) {}
        }();
        console.log(a);
    }
    expect_stdout: "2"
}

issue_1705_1: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        var a = 0;
        switch (a) {
          default:
            console.log("FAIL");
          case 0:
            break;
        }
    }
    expect: {
        var a = 0;
        if (a !== 0) console.log("FAIL");
    }
    expect_stdout: true
}

issue_1705_2: {
    options = {
        dead_code: true,
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        switches: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = 0;
        switch (a) {
          default:
            console.log("FAIL");
          case 0:
            break;
        }
    }
    expect: {
    }
    expect_stdout: true
}

issue_1705_3: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        switch (a) {
          case 0:
            break;
          default:
            break;
        }
    }
    expect: {
        a;
    }
    expect_stdout: true
}

beautify: {
    beautify = {
        beautify: true,
    }
    input: {
        switch (a) {
          case 0:
          case 1:
            break;
          case 2:
          default:
        }
        switch (b) {
          case 3:
            foo();
            bar();
          default:
            break;
        }
    }
    expect_exact: [
        "switch (a) {",
        "  case 0:",
        "  case 1:",
        "    break;",
        "",
        "  case 2:",
        "  default:",
        "}",
        "",
        "switch (b) {",
        "  case 3:",
        "    foo();",
        "    bar();",
        "",
        "  default:",
        "    break;",
        "}",
    ]
}

issue_1758: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        var a = 1, b = 2;
        switch (a--) {
          default:
            b++;
        }
        console.log(a, b);
    }
    expect: {
        var a = 1, b = 2;
        a--;
        b++;
        console.log(a, b);
    }
    expect_stdout: "0 3"
}

issue_2535: {
    options = {
        dead_code: true,
        evaluate: true,
        switches: true,
    }
    input: {
        switch(w(), 42) {
            case 13: x();
            case 42: y();
            default: z();
        }
    }
    expect: {
        w(), 42;
        42;
        y();
        z();
    }
}

issue_1750: {
    options = {
        dead_code: true,
        evaluate: true,
        switches: true,
    }
    input: {
        var a = 0, b = 1;
        switch (true) {
          case a, true:
          default:
            b = 2;
          case true:
        }
        console.log(a, b);
    }
    expect: {
        var a = 0, b = 1;
        true;
        a, true;
        b = 2;
        console.log(a, b);
    }
    expect_stdout: "0 2"
}

issue_445: {
    mangle = true;
    input: {
        const leak = () => {}

        function scan() {
            let len = leak();
            let ch = 0;
            switch (ch = 123) {
                case "never-reached":
                    const ch = leak();
                    leak(ch);
            }
            return len === 123 ? "FAIL" : "PASS";
        }

        console.log(scan());
    }
    expect_stdout: "PASS"
}

collapse_same_branches: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 1:
                console.log("PASS");
                break

            case 2:
                console.log("PASS");
                break

        }
    }
    expect: {
        switch (id(1)) {
            case 1:
            case 2:
                console.log("PASS");
        }
    }
    expect_stdout: "PASS"
}

// Not when the branches are break-less
collapse_same_branches_2: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 1:
                console.log("PASS");

            case 2:
                console.log("PASS");
        }
    }
    expect: {
        switch (id(1)) {
            case 1:
                console.log("PASS");

            case 2:
                console.log("PASS");
        }
    }
    expect_stdout: ["PASS", "PASS"]
}

collapse_same_branches_not_in_a_row: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 1:
                console.log("PASS")
                break;
            case 2:
                console.log("FAIL");
                break;
            case 3:
                console.log("PASS");
                break;
        }
    }
    expect: {
        switch (id(1)) {
            case 1:
            case 3:
                console.log("PASS");
                break;
            case 2:
                console.log("FAIL");
        }
    }
    expect_stdout: ["PASS"]
}

collapse_same_branches_not_in_a_row2: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 1:
                console.log("PASS");
                break;
            case 2:
                console.log("FAIL");
                break;
            case 3:
                console.log("PASS");
                break;
            case 4:
                console.log("PASS");
                break;
        }
    }
    expect: {
        switch (id(1)) {
            case 1:
            case 3:
            case 4:
                console.log("PASS");
                break;
            case 2:
                console.log("FAIL");
        }
    }
    expect_stdout: ["PASS"]
}

collapse_same_branches_not_in_a_row_including_fallthrough_with_same_body: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 1:
                console.log("PASS");
                break;
            case 2:
                console.log("FAIL");
                break;
            case 3:
            case 4:
                console.log("PASS");
                break;
            case 9:
                console.log("FAIL");
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                console.log("PASS");
                break;
        }
    }
    expect: {
        switch (id(1)) {
            case 1:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                console.log("PASS");
                break;
            case 2:
            case 9:
                console.log("FAIL");
        }
    }
    expect_stdout: ["PASS"]
}

collapse_same_branches_not_in_a_row_ensure_no_side_effects: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        let i = 1;
        switch (id(2)) {
            case 1:
                console.log(1);
                break;
            case 2:
                console.log(2);
                break;
            case ++i:
                console.log(1);
                break;
        }
    }
    expect: {
        let i = 1;
        switch (id(2)) {
            case 1:
                console.log(1);
                break;
            case 2:
                console.log(2);
                break;
            case ++i:
                console.log(1);
        }
    }
    expect_stdout: ["2"]
}

collapse_same_branches_not_in_a_row_ensure_no_evaluate_elad: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        let i = 1;
        switch (true) {
            case 3 == i:
                console.log(i);
                break;
            case 5 == i:
                console.log(5);
                break;
            case 1 == i:
                console.log(i);
                break;
        }
    }
    expect: {
        let i = 1;
        switch (true) {
            case 3 == i:
                console.log(i);
                break;
            case 5 == i:
                console.log(5);
                break;
            case 1 == i:
                console.log(i);
        }
    }
    expect_stdout: ["1"]
}

collapse_same_branches_not_in_a_row_even_if_last_case_without_abort: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(3)) {
            case 1:
                console.log(1);
                break;
            case 2:
                console.log(2);
                break;
            case 3:
                console.log(1);
        }
    }
    expect: {
        switch (id(3)) {
            case 1:
            case 3:
                console.log(1);
                break;
            case 2:
                console.log(2);
        }
    }
    expect_stdout: ["1"]
}


collapse_same_branches_as_default_not_in_a_row: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 1:
                console.log("PASS");
                break;
            case 2:
                console.log("FAIL");
                break;
            case 3:
                console.log("PREVENT_IFS");
                break;
            case 4:
                console.log("PASS");
                break;
            default:
                console.log("PASS");
                break;
        }
    }
    expect: {
        switch (id(1)) {
            case 1:
            case 4:
            default:
                console.log("PASS");
                break;
            case 2:
                console.log("FAIL");
                break;
            case 3:
                console.log("PREVENT_IFS");
        }
    }
    expect_stdout: ["PASS"]
}

collapse_same_branches_in_a_row2: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 1:
                console.log("PASS");
                break;
            case 2:
                console.log("FAIL");
                break;
            case 3:
                console.log("PASS");
                break;
            case 4:
                console.log("FAIL");
                break;
        }
    }
    expect: {
        switch (id(1)) {
            case 1:
            case 3:
                console.log("PASS");
                break;
            case 2:
            case 4:
                console.log("FAIL");
        }
    }
    expect_stdout: ["PASS"]
}

collapse_same_branches_in_a_row_with_return: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        function fn() {
            switch (id(1)) {
                case 1:
                    return "PASS";
                case 2:
                    return "FAIL";
                case 3:
                    return "PASS";
                case 4:
                    return "FAIL";
            }
        }
        console.log(fn())
    }
    expect: {
        function fn() {
            switch (id(1)) {
                case 1:
                case 3:
                    return "PASS";
                case 2:
                case 4:
                    return "FAIL";
            }
        }
        console.log(fn())
    }
    expect_stdout: ["PASS"]
}

// Empty branches at the end of the switch get trimmed
trim_empty_last_branches: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 1:
                console.log("PASS")
            case 2:
                // break should be removed too
                break
            case 3: {}
            case 4:
        }
    }
    expect: {
        if (id(1) === 1) console.log("PASS")
    }
    expect_stdout: "PASS"
}

// ... But break should be kept if we're breaking to somewhere else
trim_empty_last_branches_2: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        somewhere_else: if (id(true)) {
            switch (id(1)) {
                case 1:
                    console.log("PASS")
                case 2:
                    break somewhere_else
                case 3: {}
                case 4:
            }
        }
    }
    expect: {
        somewhere_else: if (id(true))
            switch (id(1)) {
                case 1:
                    console.log("PASS")
                case 2:
                    break somewhere_else
            }
    }
    expect_stdout: "PASS"
}

trim_empty_last_branches_3: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 1:
                console.log("PASS")
            case 2:
                "no side effect"
        }
    }
    expect: {
        if (id(1) === 1) console.log("PASS")
    }
    expect_stdout: "PASS"
}

trim_side_effect_free_branches_falling_into_default: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case 0:
                "no side effect"
            case 1:
                // Not here either
            default:
                console.log("PASS default")
            case 2:
                console.log("PASS 2")
        }
    }
    expect: {
        switch (id(1)) {
            case 0:
                "no side effect"
            case 1:
                // Not here either
            default:
                console.log("PASS default")
            case 2:
                console.log("PASS 2")
        }
    }
}

trim_side_effect_free_branches_falling_into_default_2: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            default:
            case 0:
                "no side effect"
            case 1:
                console.log("PASS default")
            case 2:
                console.log("PASS 2")
        }
    }
    expect: {
        switch (id(1)) {
            default:
            case 0:
                "no side effect"
            case 1:
                console.log("PASS default")
            case 2:
                console.log("PASS 2")
        }
    }
}

gut_entire_switch: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(123)) {
            case 1:
            case 2:
            case 3:
            default:
                console.log("PASS");
        }
    }
    expect: {
        id(123); console.log("PASS");
    }
    expect_stdout: "PASS"
}

gut_entire_switch_2: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(123)) {
            case 1:
                "no side effect"
            case 1:
                // Not here either
            default:
                console.log("PASS");
        }
    }
    expect: {
        id(123); console.log("PASS");
    }
    expect_stdout: "PASS"
}

turn_into_if: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case id(2):
                console.log("FAIL");
        }
        console.log("PASS");
    }
    expect: {
        if (id(1) === id(2)) console.log("FAIL");
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

turn_into_if_2: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        switch (id(1)) {
            case id(2):
                console.log("FAIL");
            default:
                console.log("PASS");
        }
    }
    expect: {
        if (id(1) === id(2)) console.log("FAIL");
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_1083_1: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                case definitely_true:
                default:
                    console.log("PASS");
                    break;
                case maybe_true:
                    console.log("FAIL");
                    break;
            }
        }
        test(true, false);
        test(true, true);
    }
    expect: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                case definitely_true:
                default:
                    console.log("PASS");
                    break;
                case maybe_true:
                    console.log("FAIL");
            }
        }
        test(true, false);
        test(true, true);
    }
    expect_stdout: ["PASS", "PASS"]
}

issue_1083_2: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                case definitely_true:
                default:
                    console.log("PASS");
                    break;
                case maybe_true:
                    console.log("FAIL");
                    break;
            }
        }
        test(true, false);
        test(true, true);
    }
    expect: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                case definitely_true:
                default:
                    console.log("PASS");
                    break;
                case maybe_true:
                    console.log("FAIL");
            }
        }
        test(true, false);
        test(true, true);
    }
    expect_stdout: ["PASS", "PASS"]
}

issue_1083_3: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                case maybe_true:
                    console.log("maybe");
                    break;
                default:
                case definitely_true:
                    console.log("definitely");
                    break;
            }
        }
        test(true, false);
        test(true, true);
    }
    expect: {
        function test(definitely_true, maybe_true) {
            if (true === maybe_true) console.log("maybe");
            else console.log("definitely");
        }
        test(true, false);
        test(true, true);
    }
    expect_stdout: ["definitely", "maybe"]
}

issue_1083_4: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                case maybe_true:
                    console.log("maybe");
                    break;
                case definitely_true:
                default:
                    console.log("definitely");
                    break;
            }
        }
        test(true, false);
        test(true, true);
    }
    expect: {
        function test(definitely_true, maybe_true) {
            if (true === maybe_true) console.log("maybe");
            else console.log("definitely");
        }
        test(true, false);
        test(true, true);
    }
    expect_stdout: ["definitely", "maybe"]
}

issue_1083_5: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                default:
                    console.log("definitely");
                    break;
                case maybe_true:
                    console.log("maybe");
                    break;
                case definitely_true:
                    console.log("definitely");
                    break;
            }
        }
        test(true, false);
        test(true, true);
    }
    expect: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                default:
                    console.log("definitely");
                    break;
                case maybe_true:
                    console.log("maybe");
                    break;
                case definitely_true:
                    console.log("definitely");
            }
        }
        test(true, false);
        test(true, true);
    }
    expect_stdout: ["definitely", "maybe"]
}

issue_1083_6: {
    options = {
        switches: true,
        dead_code: true
    }
    input: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                case definitely_true:
                    console.log("definitely");
                    break;
                case maybe_true:
                    console.log("maybe");
                    break;
                default:
                    console.log("definitely");
                    break;
            }
        }
        test(true, false);
        test(true, true);
    }
    expect: {
        function test(definitely_true, maybe_true) {
            switch (true) {
                case definitely_true:
                    console.log("definitely");
                    break;
                case maybe_true:
                    console.log("maybe");
                    break;
                default:
                    console.log("definitely");
            }
        }
        test(true, false);
        test(true, true);
    }
    expect_stdout: ["definitely", "definitely"]
}

side_effectful_case: {
    options = {
        dead_code: true,
        switches: true,
    }
    input: {
        var c = "FAIL";
        switch (0) {
          case c = "PASS", 0:
        }
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        if (0 === (c="PASS", 0));
        console.log(c);
    }
    expect_stdout: "PASS"
}

