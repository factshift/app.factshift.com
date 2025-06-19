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
var _a, _Scanner_lens, _Scanner_handleError, _Scanner_handleSuccess, _Scanner_checkCursor;
import { CharacterCursor } from './node/cursor.mjs';
export class Scanner {
    constructor(lens) {
        _Scanner_lens.set(this, void 0);
        __classPrivateFieldSet(this, _Scanner_lens, lens, "f");
    }
    *scan(input) {
        let error = undefined;
        let prevCursor = undefined;
        let cursor = __classPrivateFieldGet(this, _Scanner_lens, "f").getCursor(input);
        yield* cursor.log({ message: 'beginning loop' });
        while (cursor.curr()) {
            cursor = yield* cursor.scan();
            if (!cursor) {
                yield {
                    error: true,
                    message: 'did not generate a token',
                };
                break;
            }
            try {
                prevCursor = yield* __classPrivateFieldGet(Scanner, _a, "m", _Scanner_checkCursor).call(Scanner, cursor, prevCursor);
            }
            catch (e) {
                cursor = false;
                error = e;
                break;
            }
        }
        if (cursor) {
            yield* __classPrivateFieldGet(Scanner, _a, "m", _Scanner_handleSuccess).call(Scanner, cursor);
            return cursor.getToken();
        }
        yield* __classPrivateFieldGet(Scanner, _a, "m", _Scanner_handleError).call(Scanner, error);
        return false;
    }
    getCursor(input) {
        return new CharacterCursor({ input });
    }
}
_a = Scanner, _Scanner_lens = new WeakMap(), _Scanner_handleError = function* _Scanner_handleError(error) {
    yield {
        success: false,
        error: true,
        message: {
            error,
        },
    };
    yield false;
}, _Scanner_handleSuccess = function* _Scanner_handleSuccess(cursor) {
    yield* cursor.log({
        success: true,
        message: 'ending loop',
    });
    yield cursor.getToken();
}, _Scanner_checkCursor = function* _Scanner_checkCursor(cursor, prevCursor) {
    const currentToken = cursor ? cursor.getToken() : null;
    if (!currentToken && prevCursor) {
        yield* cursor.log({
            error: true,
            message: 'token stream broke',
            info: { currentToken, prevCursor },
        });
        throw new Error('token stream broke');
    }
    if ((prevCursor === null || prevCursor === void 0 ? void 0 : prevCursor.offset) === cursor.offset) {
        yield* cursor.log({
            error: true,
            message: 'cursor did not change positions',
        });
        throw new Error('token stream broke');
    }
    return cursor;
};
