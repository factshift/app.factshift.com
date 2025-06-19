import { beginsAnything } from "./beginsAnything.mjs";
export function continuesAnything(char) {
    if (!char)
        return false;
    return beginsAnything(char) || (char === '_');
}
