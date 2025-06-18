import {boonConcept, boonNode} from "../../../js/modes/input/spw/commands/boon";

boonConcept['@node'] = (index, batchSize) => {
  const currentDayIndex = (new Date()).getDay();
  return {
    ...boonNode(index, batchSize),

    text: {
      fontSize: 50,
      fy:       50,
      color:    'rgba(255, 255, 255, .2)'
    },

    color: index === currentDayIndex ? 'turquoise' : 'rgba(255, 255, 255, .1)',

    callbacks: {
      ondrag: (e, node) => {
        const width  = window.spwashi.parameters.width;
        const height = window.spwashi.parameters.height;
        const r      = 255 * (node.x / width);
        const y      = 255 * (node.y / height);
        const b      = 255 * (node.x / width);
        node.color   = `rgb(${r}, ${y}, ${b})`;
      }
    }
  };
}
