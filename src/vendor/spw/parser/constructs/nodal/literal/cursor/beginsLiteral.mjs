import { literalDelimitingOperators } from "../parts/operators.mjs";
export function beginsLiteral(cursor) {
    const char = cursor.curr();
    if (!char)
        return false;
    return !!literalDelimitingOperators.open[char];
}
