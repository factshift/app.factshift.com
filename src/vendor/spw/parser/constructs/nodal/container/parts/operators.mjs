const openConcept = { name: 'conceptual.open', key: '<', opposite: '>', kind: 'delimiter', open: true };
const openLocation = { name: 'locational.open', key: '(', opposite: ')', kind: 'delimiter', open: true };
const openStructure = { name: 'structural.open', key: '{', opposite: '}', kind: 'delimiter', open: true };
const openEssence = { name: 'essential.open', key: '[', opposite: ']', kind: 'delimiter', open: true };
const closeConcept = { name: 'conceptual.close', key: '>', opposite: '<', kind: 'delimiter', close: true };
const closeLocation = { name: 'locational.close', key: ')', opposite: '(', kind: 'delimiter', close: true };
const closeStructure = { name: 'structural.close', key: '}', opposite: '{', kind: 'delimiter', close: true };
const closeEssence = { name: 'essential.close ', key: ']', opposite: '[', kind: 'delimiter', close: true };
const openContainerDelimitingOperators = {
    '<': openConcept,
    '(': openLocation,
    '{': openStructure,
    '[': openEssence,
    _inverse: {
        '>': openConcept,
        ')': openLocation,
        '}': openStructure,
        ']': openEssence,
    }
};
const closeContainerDelimitingOperators = {
    '>': closeConcept,
    ')': closeLocation,
    '}': closeStructure,
    ']': closeEssence,
    _inverse: {
        '<': closeConcept,
        '(': closeLocation,
        '{': closeStructure,
        '[': closeEssence,
    }
};
export const containerDelimitingOperators = {
    open: openContainerDelimitingOperators,
    close: closeContainerDelimitingOperators
};
