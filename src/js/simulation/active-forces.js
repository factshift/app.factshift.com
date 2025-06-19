import Physics from './physics/index.js';

// Toggle the status of a specific force registered in the force registry.
export function toggleForce(forceName) {
  if (Physics.isForceEnabled(forceName)) {
    Physics.disableForce(forceName);
  } else {
    Physics.enableForce(forceName);
  }
  console.log(`${forceName} force is now ${Physics.isForceEnabled(forceName) ? 'enabled' : 'disabled'}.`);
}

export const { isForceEnabled } = Physics;
