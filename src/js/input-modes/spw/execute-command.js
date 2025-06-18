import {commands}          from "./commands/_";
import {runDefaultCommand} from "./commands/default";

export function executeCommand(command, sideEffects) {
  if (commands[command]) {
    return commands[command](sideEffects);
  } else {
    return runDefaultCommand(sideEffects, command);
  }
}