import { RecursiveReductionLens } from '../../lens/recursiveReductionLens.mjs';
export class Token {
    constructor(cursor) {
        this._kind = [];
        this.cursor = cursor;
    }
    set kind(kind) {
        this._kind.push(kind);
    }
    get kind() {
        return this._kind.join(' ');
    }
    get identity() {
        const all = [];
        const lens = new RecursiveReductionLens(this);
        for (const location of lens.locate(this)) {
            const curr = lens.reduce(this, location);
            curr && all.push(curr);
        }
        const self = [this.head, this.body, this.tail];
        const kind = this.kind;
        function keys(curr) {
            return curr.key ? curr.key
                : (Array.isArray(curr) ? curr.map(keys).join('') : curr);
        }
        return all.reduce((all, curr) => '' + all + keys(curr), '');
    }
    toJSON() {
        return Object.fromEntries(Object.entries({
            identity: this.identity,
            kind: [...this._kind].join(Token.kindJunctionStr),
            head: this.head,
            body: this.body,
            tail: this.tail,
        }).filter(([, v]) => !!v));
    }
}
Token.kindJunctionStr = ' + ';
