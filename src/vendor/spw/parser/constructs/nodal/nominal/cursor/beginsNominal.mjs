export function beginsNominal(char) {
    if (!char)
        return false;
    return /[a-zA-Z]/.test(char);
}
