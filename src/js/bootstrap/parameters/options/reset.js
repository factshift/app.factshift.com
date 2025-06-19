import { clearAll } from '../../../services/storage.js';

export function reset(searchParameters) {
  if (searchParameters.has('reset')) {
    clearAll();
  }
  return ['reset', false];
}