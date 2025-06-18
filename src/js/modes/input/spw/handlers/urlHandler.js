import {pushNode} from "../../../simulation/nodes/data/operate";

export const urlHandler = {
  regex:   /^https:\/\/(.+)/,
  handler: (sideEffects, value) => {
    const node = {
      name:            value,
      url:             `https://${value}`,
      collisionRadius: 30,
      r:               20,
      charge:          -1000,
      fx:              window.spwashi.parameters.width / 2,
    };
    pushNode(node);
    sideEffects.nodesAdded.push(node);
    sideEffects.valueStrings.push(node.url);
  }
};