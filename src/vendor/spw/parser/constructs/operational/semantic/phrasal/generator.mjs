import { isPhrasalDelimiter } from './cursor/checks/isPhrasalDelimiter.mjs';
import { phrasalPartOptions } from './parts/parts.mjs';
import { takeSpaces }         from './cursor/motions/takeSpaces.mjs';
export function* phrasal(start, prev) {
    const cursor = start.spawn(prev);
    cursor.token({ kind: 'phrasal' });
    yield* cursor.log({ message: 'checking phrasal' });
    if (!prev) {
        yield* cursor.log({
            message: 'not phrasal',
            miss: 'no head',
            cursors: { start, prev },
        });
        return false;
    }
    const { head, body, tail, operators } = yield* bodyLoop(cursor, prev);
    if (!tail) {
        yield* cursor.log({
            message: 'not phrasal',
            miss: 'no tail',
            cursors: { start, prev, cursor },
            info: {
                head,
                body,
                tail,
                operators,
            },
        });
        return prev !== null && prev !== void 0 ? prev : false;
    }
    yield* cursor.log({
        message: 'resolving phrasal',
    });
    cursor.token({
        head,
        body,
        tail,
        operators,
    });
    return cursor;
}
function* bodyLoop(cursor, prev) {
    const head = prev && prev.getToken();
    const body = [];
    const operators = [];
    {
        let started = false;
        while (isPhrasalDelimiter(cursor)) {
            if ((!started) && (started = true))
                yield* cursor.log({ message: 'beginning ordinal' });
            const operator = yield* takeSpaces(cursor);
            operators.push(operator);
            yield* takeSpaces(cursor);
            const _cursor = yield* cursor.scan(phrasalPartOptions);
            const token = _cursor ? _cursor.getToken() : null;
            if (!token)
                break;
            body.push(token);
        }
    }
    const tail = body.pop();
    return { head, body, tail, operators };
}
