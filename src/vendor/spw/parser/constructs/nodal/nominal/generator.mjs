import { beginsNominal }    from './cursor/beginsNominal.mjs';
import { continuesNominal } from './cursor/continuesNominal.mjs';
import { takeDefinition }   from './parts/definition.mjs';
export function* nominal(start, prev) {
    const cursor = start.spawn(prev);
    cursor.token({ kind: 'nominal' });
    yield* cursor.log({ message: 'checking nominal' });
    if (prev) {
        yield* cursor.log({
            message: 'not nominal',
            miss: 'cannot follow prev',
        });
        return prev;
    }
    const key = yield* loop(cursor);
    if (!key.length) {
        yield* cursor.log({
            message: 'not nominal',
            miss: 'no key',
        });
        return false;
    }
    yield* cursor.log({ message: 'resolving nominal' });
    const head = { key: key };
    cursor.token({ head: head });
    yield* takeDefinition(cursor);
    return cursor;
}
function* loop(cursor) {
    const key = [];
    {
        let started;
        let _check = beginsNominal;
        while (cursor.curr() && _check(cursor.curr())) {
            if ((!started) && (started = true))
                yield* cursor.log({ message: 'beginning nominal' });
            key.push(cursor.curr());
            yield* cursor.take();
            _check = continuesNominal;
        }
    }
    return key.join('');
}
