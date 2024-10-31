import { getAllNodes } from "./multiple";

export function getNode(id, perspective = undefined) {
  let fallback;
  const node = getAllNodes().find(n => {
    // Check if identity matches the provided id
    if (n.identity === id) {
      fallback = fallback || n;
      // If no perspective is provided, return the match
      if (perspective === undefined) return true;
      // Return true if both identity and perspective match
      return n.colorindex === perspective;
    }
    // Fallback case: check if id matches
    if (n.id === id) {
      fallback = fallback || n;
    }
  });
  // Return node matching both id and perspective, or fallback match if available
  return node || fallback;
}
