import {executeCommand}      from "./execute-command";
import {patternsAndHandlers} from "./handlers/_";

export function processLine(line, sideEffects) {
  let handled = false;
  Object.entries(patternsAndHandlers).forEach(([key, {regex, handler}]) => {
    const match = regex.exec(line);
    if (match && match[1]) {
      handled      = true;
      const values = match.slice(1)
      handler(sideEffects, ...values);
    }
  });
  if (handled) return;
  executeCommand(line, sideEffects);
  return false;
}