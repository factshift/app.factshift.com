import { initDocumentMousedown } from "./initDocumentMousedown";
import { attachFocalPointToElementPosition, focalPoint, initFocalSquare, updateFocalPoint } from "../../ui/focal-point";
import { onReflexModeStart } from "../../modes/reflex/mode-reflex";
import { onColorModeStart } from "../../modes/dataindex/mode-dataindex";

function resetArrows() {
  const noop = () => {};
  window.spwashi.callbacks.arrowUp = noop;
  window.spwashi.callbacks.arrowDown = noop;
  window.spwashi.callbacks.arrowLeft = noop;
  window.spwashi.callbacks.arrowRight = noop;
}

function resetInterfaceDepth() {
  document.body.dataset.interfaceDepth = 'standard';
}

// Helper function to set tab index and focus
function setFocus(container, direct) {
  if (container) {
    container.tabIndex = 0;
    direct && container.focus();
    container.onfocus = () => container.tabIndex = 0;
  }
}

// Helper function to initialize the focal point
function initializeFocalPoint(button) {
  initFocalSquare();
  if (document.body.dataset.interfaceDepth === 'main-menu') {
    attachFocalPointToElementPosition(button);
  } else {
    if (!focalPoint.fx) {
      updateFocalPoint({
        x: window.innerWidth * 0.2,
        y: window.innerHeight * 0.75,
      });
    }
  }
}

// Map of mode-specific actions
const modeActions = {
  spw: () => {
    const container = document.querySelector('#spw-mode-container');
    setFocus(container, true);
  },
  reflex: onReflexModeStart,
  color: onColorModeStart,
  story: () => {
    const container = document.querySelector('#story-mode-container .button-container button');
    setFocus(container, true);
  },
  node: () => {
    const container = document.querySelector('#node-input-container');
    setFocus(container, true);
  },
  map: () => window.spwashi.callbacks.onMapMode?.(),
  filter: () => window.spwashi.callbacks.onFilterMode?.()
};

export function initListeners() {
  initDocumentMousedown();

  window.spwashi.onModeChange = (mode, direct = false) => {
    if (mode) {
      window.spwashi.setItem('mode', mode, 'focal.root');
    }

    // Deselect the currently selected mode
    document.querySelector('[data-mode-action] [aria-selected="true"]')?.setAttribute('aria-selected', 'false');

    // Select the new mode button and initialize the focal point
    const button = document.querySelector(`#mode-selector--${mode}`);
    if (button) {
      button.setAttribute('aria-selected', 'true');
      initializeFocalPoint(button);
    }

    // Reset arrow callbacks
    resetArrows();

    // Execute the mode-specific action if it exists
    if (modeActions[mode]) {
      modeActions[mode](direct);
    }

    // Reset the interface depth
    resetInterfaceDepth();
  };

  window.spwashi.onDataIndexChange = (dataindex) => {
    // Placeholder for future implementation
  };
}
