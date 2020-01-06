class_recursive_refs: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        class a {
          set() {
            class b {
              set [b] (c) {}
            }
          }
        }

        class b {
            constructor() {
                b();
            }
        }

        class c {
            [c] = 42;
        }
    }
    expect: {
        
    }
}
