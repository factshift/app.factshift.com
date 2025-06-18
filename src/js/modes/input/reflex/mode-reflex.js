import {setDocumentMode}       from "../index";
import {linkBySpwParts}        from "../../simulation/edges/data/link-spw";
import {pushLink}              from "../../simulation/edges/data/pushLink";
import {forEachNode, pushNode} from "../../simulation/nodes/data/operate";
import {getAllNodes}           from "../../simulation/nodes/data/selectors/multiple";
import {linkToCenter}          from "../../simulation/edges/data/link-center";
import {getDocumentDataIndex}  from "../dataindex/util";
import {boonConcept, boonNode} from "../spw/commands/boon";

const dataindexPrefix = 'spwashi-action-';

export function getActionIndexForNumber(index) {
  return dataindexPrefix + (index);
}

export function getModifiedActionIndex(index, modifier = 1) {
  const number         = parseInt(`${index}`.replace(dataindexPrefix, ''));
  const modifiedNumber = number + modifier;
  const count          = document.querySelectorAll('[data-actionindex]').length;
  return getActionIndexForNumber(modifiedNumber >= 0 ? modifiedNumber % count : count - 1);
}


export function initializeReflexMode() {
  window.spwashi.boon = (nodeTimeout, nodeCount = window.spwashi.parameters.nodes.count) => {
    async function* loop(timeout = 100, count = window.spwashi.parameters.nodes.count) {
      for (let i = 0; i < count; i++) {
        yield i;
        await new Promise(r => setTimeout(r, timeout));
      }
    }

    async function run() {
      let nodes = [];
      for await (const i of loop(nodeTimeout, nodeCount)) {
        const node       = boonConcept['@node'](i, nodeCount);
        pushNode(node);
        window.spwashi.reinit();
        nodes.push(node);
      }
      return nodes;
    }

    return run();
  };
  window.spwashi.bane = (data) => {
    async function* timeoutLoop(timeout, iterations) {
      let iterable = data || getAllNodes();
      for (let i = 100; i--; i > 0) {
        for (let node of iterable) {
          yield node;
          await new Promise(r => setTimeout(r, timeout));
        }
      }
    }

    async function run() {
      let nodes = [];
      for await (const node of timeoutLoop(10, 13)) {
        node.r = Math.min(node.r * Math.random(), 100);
        node.r = Math.max(node.r * Math.random(), 10);
      }
      return nodes;
    }

    return run();
  }
  window.spwashi.bone = () => {
    const nodeBuckets = new Map();
    for (let node of window.spwashi.nodes) {
      const bucket = nodeBuckets.get(node.colorindex) || [];
      bucket.push(node);
      nodeBuckets.set(node.colorindex, bucket);
    }


    [...nodeBuckets.values()].forEach(arr => {
      let prev;
      let first;
      for (let node of arr) {
        first      = first || node;
        let target = window.spwashi.getNode(prev?.id);
        let source = window.spwashi.getNode(node.id);
        const link = {
          source:     source,
          target:     target,
          colorindex: source.colorindex,
          strength:   window.spwashi.parameters.links.strength * .3
        };
        source && pushLink(window.spwashi.links, link);
        prev = node;
      }
      pushLink(window.spwashi.links, {
        source:   prev?.id,
        target:   first?.id,
        strength: window.spwashi.parameters.links.strength * .3
      })
    });
    window.spwashi.reinit();
  };
  window.spwashi.bonk = (nodes) => {
    (nodes || window.spwashi.nodes).forEach(n => {
      n.color = undefined
      return n.colorindex += 1;
    })
    window.spwashi.reinit();
  };
  window.spwashi.honk = () => {
    window.spwashi.links.forEach(link => {
      link.colorindex = link.colorindex ? link.colorindex + 1 : getDocumentDataIndex();


      return link.strength *= 1.5;
    })
    window.spwashi.reinit();
  };

  const radiusReflexes      = {
    title: 'Adjust Radius',

    reflexes:
      [
        [
          '*=3.2',
          () => {
            forEachNode(n => n.r *= 3.2);
            window.spwashi.reinit()
          },],
        [
          '/=2.3',
          () => {
            forEachNode(n => n.r /= 2.3);
            window.spwashi.reinit()
          },
        ],
        [
          '=10',
          () => {
            forEachNode(n => n.r = 10);
            window.spwashi.reinit()
          },
        ],
      ]
  };
  const chargeSetReflexes   = {
    title: 'Set Charge',

    reflexes:
      [
        [
          '-100',
          () => {
            window.spwashi.parameters.forces.charge = -100;
            window.spwashi.reinit();
          },
        ],
        [
          '0',
          () => {
            window.spwashi.parameters.forces.charge = 0;
            window.spwashi.reinit();
          },
        ],
        [
          '100',
          () => {
            window.spwashi.parameters.forces.charge = 100;
            window.spwashi.reinit();
          },
        ],
        [
          '-1k',
          () => {
            window.spwashi.parameters.forces.charge = -1000;
            window.spwashi.reinit();
          },
        ],
        [
          '-10k',
          () => {
            window.spwashi.parameters.forces.charge = -10000;
            window.spwashi.reinit();
          },
        ],
      ]
  };
  const chargeTweakReflexes = {
    title: 'Adjust Charge',

    reflexes:
      [
        [
          '-100',
          () => {
            window.spwashi.parameters.forces.charge -= 100;
            window.spwashi.reinit();
          },
        ],
        [
          '-10',
          () => {
            window.spwashi.parameters.forces.charge -= 10;
            window.spwashi.reinit();
          },
        ],
        [
          '*-1',
          () => {
            window.spwashi.parameters.forces.charge *= -1;
            window.spwashi.reinit();
          },
        ],
        [
          '+10',
          () => {
            window.spwashi.parameters.forces.charge += 10;
            window.spwashi.reinit();
          },
        ],
        [
          '*13',
          () => {
            window.spwashi.parameters.forces.charge *= 10;
            window.spwashi.reinit();
          },
        ],
      ]
  };
  const loreReflexes        = {
    title: 'Lore',

    reflexes:
      [
        [
          'boon',
          () => {
            window.spwashi.boon()
          },
        ],
        [
          'bone',
          () => {
            window.spwashi.bone()
          },
        ],
        [
          'honk',
          () => {
            window.spwashi.honk()
          },
        ],
        [
          'bane',
          () => {
            window.spwashi.bane();
            window.spwashi.reinit()
          },
        ],
        [
          'bonk',
          () => {
            window.spwashi.bonk()
          },
        ],
      ]
  };
  const forceReflexes       = {
    title: 'Forces',
    reflexes:
           [
             [
               'link',
               () => {
                 const linkingPatterns = [linkToCenter, linkBySpwParts];
                 const i               = window.spwashi.__session.i++;
                 const pattern         = linkingPatterns[i % linkingPatterns.length];
                 window.spwashi.links  = pattern(window.spwashi.nodes);
                 window.spwashi.reinit();
               }
             ],
             [
               'speed decay',
               () => {
                 const options                                  = ['0.1', '0.2', '0.3', '0.4', '0.5'];
                 const i                                        = window.spwashi.__session.i++;
                 window.spwashi.parameters.forces.velocityDecay = options[i % options.length];
                 window.spwashi.reinit();
               },
             ],
             [
               'box',
               () => {
                 window.spwashi.parameters.forces.boundingBox = !window.spwashi.parameters.forces.boundingBox;
                 window.spwashi.reinit();
               },
             ],
           ]
  };
  const reflexes            = [
    loreReflexes,
    chargeSetReflexes,
    radiusReflexes,
    chargeTweakReflexes,
    forceReflexes,
  ];
  const reflexContainer     = document.querySelector('#reflexes');
  if (!reflexContainer) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about reflex container');
    return;
  }

  let i = 0;
  reflexes.forEach(({title, reflexes}) => {
    const section = reflexContainer.appendChild(document.createElement('section'));
    section.classList.add('card');
    const header = section.appendChild(document.createElement('header'));
    header.classList.add('card-header')
    const card = section.appendChild(document.createElement('div'));
    card.classList.add('card-body');
    const buttonContainer = card.appendChild(document.createElement('div'));
    buttonContainer.classList.add('button-container');


    header.innerText = title;
    reflexes.forEach(reflex => {
      const button               = buttonContainer.appendChild(document.createElement('button'));
      button.innerText           = reflex[0];
      button.onclick             = () => {
        reflex[1]();
        setDocumentMode(null);
        document.querySelector('#mode-selector--reflex').focus();
      }
      button.dataset.actionindex = getActionIndexForNumber(i++);
    })
  });
}

