const openConcept = { name: 'open-conceptual', key: '"', opposite: '"', kind: 'delimiter', open: true };
const openLocation = { name: 'open-locational', key: '\`', opposite: '\`', kind: 'delimiter', open: true };
const closeConcept = { name: 'close-conceptual', key: '"', opposite: '"', kind: 'delimiter', close: true };
const closeLocation = { name: 'close-locational', key: '\`', opposite: '\`', kind: 'delimiter', close: true };
const openLiteralDelimitingOperators = {
    '"': openConcept,
    '\`': openLocation,
    _inverse: {
        '"': openConcept,
        '\'': openLocation,
    }
};
const closeLiteralDelimitingOperators = {
    '"': closeConcept,
    '\`': closeLocation,
    _inverse: {
        '"': closeConcept,
        '\`': closeLocation,
    }
};
export const literalDelimitingOperators = {
    open: openLiteralDelimitingOperators,
    close: closeLiteralDelimitingOperators,
};
