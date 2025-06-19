export function isLocalhost() {
  return /^(localhost|127\.|0\.0\.0\.0)/.test(window.location.hostname);
}

export function isDebug() {
  return !!(window.spwashi?.parameters?.debug || isLocalhost());
}

export function debug(msg, ...args) {
  if (isDebug()) {
    console.debug(msg, ...args);
  }
}

export function info(msg, ...args) {
  console.info(msg, ...args);
}

export function warn(msg, ...args) {
  console.warn(msg, ...args);
}

export function error(msg, ...args) {
  console.error(msg, ...args);
}
