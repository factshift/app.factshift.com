import {generateNodes} from "../simulation/nodes/data/generate";
import {forEachNode}   from "../simulation/nodes/data/operate";

export function initializeForceSimulationControls() {
  const forceSimulation = window.spwashi.simulation;
  if (!forceSimulation) {
    const error = 'no force simulation initialized';
    alert(error)
    throw new Error(error);
  }

  const controls = document.querySelector('#controls');
  if (!controls) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about controls');
    return;
  }

  const tickButton   = controls.querySelector('.tick');
  tickButton.onclick = () => {
    window.spwashi.tick();
  };

  const startButton   = controls.querySelector('.start');
  startButton.onclick = () => {
    forceSimulation.restart();
  };

  const stopButton   = controls.querySelector('.stop');
  stopButton.onclick = () => {
    forceSimulation.stop();
  };

  const reinitButton   = controls.querySelector('.reinit');
  reinitButton.onclick = () => {
    window.spwashi.reinit();
  };

  const clearFixedButton   = controls.querySelector('.clear-fixed-positions');
  clearFixedButton.onclick = () => {
    forEachNode(node => {
      node.fx = undefined;
      node.fy = undefined;
    });
  }

  const generateNodesButton   = controls.querySelector('.generate-nodes');
  generateNodesButton.onclick = generateNodes;
}