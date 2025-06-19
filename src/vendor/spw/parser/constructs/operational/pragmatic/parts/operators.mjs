export const pragmaticOperators = {
    '*': {
        name: 'salience',
        key: '*',
        kind: 'pragmatic',
        kinds: new Set(['pragmatic', 'nominal']),
    },
    '@': {
        name: 'perspective',
        key: '@',
        kind: 'pragmatic',
        kinds: new Set(['pragmatic', 'nominal']),
    },
    ':': {
        name: 'binding',
        key: '@',
        kind: 'pragmatic',
        kinds: new Set(['pragmatic', 'nominal']),
    },
    '+': {
        name: 'aggregation',
        key: '+',
        kind: 'pragmatic',
        kinds: new Set(['pragmatic', 'nominal']),
    },
    '-': {
        name: 'reduction',
        key: '-',
        kind: 'pragmatic',
        kinds: new Set(['pragmatic', 'nominal']),
    },
    '=': {
        nodes: {
            '>': {
                name: 'transformation',
                key: '=>',
                kind: 'pragmatic',
                kinds: new Set(['pragmatic', 'nominal']),
            }
        }
    }
};
