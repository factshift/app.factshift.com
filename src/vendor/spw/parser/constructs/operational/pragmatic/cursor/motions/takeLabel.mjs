import { nominal }   from "../../../../nodal/nominal/generator.mjs";
import { numeric }   from "../../../../nodal/numeric/generator.mjs";
import { container } from "../../../../nodal/container/generator.mjs";
export function* takeLabel(cursor) {
    let labelCursor = false;
    let char;
    if (cursor.curr() === '_') {
        char = yield* cursor.take();
        labelCursor = yield* cursor.scan([nominal, numeric, container]);
    }
    return [char, labelCursor];
}
