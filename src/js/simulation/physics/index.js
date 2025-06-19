import {
  registerForce,
  enableForce,
  disableForce,
  isForceEnabled,
  updateForceOptions,
  forceNames,
  applyRegisteredForces
} from '../force-registry.js';

import { initializeForces } from '../forces.js';

export const Physics = {
  registerForce,
  enableForce,
  disableForce,
  isForceEnabled,
  updateForceOptions,
  forceNames,
  applyForces: applyRegisteredForces,
  initialize: initializeForces,
};

export {
  registerForce,
  enableForce,
  disableForce,
  isForceEnabled,
  updateForceOptions,
  forceNames,
  applyRegisteredForces,
  initializeForces,
};

export default Physics;
