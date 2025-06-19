import { beginsAnything }    from './cursor/beginsAnything.mjs';
import { continuesAnything } from './cursor/continuesAnything.mjs';
export function* anything(start, prev) {
    const cursor = start.spawn(prev);
    cursor.token({ kind: 'anything' });
    yield* cursor.log({ message: 'checking anything' });
    if (prev) {
        yield* cursor.log({
            message: 'not anything',
            miss: 'cannot follow prev',
        });
        return prev;
    }
    const key = yield* loop(cursor);
    if (!key.length) {
        yield* cursor.log({
            message: 'not anything',
            miss: 'no key',
        });
        return false;
    }
    yield* cursor.log({ message: 'resolving anything' });
    const head = { key: key };
    cursor.token({ head: head });
    return cursor;
}
function* loop(cursor) {
    const key = [];
    {
        let started;
        let _check = beginsAnything;
        while (cursor.curr() && _check(cursor.curr())) {
            if ((!started) && (started = true))
                yield* cursor.log({ message: 'beginning anything' });
            key.push(cursor.curr());
            yield* cursor.take();
            _check = continuesAnything;
        }
    }
    return key;
}
