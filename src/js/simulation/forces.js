import { getAllNodes } from "./nodes/data/selectors/multiple";
import { forceCenter, forceCollide, forceLink, forceManyBody } from "d3";
import { isForceEnabled } from "./active-forces";

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

  for (let i = 0, n = nodes.length, k = alpha * alphaMultiplier; i < n; ++i) {
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

export function initializeForces() {
  const simulation = window.spwashi.simulation;
  const links = window.spwashi.links;
  const nodes = getAllNodes();

  simulation.alpha(getAlpha());
  simulation.alphaTarget(getAlphaTarget());
  simulation.alphaDecay(getDecay());
  simulation.velocityDecay(getVelocityDecay());

  // Apply forces based on the forceTracker state
  if (isForceEnabled('link')) {
    simulation.force(
        'link',
        forceLink()
            .links(links)
            .id(d => d.id)
            .strength(l => l.strength ?? 1)
    );
  }

  if (isForceEnabled('collide')) {
    simulation.force(
        'collide',
        forceCollide(d => d.collisionRadius ?? d.r)
    );
  }

  if (isForceEnabled('charge')) {
    simulation.force('charge', null); // Clear existing charge force
    simulation.force(
        'charge',
        forceManyBody()
            .strength(getChargeStrength)
    );
  }

  if (isForceEnabled('center')) {
    simulation.force(
        'center',
        forceCenter(...getCenterPosition())
            .strength(getCenterStrength())
    );
  }

  if (isForceEnabled('boundingBox')) {
    simulation.force('boundingBox', alpha => boundingBoxForce(nodes, alpha));
  }
}