export function onReflexModeStart() {
  document.querySelector('#reflexes button').focus();

  // get position of all buttons, assuming they are all the same size
  const buttons    = document.querySelectorAll('#reflexes button');
  const buttonsByX = {};
  const buttonsByY = {};
  buttons.forEach(button => {
    const rect = button.getBoundingClientRect();
    const x    = Math.round(rect.x);
    const y    = Math.round(rect.y);
    if (!buttonsByX[x]) {
      buttonsByX[x] = [];
    }
    if (!buttonsByY[y]) {
      buttonsByY[y] = [];
    }
    buttonsByX[x].push(button);
    buttonsByY[y].push(button);
  });


  window.spwashi.callbacks.arrowLeft  = () => {
    const activeElement = document.activeElement;
    const currentPos    = Math.round(activeElement.getBoundingClientRect().y);
    const group         = buttonsByY[currentPos];
    const index         = group.indexOf(activeElement);
    const prev          = group[index - 1] || group[group.length - 1];
    prev && prev.focus();
  };
  window.spwashi.callbacks.arrowRight = () => {
    const activeElement = document.activeElement;
    const currentPos    = Math.round(activeElement.getBoundingClientRect().y);
    const group         = buttonsByY[currentPos];
    const index         = group.indexOf(activeElement);
    const next          = group[index + 1] || group[0];
    next && next.focus();
  };
  window.spwashi.callbacks.arrowUp    = () => {
    const activeElement = document.activeElement;
    const currentPos    = Math.round(activeElement.getBoundingClientRect().x);
    const group         = buttonsByX[currentPos];
    const index         = group.indexOf(activeElement);
    const next          = group[index + 1] || group[0];
    next && next.focus();
  };
  window.spwashi.callbacks.arrowDown  = () => {
    const activeElement = document.activeElement;
    const currentPos    = Math.round(activeElement.getBoundingClientRect().x);
    const group         = buttonsByX[currentPos];
    const index         = group.indexOf(activeElement);
    const prev          = group[index - 1] || group[group.length - 1];
    prev && prev.focus();
  };
}