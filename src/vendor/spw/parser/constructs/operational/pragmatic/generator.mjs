import { operationalPartOptions } from './parts/parts.mjs';
import { takeSpaces }             from '../semantic/phrasal/cursor/motions/takeSpaces.mjs';
import { pragmaticOperators }     from './parts/operators.mjs';
import { _operator }              from '../generator.builder.mjs';
export function* operational(start, prev, domain = pragmaticOperators) {
    var _a;
    const cursor = start.spawn(prev);
    cursor.token({ kind: 'operational' });
    yield* cursor.log({ message: 'checking operational' });
    let { head, body, tail, operators, initialProto } = yield* loop(cursor, prev, domain);
    if (!operators.length) {
        yield* cursor.log({
            message: 'not operational',
            miss: 'no operators',
        });
        return false;
    }
    const isNominal = (_a = initialProto === null || initialProto === void 0 ? void 0 : initialProto.kinds) === null || _a === void 0 ? void 0 : _a.has('nominal');
    if (isNominal && !tail) {
        tail = null;
    }
    cursor.token({ operators });
    if ((initialProto === null || initialProto === void 0 ? void 0 : initialProto.kind) === 'delimiter') {
        return cursor;
    }
    if (operators.length === 1) {
        cursor.token({ kind: initialProto.kind });
        cursor.token({ kind: initialProto.name });
    }
    if (typeof tail === 'undefined') {
        yield* cursor.log({
            message: 'not operational',
            miss: 'missing a tail component',
            cursor: cursor,
            info: {
                head, body, tail,
                tok: cursor.getToken(),
            },
        });
        cursor.token(false);
        return false;
    }
    yield* cursor.log({
        message: 'resolving operational',
        cursor: cursor,
    });
    if (!head && !tail) {
        cursor.token({ kind: 'conceptual' });
    }
    cursor.token({
        head: head,
        body: body,
        tail: tail,
    });
    return cursor;
}
function* loop(cursor, prev, permittedOperators) {
    const head = prev && prev.getToken();
    const body = [];
    const operators = [];
    if (!permittedOperators[' ']) {
        yield* takeSpaces(cursor);
    }
    let operator, initialProto;
    while (operator = yield* cursor.scan([_operator(permittedOperators)])) {
        if (!operator)
            continue;
        if (!(operator === null || operator === void 0 ? void 0 : operator.getToken()))
            break;
        yield* cursor.log({ message: 'beginning operational' });
        operators.push(operator.getToken());
        const proto = operator.getToken().proto;
        initialProto = initialProto ? initialProto : proto;
        if (proto.open) {
            const spaces = yield* takeSpaces(operator);
            spaces.length && body.push(spaces[0]);
        }
        if (!proto.close) {
            yield* takeSpaces(cursor);
        }
        const _cursor = yield* cursor.scan(operationalPartOptions, proto.close ? operator : undefined);
        const token = _cursor ? _cursor.getToken() : null;
        if (!token)
            break;
        body.push(token);
        yield* takeSpaces(cursor);
    }
    const tail = body.pop();
    return {
        head: head,
        body: body,
        tail: tail,
        operators: operators,
        initialProto: initialProto,
    };
}
