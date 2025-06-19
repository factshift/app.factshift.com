import { beginsNumeric }    from './cursor/beginsNumeric.mjs';
import { continuesNumeric } from './cursor/continuesNumeric.mjs';
export function* numeric(start, prev) {
    const cursor = start.spawn(prev);
    cursor.token({ kind: 'numeric' });
    if (prev) {
        yield* cursor.log({
            message: 'not numeric',
            miss: 'cannot follow prev',
            cursors: { start, prev },
        });
        return prev;
    }
    const { integral: _integral, fractional: _fractional } = yield* loop(cursor);
    if (!(_integral.length || _fractional.length)) {
        yield* cursor.log({
            message: 'not numeric',
            miss: 'no integral or fractional components',
        });
        return false;
    }
    yield* cursor.log({ message: 'resolving numeric' });
    const integral = _integral.length ? parseInt(_integral.join('')) : 0;
    const fractional = _fractional.length ? parseFloat(`.${_fractional.join()}`) : undefined;
    const head = { key: integral + (fractional !== null && fractional !== void 0 ? fractional : 0) };
    cursor.token({
        head: head,
        integral: integral,
        fractional: fractional,
    });
    return cursor;
}
function* loop(cursor) {
    const integral = [];
    {
        let _check = beginsNumeric, started;
        while (_check(cursor)) {
            if ((!started) && (started = true)) {
                _check = continuesNumeric;
                yield* cursor.log({
                    message: 'beginning numeric',
                    info: { component: 'integral' },
                });
            }
            integral.push(cursor.curr());
            yield* cursor.take();
        }
    }
    const fractional = [];
    {
        if (cursor.curr() === '.') {
            yield* cursor.take();
            let started = false, _check = continuesNumeric;
            while (_check(cursor)) {
                if (!started && (started = true)) {
                    _check = continuesNumeric;
                    yield* cursor.log({
                        message: 'continuing numeric',
                        info: { component: 'fractional' },
                    });
                }
                fractional.push(cursor.curr());
                yield* cursor.take();
            }
        }
    }
    return {
        integral,
        fractional,
    };
}
