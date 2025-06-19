import { beginsContainer }              from './cursor/beginsContainer.mjs';
import { takeSpaces }                   from '../../operational/semantic/phrasal/cursor/motions/takeSpaces.mjs';
import { _operator }                    from '../../operational/generator.builder.mjs';
import { containerPartOptions }         from './parts/parts.mjs';
import { containerDelimitingOperators } from './parts/operators.mjs';
export function* container(start, prev) {
    const cursor = start.spawn(prev);
    cursor.token({ kind: 'container' });
    yield* cursor.log({ message: 'checking container' });
    if (prev) {
        yield* cursor.log({
            message: 'not container',
            miss: 'prev',
        });
        return prev;
    }
    if (!beginsContainer(start)) {
        yield* cursor.log({
            message: 'not container',
            miss: 'cursor cannot start container',
        });
        return false;
    }
    const { head, body, tail } = yield* loop(cursor);
    cursor.token({ kind: head.proto.name.split('.')[0] });
    yield* cursor.log({ message: 'resolving container' });
    cursor.token({ head, body, tail });
    return cursor;
}
function* loop(cursor) {
    var _a, _b;
    const open = containerDelimitingOperators.open;
    const operator = yield* cursor.scan([_operator(open)]);
    const head = operator === null || operator === void 0 ? void 0 : operator.getToken();
    const label = (_a = head === null || head === void 0 ? void 0 : head.label) === null || _a === void 0 ? void 0 : _a.key;
    const close = containerDelimitingOperators.close._inverse[head.proto.key];
    if (!close)
        throw new Error('could not resolve type');
    yield* takeSpaces(cursor);
    let started;
    let tail;
    const body = [];
    while (cursor.curr()) {
        if ((!started) && (started = true))
            yield* cursor.log({ message: 'beginning container' });
        yield* takeSpaces(cursor);
        const delimiterScanner = yield* cursor.scan([_operator({ [close.key]: close })]);
        const _delimiter = delimiterScanner === null || delimiterScanner === void 0 ? void 0 : delimiterScanner.getToken();
        const tailLabel = (_b = _delimiter === null || _delimiter === void 0 ? void 0 : _delimiter.label) === null || _b === void 0 ? void 0 : _b.key;
        if (_delimiter) {
            if (tailLabel === label || !(tailLabel && label)) {
                tail = _delimiter;
                break;
            }
            body.push(_delimiter);
            yield* takeSpaces(cursor);
        }
        const statement = yield* cursor.scan(containerPartOptions);
        if (!statement)
            break;
        body.push(statement === null || statement === void 0 ? void 0 : statement.getToken());
        yield* takeSpaces(cursor);
    }
    return { head, body, tail };
}
