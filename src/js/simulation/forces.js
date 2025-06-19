import { getAllNodes } from './nodes/data/selectors/multiple.js';
import { forceCenter, forceCollide, forceLink, forceManyBody } from 'd3';
import { registerForce, applyRegisteredForces } from './force-registry.js';

// Fetch simulation parameters with fallbacks for magic constants
function getAlpha() {
  return window.spwashi.parameters.forces.alpha ?? 1;
}

function getAlphaTarget() {
  return window.spwashi.parameters.forces.alphaTarget ?? 0;
}

function getDecay() {
  return window.spwashi.parameters.forces.alphaDecay ?? 0.0228;
}

function getVelocityDecay() {
  return window.spwashi.parameters.forces.velocityDecay ?? 0.4;
}

function getCenterPosition() {
  return [
    window.spwashi.parameters.forces.centerPos?.x ?? window.innerWidth / 2,
    window.spwashi.parameters.forces.centerPos?.y ?? window.innerHeight / 2,
  ];
}

function getCenterStrength() {
  return window.spwashi.parameters.forces.centerStrength ?? 1;
}

function getChargeStrength(d) {
  return d.charge ?? window.spwashi.parameters.forces.charge ?? -30;
}

function boundingBoxForce(nodes, alpha) {
  const { width, height, velocityMultiplier, alphaMultiplier } = {
    width: window.spwashi.parameters.width ?? window.innerWidth,
    height: window.spwashi.parameters.height ?? window.innerHeight,
    velocityMultiplier: 0.9,
    alphaMultiplier: 0.1,
  };

  for (let i = 0, n = nodes.length; i < n; ++i) {
    const node = nodes[i];
    if (node.x > width) {
      node.x = width;
      node.vx *= velocityMultiplier;
    } else if (node.x < 0) {
      node.x = 0;
      node.vx *= velocityMultiplier;
    }
    if (node.y > height) {
      node.y = height;
      node.vy *= velocityMultiplier;
    } else if (node.y < 0) {
      node.y = 0;
      node.vy *= velocityMultiplier;
    }
  }
}

function registerDefaultForces() {
  const links = window.spwashi.links;
  registerForce('link', () =>
    forceLink()
      .links(links)
      .id(d => d.id)
      .strength(l => l.strength ?? 1)
  );

  registerForce('collide', () =>
    forceCollide(d => d.collisionRadius ?? d.r)
  );

  registerForce('charge', () =>
    forceManyBody().strength(getChargeStrength)
  );

  registerForce('center', () =>
    forceCenter(...getCenterPosition()).strength(getCenterStrength())
  );

  registerForce(
    'boundingBox',
    () => {
      const nodes = getAllNodes();
      return alpha => boundingBoxForce(nodes, alpha);
    },
    { enabled: false }
  );
}

export function initializeForces() {
  const simulation = window.spwashi.simulation;
  simulation.alpha(getAlpha());
  simulation.alphaTarget(getAlphaTarget());
  simulation.alphaDecay(getDecay());
  simulation.velocityDecay(getVelocityDecay());

  registerDefaultForces();
  applyRegisteredForces(simulation);
}
