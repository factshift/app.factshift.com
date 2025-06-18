import {initializeForces} from "../../../simulation/forces";

export function runForcesCommand(sideEffects) {
  initializeForces();
  sideEffects.physicsChange = true;
}