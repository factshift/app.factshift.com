import { AstNode } from '../node/node.mjs';
export class Scope {
    constructor(parent, context = undefined) {
        var _a, _b;
        this._generation = ((_a = parent === null || parent === void 0 ? void 0 : parent._generation) !== null && _a !== void 0 ? _a : -1) + 1;
        this._context = context !== null && context !== void 0 ? context : parent;
        this._root = (_b = parent._root) !== null && _b !== void 0 ? _b : parent;
    }
    spawn(context) {
        return new Scope(this, context);
    }
    key(item) {
        return item;
    }
    *loop(seed) {
        if (Array.isArray(seed)) {
            for (const i of seed) {
                yield seed;
            }
            return;
        }
        if (!seed)
            return;
        const node = new AstNode(seed);
        yield* node.produce();
    }
}
