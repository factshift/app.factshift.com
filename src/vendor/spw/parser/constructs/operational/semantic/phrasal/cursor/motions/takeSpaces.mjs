import { isPhrasalDelimiter } from '../checks/isPhrasalDelimiter.mjs';
export function* takeSpaces(cursor) {
    const spaces = [];
    while (isPhrasalDelimiter(cursor)) {
        spaces.push({ key: cursor.curr() });
        yield* cursor.take();
    }
    return spaces;
}
