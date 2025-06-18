import { removeAllNodes, removeAllLinks } from "../../simulation/nodes/data/set";
import { duplicateNode } from "../../modes/direct/mode-direct";
import { getAllNodes } from "../../simulation/nodes/data/selectors/multiple";
import { getAllLinks } from "../../simulation/edges/data/select";
import { setDocumentMode } from "../../modes";
import { toggleFocalPoint } from "./handlers/toggle-focal-point";
import { clearCachedNodes } from "./handlers/clear-cached-nodes";
import { clearFixedPositions } from "./handlers/clear-fixed-positions";
import { fixPositions } from "./handlers/fix-positions";
import { clearActiveNodes } from "./handlers/clear-active-nodes";
import { saveActiveNodes } from "./handlers/save-active-nodes";
import { lessNodes } from "./handlers/less-nodes";
import { bonkVelocityDecay } from "./handlers/bonk-velocity-decay";
import { toggleHotkeyMenu } from "./handlers/toggle-hotkey-menu";
import { moreNodes } from "./handlers/more-nodes";
import { resetInterface } from "./handlers/reset-interface";
import { toggleMainMenu } from "./handlers/toggle-main-menu";
import { toggleForce } from "../../simulation/active-forces";  // Assuming this manages force toggling

// Helper function for 'yoink' action
function handleYoink() {
  const nodes = getAllNodes();
  const links = getAllLinks();

  nodes.forEach(node => {
    node.fx = undefined;
    node.fy = undefined;
  });

  const simulation = window.spwashi.simulation;

  // Remove all forces
  ['center', 'charge', 'link', 'collide'].forEach(force => simulation.force(force, null));

  // Add new center force to reposition nodes
  simulation.force('center', (alpha) => {
    let cx = 0, cy = 0;
    const n = nodes.length;

    nodes.forEach(node => {
      cx += node.x;
      cy += node.y;
    });

    cx /= n;
    cy /= n;

    nodes.forEach(node => {
      node.x -= cx;
      node.y -= cy;
      if (node.x < 10 || node.y < 10) node.r = 10;
    });
  });

  window.navigator.clipboard.writeText(JSON.stringify({ nodes: nodes.map(duplicateNode), links }));

  setTimeout(() => {
    removeAllNodes();
    removeAllLinks();
    window.spwashi.reinit();
  }, 300);

  setDocumentMode('');
}

// KeyStroke options definition
export const initialKeyStrokeOptions = [
  // Force toggles
  { revealOrder: 0, shortcut: 'l', categories: ['forces'], title: 'Toggle Link Force', callback: () => toggleForce('link') },
  { revealOrder: 0, shortcut: 'c', categories: ['forces'], title: 'Toggle Collide Force', callback: () => toggleForce('collide') },
  { revealOrder: 0, shortcut: 'h', categories: ['forces'], title: 'Toggle Charge Force', callback: () => toggleForce('charge') },
  { revealOrder: 0, shortcut: 'n', categories: ['forces'], title: 'Toggle Center Force', callback: () => toggleForce('center') },
  { revealOrder: 0, shortcut: 'b', categories: ['forces'], title: 'Toggle Bounding Box Force', callback: () => toggleForce('boundingBox') },

  // Node actions
  { revealOrder: 0, shortcut: 'ArrowUp', categories: ['nodes'], shortcutName: '↑', title: 'More Nodes', callback: moreNodes },
  { revealOrder: 1, shortcut: 'ArrowDown', categories: ['nodes'], shortcutName: '↓', title: 'Fewer Nodes', callback: lessNodes },
  { revealOrder: 1, shortcut: '.', categories: ['nodes'], title: 'Fix Position', callback: fixPositions },
  { revealOrder: 1, shortcut: ',', categories: ['nodes'], title: 'Unfix Position', callback: clearFixedPositions },
  { revealOrder: 0, shortcut: 's', categories: ['nodes'], title: 'Save Nodes', callback: saveActiveNodes },

  // Interface toggles
  { revealOrder: 0, shortcut: '[', categories: ['interface'], title: 'Toggle Main Menu', callback: toggleMainMenu },
  { revealOrder: 0, shortcut: ']', categories: ['interface'], title: 'Toggle Focal Point', callback: toggleFocalPoint },
  { revealOrder: 1, shortcut: '/', categories: ['interface'], title: 'Toggle Hotkey Menu', callback: toggleHotkeyMenu },

  // Velocity and forces actions
  { revealOrder: 1, shortcut: ';', categories: ['forces', 'velocity decay'], shortcutName: ';', title: 'Bonk Velocity Decay', callback: bonkVelocityDecay },

  // Data actions
  { revealOrder: 1, shortcut: 'k', categories: ['data'], title: 'Clear Nodes', callback: clearActiveNodes },
  { revealOrder: 1, shortcut: '-', categories: ['data', 'cache'], title: 'Clear Node Cache', callback: clearCachedNodes },
  { revealOrder: 1, shortcut: '\\', categories: ['data', 'cache'], title: 'Reset Interface', callback: resetInterface },

  // Special actions
  { revealOrder: 0, shortcut: 'y', categories: ['this'], title: 'Yoink', callback: handleYoink },

  // Placeholder for spacing
  { revealOrder: 1, shortcut: '<space>' }
];
