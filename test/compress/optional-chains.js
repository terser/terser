issue_1586_optional_chain_inlined: {
    options = {
        module: true,
        inline: true,
        unused: true,
        reduce_vars: true,
    }
    input: {
        const fn = () => (foo(), bar())
        obj = {
            prop: fn?.(),
        }
    }
    expect: {
        obj = {
            prop: (foo(), bar()),
        }
    }
}

issue_1586_optional_chain_inlined_2: {
    options = {
        inline: true,
    }
    input: {
        obj = {
            prop: (() => (foo(), bar()))?.(),
        }
    }
    expect: {
        obj = {
            prop: (foo(), bar()),
        }
    }
}
