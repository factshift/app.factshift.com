import { container } from '../../container/generator.mjs';
export function* definition(cursor) {
    var _a;
    const containers = new Map();
    let _container;
    while ((_container = yield* cursor.scan([container])) && (_container = _container.getToken())) {
        const set = (_a = containers.get(_container.head.proto)) !== null && _a !== void 0 ? _a : [];
        set.push(_container);
        containers.set(_container.head.proto.name, set);
    }
    return containers;
}
export function* takeDefinition(cursor) {
    const containers = yield* definition(cursor);
    cursor.token({ definition: containers });
    if (containers.size) {
        cursor.token({ body: [...containers.values()] });
    }
}
