const colors                    = [
  'var(--node-color-0)',
  'var(--node-color-1)',
  'var(--node-color-2)',
  'var(--node-color-3)',
  'var(--node-color-4)',
  'var(--node-color-5)',
  'var(--node-color-6)',
  'var(--node-color-7)',
  'var(--node-color-8)',
  'var(--node-color-9)',
  'var(--node-color-10)',
  'var(--node-color-11)',
  'var(--node-color-12)',
];
export const getNodeColor       = d => colors[(d.colorindex || 0) % (colors.length)];
export const getNodeText        = d => `${d.name}`;
export const getNodeStrokeColor = d => colors[((d.colorindex || 0) + 5) % colors.length];
