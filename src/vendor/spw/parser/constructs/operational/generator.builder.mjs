import { takeOperator } from "./pragmatic/cursor/takeOperator.mjs";
import { takeLabel }    from "./pragmatic/cursor/motions/takeLabel.mjs";
export function _operator(operators) {
    return function* (startingCursor) {
        const cursor = startingCursor.spawn();
        cursor.token({ kind: 'operator' });
        yield* cursor.log({ message: 'checking operator' });
        const [proto, operatorChar] = yield* takeOperator(cursor, operators);
        if (proto) {
            cursor.token({ proto: proto });
            cursor.token({ kind: proto.kind });
            cursor.token({ kind: proto.name });
        }
        if (!proto) {
            yield* cursor.log({
                message: 'not an operator',
                miss: 'no prototype',
                cursors: { start: startingCursor },
                info: { operators, curr: startingCursor.curr() }
            });
            return false;
        }
        const [underscore, labelCursor] = yield* takeLabel(cursor);
        cursor.token({
            body: [{ key: operatorChar }],
            operators: underscore ? [underscore] : undefined,
            tail: labelCursor ? labelCursor.getToken() : undefined
        });
        return cursor;
    };
}
