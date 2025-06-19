import { initializeForces } from "../../../../simulation/physics";

export function runForcesCommand(sideEffects) {
  initializeForces();
  sideEffects.physicsChange = true;
}