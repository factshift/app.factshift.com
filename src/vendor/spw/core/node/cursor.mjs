var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Cursor_parent, _Cursor_token;
import { _debug } from '../../config.mjs';
import { Token }  from './token/token.mjs';
export class Cursor {
    constructor(parent, former) {
        var _a;
        _Cursor_parent.set(this, void 0);
        _Cursor_token.set(this, void 0);
        this.__log_taken = [];
        this.offset = (parent === null || parent === void 0 ? void 0 : parent.offset) || 0;
        this.start = (_a = former === null || former === void 0 ? void 0 : former.start) !== null && _a !== void 0 ? _a : this.offset;
        this.input = parent === null || parent === void 0 ? void 0 : parent.input;
        this.generators = parent === null || parent === void 0 ? void 0 : parent.generators;
        this.level = typeof (parent === null || parent === void 0 ? void 0 : parent.level) !== 'undefined' ? parent.level + 1 : 0;
        __classPrivateFieldSet(this, _Cursor_parent, (former || parent) || undefined, "f");
        __classPrivateFieldSet(this, _Cursor_token, null, "f");
    }
    spawn(former) {
        const Constructor = this.constructor;
        return new Constructor(this, former);
    }
    get parent() {
        return __classPrivateFieldGet(this, _Cursor_parent, "f");
    }
    setOffset(cursor) {
        this.offset = cursor.offset;
    }
    curr() {
        return this.input[this.offset];
    }
    *scan(generatorArray = undefined, former) {
        const generators = generatorArray !== null && generatorArray !== void 0 ? generatorArray : this.generators;
        if (!generators)
            throw new Error('Cannot scan without generators');
        let activeCursor = former;
        for (const generator of generators) {
            const cursor = yield* generator(this, activeCursor);
            const token = cursor ? cursor.getToken() : false;
            if (!token)
                continue;
            this.setOffset(cursor);
            if (token !== (activeCursor === null || activeCursor === void 0 ? void 0 : activeCursor.getToken())) {
                yield cursor;
            }
            activeCursor = cursor;
        }
        return activeCursor;
    }
    /**
     *
     * @param item
     * @returns {Generator<string, void, *>}
     */
    *log(item) {
        if (_debug) {
            const tabs = '\t'.repeat(this.level);
            const tabbedLabel = `${tabs}${this}`;
            yield tabbedLabel;
            const tabbedMessage = `${tabs}\t${item.message}`;
            yield tabbedMessage;
            if (item.miss)
                yield `${tabs}\t\treason: ${item.miss}`;
        }
    }
    /**
     *
     * @returns {Generator<{offset, kind: string}, {offset, kind: string}, *>}
     */
    *take() {
        const pos = this.pos();
        this.__log_taken.push(pos);
        yield pos;
        this.advance();
        return pos;
    }
    advance() {
        this.offset = this.offset + 1;
    }
    pos() {
        return {
            kind: 'pos',
            offset: this.offset,
        };
    }
    getToken() {
        return __classPrivateFieldGet(this, _Cursor_token, "f");
    }
    token(token) {
        var _a;
        if (token === false) {
            __classPrivateFieldSet(this, _Cursor_token, token, "f");
            return this;
        }
        __classPrivateFieldSet(this, _Cursor_token, (_a = __classPrivateFieldGet(this, _Cursor_token, "f")) !== null && _a !== void 0 ? _a : new Token(this), "f");
        Object.assign(__classPrivateFieldGet(this, _Cursor_token, "f"), token);
        return this;
    }
    static isCursorPosition(cursor) {
        if (!cursor)
            return false;
        return typeof cursor.offset !== 'undefined' && cursor.kind === 'pos';
    }
}
_Cursor_parent = new WeakMap(), _Cursor_token = new WeakMap();
export class CharacterCursor extends Cursor {
    static isCharacterCursor(cursor) {
        return typeof (cursor === null || cursor === void 0 ? void 0 : cursor.start) !== 'undefined';
    }
    toString() {
        const json = this.toJSON();
        return `(line: ${json.start.line}, col: ${json.start.col})`;
    }
    pos() {
        return Object.assign(Object.assign({}, super.pos()), { key: this.curr() });
    }
    toJSON() {
        var _a, _b;
        const offset = this.offset - 1;
        const startSplit = this.input.slice(0, this.start).split('\n');
        const startLine = startSplit.length;
        const text = this.text;
        const midSplit = text.split('\n');
        return {
            level: this.level,
            start: {
                line: startLine,
                col: (((_a = startSplit.pop()) === null || _a === void 0 ? void 0 : _a.length) || 1) - 1,
                offset: this.start,
            },
            end: {
                line: startLine + midSplit.length - 1,
                col: (((_b = midSplit.pop()) === null || _b === void 0 ? void 0 : _b.length) || 1) - 1,
                offset: offset,
            },
            text: text,
            // parent: this.#parent?.level ? this.#parent : undefined
        };
    }
    get text() {
        return this.input.slice(this.start, this.offset);
    }
}
