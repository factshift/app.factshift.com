import { enableForce, disableForce, isForceEnabled } from './force-registry';

// Toggle the status of a specific force registered in the force registry.
export function toggleForce(forceName) {
  if (isForceEnabled(forceName)) {
    disableForce(forceName);
  } else {
    enableForce(forceName);
  }
  console.log(`${forceName} force is now ${isForceEnabled(forceName) ? 'enabled' : 'disabled'}.`);
}

export { isForceEnabled } from './force-registry';
