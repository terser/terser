
const is = Object.is || ((a, b) => {
    if (isNaN(a)) return isNaN(b);
    return a === b;
});

export class Type {
    constructor(types) {
        if (new.target === Type) {
            return new GenericType(types);
        } else {
            this.types = types;
        }
    }

    OR(other) {
        if (other === UnknownType) return other;

        const all_types = new Set([...this.types, ...other.types]);
        return new GenericType([...all_types]);
    }

    equals(other) {
        throw new Error("not implemented (Type.equals)");
    }

    is_truthy() {
        return undefined;
    }
}

export class GenericType extends Type {
    constructor(types) {
        super(types);
    }

    OR(other) {
        if (other === UnknownType || this.equals(other)) return other;

        return super.OR(other);
    }

    equals(other) {
        return other === this
            || other instanceof GenericType
                && this.types.length === other.types.length
                && this.types.every((type, i) => type === other.types[i]);
    }

    is_truthy() {
        return undefined;
    }
}

export class LiteralType extends Type {
    constructor(value) {
        super([typeof value]);
        this.value = value;
    }

    OR(other) {
        if (other === UnknownType || this.equals(other)) return other;

        return super.OR(other);
    }

    equals(other) {
        return other === this
            || other instanceof LiteralType
                && is(other.value, this.value);
    }


    is_truthy() {
        return !!this.value;
    }
}

export class FunctionType extends Type {
    constructor(node, parent_world) {
        super(["function"]);
        this.node = node;
        this.parent_world = parent_world;
    }

    OR(other) {
        if (other === UnknownType || this.equals(other)) return other;

        return super.OR(other);
    }

    equals(other) {
        return other === this
            || other instanceof FunctionType
                && other.node === this.node
                && other.parent_world === this.parent_world;
    }

    is_truthy() {
        return true;
    }
}

export const UnknownType = new (class extends Type {
    constructor() { super([]); }

    OR(_other) { return this; }
    is_truthy() { return undefined; }
})();

