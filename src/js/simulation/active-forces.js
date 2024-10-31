export const activeForces = {
    link: true,
    collide: true,
    charge: true,
    center: true,
    boundingBox: false,  // Assume bounding box is initially disabled
};

// Toggles the status of a specific force
export function toggleForce(forceName) {
    if (forceName in activeForces) {
        activeForces[forceName] = !activeForces[forceName];
        console.log(`${forceName} force is now ${activeForces[forceName] ? 'enabled' : 'disabled'}.`);
    }
}

// Check if a specific force is enabled
export function isForceEnabled(forceName) {
    return activeForces[forceName];
}
