parentheses_around_inverted_private_in: {
    input: {
        class X {
            #y;

            z() {
                if(!(#y in this)) {
                    return 0;
                }
            }
        }
    }

    expect: {
        class X{#y;z(){if(!(#y in this))return 0}}
    }
}

no_parentheses_around_private_in: {
    input: {
        class X {
            #y;

            z() {
                if(#y in this) {
                    return 0;
                }
            }
        }
    }

    expect: {
        class X{#y;z(){if(#y in this)return 0}}
    }
}