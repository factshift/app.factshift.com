import { containerDelimitingOperators } from "../parts/operators.mjs";
/**
 * Checks whether a cursor can begin a container token
 *
 * @param cursor
 * @returns {boolean}
 */
export function beginsContainer(cursor) {
    const char = cursor.curr();
    if (!char)
        return false;
    return !!containerDelimitingOperators.open[char];
}
