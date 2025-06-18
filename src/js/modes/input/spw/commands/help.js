import {pushNode} from "../../../simulation/nodes/data/operate";

const helpText = [
  'thoughts are nodes',
  'text can be linked'
];

export function pushHelpTopics(yPos) {
  const topics = [
    {
      id:          'help--home',
      name:        'home',
      description: 'go to home page',
      r:           30,
      url:         '/'
    },
  ]
  pushNode(...topics.map(node => {
    node.fy = yPos;
    return node;
  }));
  window.spwashi.reinit();
}

export function runHelpCommand(sideEffects) {
  {
    window.spwashi.setItem('help', helpText.join('\n'), 'focal.root')
    pushNode(
      {
        fx:              window.spwashi.parameters.startPos.x,
        fy:              window.spwashi.parameters.startPos.y,
        id:              'help',
        name:            'help',
        kind:            '__help',
        r:               30,
        collisionRadius: 100,
        charge:          -100,
        url:             '/help',
        callbacks:       {
          click(e, d) {
            d.fx    = d.fy = undefined;
            const y = d.y;
            const x = d.x;
            pushHelpTopics(y);
          }
        }
      }
    );
    sideEffects.physicsChange = true;
    return;
  }
}