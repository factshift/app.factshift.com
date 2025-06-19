import { parse } from '../parse.mjs';
let out = Object.entries({
    '--false': [' '],
    '--nominal': ['one', 'one<two>', 'one<two>(three)', 'one(two)', 'one(two){three}', 'one{two}', 'one(two){three}[four]', 'one{two}[three]', 'one[two]'],
    '--literal': ['`one`', '"one"'],
    '--numeric': ['2', '2.2'],
    '--phrasal': ['2 2', 'one two', 'one 2 three', 'onw two three', '{_one two }_three four'],
    '--common': ['one two, three'],
    '--ordinal': ['one two, three; four five', `\n      one\n      two \n      three\n      `, `\n      one;\n      two;\n      three;\n      `, `\n      one;\n      *_two;\n      three;\n      `],
    '--container': ['{one}', '{ something }', '{_one two }_three'],
    '--operational': ['one*two', '*_one', 'one *two', 'one* two', 'one * two', 'one *_two three ', 'one@two', 'one * two@three'],
});
out = Object.fromEntries(out.map(([k, v]) => [k, v.map(str => { var _a, _b; return (_b = (_a = parse(str, { asGenerator: false })) === null || _a === void 0 ? void 0 : _a.kind) !== null && _b !== void 0 ? _b : str; })]));
out = JSON.parse(JSON.stringify(out));
console.log(out);
debugger;
