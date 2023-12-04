import {scaleOrdinal, scaleSequential, schemeCategory10} from "d3";

export const colorHandler = {
  regex:   /^color=(-?\d+)/,
  handler: (sideEffects, value) => {
    const choice  = parseInt(value);
    const reverse = Math.sign(choice) !== -1 || Object.is(choice, -0);
    const nodes   = [...window.spwashi.nodes];
    if (reverse) {
      nodes.reverse();
    }
    const options = [
      scaleOrdinal(schemeCategory10),
      scaleSequential([0, nodes.length], t => `hsl(230, ${t * 100}%, 50%)`),
      scaleSequential([0, nodes.length], t => `hsl(230, 100%, ${t * 50}%)`),
      scaleSequential([0, nodes.length], t => `hsl(${t * 360}, 100%, 50%)`),
    ];
    const scale   = options[Math.abs(choice) % options.length];
    nodes.forEach((node, i) => {
      console.log(node.name)
      node.color = scale(i);
    });
    sideEffects.physicsChange = true;
  }
};