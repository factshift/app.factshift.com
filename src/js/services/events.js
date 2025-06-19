import { warn, debug } from './logger.js';

/**
 * Wait for a specific event on a target element. If the event does not
 * fire within the given timeout, a warning is logged.
 * @param {EventTarget} target - The event target to listen on
 * @param {string} eventName - The name of the event to wait for
 * @param {number} [timeout] - Optional timeout in milliseconds
 * @returns {Promise<Event>} Resolves with the event when it fires
 */
export function expectEvent(target, eventName, timeout) {
  return new Promise((resolve, reject) => {
    const handler = (e) => {
      clearTimeout(timer);
      debug(`[event] ${eventName} fired`);
      target.removeEventListener(eventName, handler);
      resolve(e);
    };
    target.addEventListener(eventName, handler, { once: true });
    let timer;
    if (timeout) {
      timer = setTimeout(() => {
        warn(`[event] ${eventName} timed out after ${timeout}ms`);
        target.removeEventListener(eventName, handler);
        reject(new Error(`${eventName} timed out`));
      }, timeout);
    }
  });
}
