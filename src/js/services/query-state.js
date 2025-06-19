export const QueryState = {
  get mode() {
    return window.spwashi?.parameters?.mode || 'default';
  },
  get phase() {
    return document.body?.dataset?.phase || 'default';
  },
  get slice() {
    return window.spwashi?.parameters?.slice || null;
  }
};

export function getCurrentQuery() {
  const { mode, phase, slice } = QueryState;
  return { mode, phase, slice };
}

export function getCurrentStatus() {
  return getCurrentQuery();
}

export default QueryState;
