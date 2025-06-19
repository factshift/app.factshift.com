import { Scope }  from './scope.mjs';
import { Cursor } from '../node/cursor.mjs';
export class Lens {
    constructor(source = undefined) {
        this.generators = [];
        this.Cursor = Cursor;
        this.source = source;
    }
    getCursor(input) {
        return new (this.Cursor)({ input, generators: this.generators });
    }
    *locate(element) {
        yield new Scope(element);
    }
}
