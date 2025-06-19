export function isOrdinalDelimiter(cursor) {
    return cursor.curr() === ';' || (cursor.curr() === '\n');
}
