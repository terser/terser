
transform_dynamic_import: {
    options = {
        evaluate: true
    }
    input: {
        import("operation " + "inside dynamic import")
    }
    expect: {
        import("operation inside dynamic import")
    }
}
