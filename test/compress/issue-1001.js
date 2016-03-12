
issue_1001: {
    input: {
        function x(col) {
            return col.slice(0, col.indexOf('('));
        }
    }
    expect: {
        function x(col) { return col.slice(0, col.indexOf('(')); }
    }
}

