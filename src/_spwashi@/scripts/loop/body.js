import {mapNodes, pushNode} from "../../../js/simulation/nodes/data/operate";
import {clearActiveNodes}   from "../../../js/ui/hotkeys/handlers/clear-active-nodes";
import {gameState}          from "../state/state";
import {processSpwInput}    from "../../../js/input-modes/spw/process-spw-input";
import {pushLink}           from "../../../js/simulation/edges/data/pushLink";
import {mainLoop}           from "./head";

const DO_ADD_NODES = true;

const conditionalResponses = [
  [
    ({quantity, counter}) => counter >= 26,
    (state) => {
      clearActiveNodes();
      window.spwashi.reinit();
      return {
        ...state,
        previousValue:   null,
        counterVariable: 0
      };
    }
  ],
  [
    ({quantity, counter}) => (counter % quantity) === 0,
    (state) => ({
      ...state,
      previousValue: null
    })
  ],
];

function tick() {
  mapNodes((node) => {
    node.fy += 25;
    node.r += 5;
  });
}

export function bodyLoop(speed, subject, {charge = 100}) {
  return async (currentState) => {
    tick(currentState);
    const presumptiveState = gameState({
      counterVariable: currentState.counterVariable + 1,
    });
    const potential        = derivePotential(subject);
    const midStep          = intermediate(currentState, presumptiveState, potential);
    const currentNode      = synthesize(potential, subject, currentState, midStep);
    window.spwashi.reinit();

    processSpwInput([
      `color=2`,
      'arrange',
      `charge=${charge}`
    ]);

    const nextState = gameState(
      currentState,
      presumptiveState,
      midStep,
      {previousValue: currentNode}
    );

    mainLoop(speed, {charge: -charge}, nextState);

    return nextState;
  };
}

function derivePotential(subject) {
  return subject.__internalword.length;
}

function deriveNode(potential, subject, currentState) {
  const heightMod         = potential;
  const identity          = subject.__internalword.split('')[currentState.counterVariable % potential];
  const fy                = 100;
  const fx                = (((currentState.counterVariable % potential) / potential) * window.spwashi.parameters.width) + ((1 / (2 * potential)) * window.spwashi.parameters.width);
  const newNode           = {
    id:       currentState.counterVariable,
    identity: identity,

    fx: fx,
    fy: fy,
    y:  fy,
  };
  newNode.color           = 'var(--bg-start)';
  newNode.r               = 20;
  newNode.text            = {
    fontSize: 50,
    fy:       50,
    color:    'white'
  }
  newNode.collisionRadius = 100;
  return newNode;
}

function intermediate(currentState, presumptiveState, potential) {
  let intermediateState = gameState(currentState, presumptiveState);
  const stepParameters  = {
    quantity: potential,
    counter:  currentState.counterVariable,
  };
  conditionalResponses.forEach(([condition, callback]) => {
    if (condition(stepParameters)) {
      intermediateState = gameState(intermediateState, callback(intermediateState));
    }
  });
  return intermediateState;
}

function synthesize(potential, aggregate, currentState, intermediateState) {
  if (!DO_ADD_NODES) return null;

  // nodes
  const currentNode = deriveNode(potential, aggregate, currentState);
  pushNode(currentNode);

  // links
  const previousNode = intermediateState.previousValue;
  if (previousNode) {
    pushLink(window.spwashi.links, {
      source:   currentNode,
      target:   previousNode,
      strength: .3
    });
  }
  return currentNode;
}
