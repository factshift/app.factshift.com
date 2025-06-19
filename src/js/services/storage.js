export function getItemKey(key, category = null, parameterKey = window.spwashi?.parameterKey) {
  if (!category) {
    category = parameterKey;
  }
  return `${category}@${key}`;
}

export function setItem(key, item, category = null) {
  try {
    window.localStorage.setItem(getItemKey(key, category), JSON.stringify(item ?? null));
  } catch (e) {
    console.error({ e, item });
  }
}

export function getItem(key, category = null) {
  const out = window.localStorage.getItem(getItemKey(key, category));
  if (out) return JSON.parse(out || '{}');
  return undefined;
}

export function clearAll() {
  window.localStorage.clear();
}

