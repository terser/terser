prematurely_evaluate_assignment: {
    options = {
        toplevel: true,
        reduce_vars: true,
        evaluate: true,
        unused: true
    }

    input: {
        var or = null
        var null_coalesce = null
        var and = 'FAIL'

        or ||= 'PASS'
        null_coalesce ??= 'PASS'
        and &&= 'PASS'

        console.log(or, null_coalesce, and)
    }

    expect: {
        var or = null
        var null_coalesce = null
        var and = 'FAIL'

        or ||= 'PASS'
        null_coalesce ??= 'PASS'
        and &&= 'PASS'

        console.log(or, null_coalesce, and)
    }

    expect_stdout: ["PASS PASS PASS"]

    node_version = ">=15"
}

prematurely_evaluate_assignment_inv: {
    options = {
        toplevel: true,
        reduce_vars: true,
        evaluate: true,
        unused: true
    }

    input: {
        var or = 'PASS'
        var null_coalesce = 'PASS'
        var and = 'FAIL'

        or ||= 'FAIL'
        null_coalesce ??= 'FAIL'
        and &&= 'PASS'

        console.log(or, null_coalesce, and)
    }

    expect: {
        var or = 'PASS'
        var null_coalesce = 'PASS'
        var and = 'FAIL'

        or ||= 'FAIL'
        null_coalesce ??= 'FAIL'
        and &&= 'PASS'

        console.log(or, null_coalesce, and)
    }

    expect_stdout: ["PASS PASS PASS"]

    node_version = ">=15"
}

assign_in_conditional_part: {
    options = {
        toplevel: true,
        evaluate: true,
        reduce_vars: true,
        unused: true
    }

    input: {
        var status = 'PASS'
        var nil = null
        var nil_prop = { prop: null }

        nil &&= console.log(status = 'FAIL')
        nil_prop.prop &&= console.log(status = 'FAIL')

        console.log(status)
    }

    expect: {
        var status = 'PASS';
        var nil = null;

        nil &&= console.log(status = 'FAIL');
        ({prop: null}).prop &&= console.log(status = 'FAIL');

        console.log(status);
    }

    expect_stdout: "PASS"

    node_version = ">=15"
}

assign_in_conditional_part_reused: {
    options = {
        toplevel: true,
        evaluate: true,
        reduce_vars: true,
        unused: true
    }

    input: {
        var status = 'PASS'
        var nil = null
        var nil_prop = { prop: null }

        nil &&= console.log(status = 'FAIL')
        nil_prop.prop &&= console.log(status = 'FAIL')

        console.log(status, nil, nil_prop.prop)
    }

    expect: {
        var status = 'PASS'
        var nil = null
        var nil_prop = { prop: null }

        nil &&= console.log(status = 'FAIL')
        nil_prop.prop &&= console.log(status = 'FAIL')

        console.log(status, nil, nil_prop.prop)
    }

    expect_stdout: "PASS null null"

    node_version = ">=15"
}

assignment_in_left_part: {
    options = {
        toplevel: true,
        evaluate: true,
        reduce_vars: true,
        unused: true
    }

    input: {
        var status = 'FAIL'
        var x = {}

        x[status = 'PASS'] ||= 1

        console.log(status)
    }

    /*
    expect: {
    }
    */

    expect_stdout: "PASS"

    node_version = ">=15"
}

assignment_in_left_part_2: {
    options = {
        toplevel: true,
        evaluate: true,
        reduce_vars: true,
        unused: true
    }

    input: {
        var status = 'FAIL'
        var x = {'PASS': false}

        x[status = id('PASS')] ||= 'PASS'

        console.log(status, x.PASS)
    }

    expect: {
        var status;
        var x = {'PASS': false}

        x[status = id('PASS')] ||= 'PASS'

        console.log(status, x.PASS)
    }

    expect_stdout: "PASS PASS"

    node_version = ">=15"
}

logical_assignment_not_always_happens: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        let result = 'PASS'
        let x;

        x &&= result = 'FAIL'

        console.log(result)
    }
    expect_stdout: "PASS"
    node_version: ">=15"
}
