export function beginsAnything(char) {
    if (!char)
        return false;
    return char !== '"' && char !== '`';
}
