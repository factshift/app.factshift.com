import { pragmaticOperators } from '../parts/operators.mjs';
export function* takeOperator(cursor, operators = pragmaticOperators) {
    let char = cursor.curr();
    let proto = operators[char];
    const chars = [];
    while (operators[char]) {
        chars.push(char);
        proto = operators[char];
        if (!proto.nodes) {
            cursor.advance();
            break;
        }
        operators = proto.nodes;
        yield* cursor.take();
        char = cursor.curr();
    }
    return [proto, chars.join('')];
}
