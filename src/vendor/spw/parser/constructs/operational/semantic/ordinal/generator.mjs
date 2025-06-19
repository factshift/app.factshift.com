import { isOrdinalDelimiter }         from './cursor/checks/isOrdinalDelimiter.mjs';
import { ordinalPartOptions }         from './parts/parts.mjs';
import { takeSpaces }                 from '../phrasal/cursor/motions/takeSpaces.mjs';
import { _operator }                  from '../../generator.builder.mjs';
import { ordinalDelimitingOperators } from '../operators.mjs';
export function* ordinal(start, prev) {
    const cursor = start.spawn(prev);
    cursor.token({ kind: 'ordinal' });
    yield* cursor.log({ message: 'checking ordinal' });
    const { head, body, tail, operators } = yield* loop(cursor, prev);
    if (!operators.length) {
        yield* cursor.log({
            message: 'not ordinal',
            miss: 'no operators',
        });
        return prev !== null && prev !== void 0 ? prev : false;
    }
    yield* cursor.log({ message: 'resolving ordinal' });
    cursor.token({
        head,
        body,
        tail,
        operators,
    });
    return cursor;
}
const operational = _operator(ordinalDelimitingOperators);
function* loop(cursor, prev) {
    yield* takeSpaces(cursor);
    const head = prev && prev.getToken();
    const body = [];
    const operators = [];
    let group;
    {
        let started = false;
        while (isOrdinalDelimiter(cursor)) {
            if ((!started) && (started = true))
                yield* cursor.log({ message: 'beginning ordinal' });
            yield* takeSpaces(cursor);
            const operatorScanner = yield* cursor.scan([operational]);
            const operator = operatorScanner === null || operatorScanner === void 0 ? void 0 : operatorScanner.getToken();
            if (!operator)
                break;
            !group && operators.push(group = []);
            group.push(operator);
            yield* takeSpaces(cursor);
            const bodyScanner = yield* cursor.scan(ordinalPartOptions);
            let token = bodyScanner ? bodyScanner.getToken() : null;
            if (!token) {
                token = null;
            }
            else {
                group = null;
            }
            body.push(token);
            yield* takeSpaces(cursor);
        }
    }
    const tail = body.pop();
    return { head, body, tail, operators };
}
