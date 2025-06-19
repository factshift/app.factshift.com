// services/query-params.js
// Service for registering query parameter handlers used during hydration.

const handlers = new Map();

export function registerQueryParam(name, handler) {
  if (!name || typeof handler !== 'function') {
    throw new Error('registerQueryParam requires a name and handler');
  }
  handlers.set(name, handler);
}

export function applyQueryParams(searchParams) {
  handlers.forEach((fn, name) => {
    if (searchParams.has(name)) {
      try {
        fn(searchParams.get(name), searchParams);
      } catch (err) {
        console.error('query param handler failed', name, err);
      }
    }
  });
}

export function registeredParamNames() {
  return [...handlers.keys()];
}

export const QueryParams = {
  register: registerQueryParam,
  apply: applyQueryParams,
  names: registeredParamNames,
};

export default QueryParams;
