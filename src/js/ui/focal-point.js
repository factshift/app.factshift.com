import {setDocumentMode} from "../modes";

let focalPointElement;

const focalPointMeta = {
  ready: true,
};

export const focalPoint =
               {
                 x:            0,
                 y:            0,
                 queuedAction: () => {
                   const mode = window.spwashi.getItem('mode', 'focal.root');
                   setDocumentMode(mode);
                 },
                 onFocus:      () => {}
               };

function initiateInterest(focalPointElement, timeout = 500) {
  focalPointElement.classList.add('consent-to-engage');

  const consent = {
    interested: null,
    revoke:     revokeEngagement
  };

  const initiationTimer =
          setTimeout(() => {
            focalPointElement.classList.remove('consent-to-engage');
            focalPointElement.classList.add('consented-to-engage');
            consent.interested = true;
          }, timeout);

  function revokeEngagement() {
    clearTimeout(initiationTimer);
    focalPointElement.classList.remove('consented-to-engage');
    focalPointElement.classList.remove('consent-to-engage');
    consent.interested = false;
  }

  return consent;
}

export function initFocalSquare() {
  if (!focalPointElement) {
    focalPointElement = document.querySelector('#focal-square');
    if (!focalPointElement) return;
    const prevFocalPoint = window.spwashi.getItem('focalPoint', 'focal.root');
    if (prevFocalPoint) {
      Object.assign(focalPoint, prevFocalPoint);
      setFocalPoint(focalPoint, true);
    }
    focalPointElement.onmousedown  = (e) => {
      e.preventDefault();
      const consent                        = initiateInterest(focalPointElement, 100);
      document.documentElement.onmousemove = (e) => {
        if (!consent.interested) return
        e.preventDefault();
        focalPointMeta.ready = false;
        setFocalPoint({x: e.x, y: e.y}, true);
      }
      document.documentElement.onmouseup   = (e) => {
        e.preventDefault();
        consent.revoke()
        if (!focalPointMeta.ready) {
          setTimeout(() => focalPointMeta.ready = true, 100);
        }
        document.documentElement.onmousemove = null;
        document.documentElement.onmouseup   = null;
      }
    }
    focalPointElement.ontouchstart = (e) => {
      e.preventDefault();
      const consent = initiateInterest(focalPointElement, 300);

      document.documentElement.ontouchmove = (e) => {
        e.preventDefault();
        if (!consent.interested) return;
        focalPointMeta.ready = false;
        setFocalPoint({x: e.touches[0].clientX, y: e.touches[0].clientY}, true);
      }
      document.documentElement.ontouchend  = (e) => {
        e.preventDefault();
        if (!consent.interested) {
          focalPointMeta.ready = true;
          focalPointElement.onclick(e);
        }
        consent.revoke()
        if (!focalPointMeta.ready) {
          setTimeout(() => focalPointMeta.ready = true, 100);
        }
        document.documentElement.ontouchmove = null;
        document.documentElement.ontouchend  = null;
      }
    }
  }
  focalPointElement.onclick = (e) => {
    if (!focalPointMeta.ready) return;
    focalPoint.queuedAction();
  }
  focalPointElement.onfocus = (e) => {
    focalPoint.onFocus();
  }

  return focalPointElement;
}

export function setFocalPoint({x, y}, fix = false) {
  focalPoint.x = x;
  focalPoint.y = y;
  if (fix) {
    focalPoint.fx = x;
    focalPoint.fy = y;
  }
  document.documentElement.style.setProperty('--focal-x', x + 'px');
  document.documentElement.style.setProperty('--focal-y', y + 'px');
  window.spwashi.setItem('focalPoint', {x, y, fx: x, fy: y}, 'focal.root');
}

document.documentElement.style.setProperty('--focal-y-basis', document.documentElement.getBoundingClientRect().height + 'px');

export function attachFocalPointToElementPosition(button) {
  const x        = button.getBoundingClientRect().x;
  const y        = button.getBoundingClientRect().y;
  const w        = button.getBoundingClientRect().width;
  const h        = button.getBoundingClientRect().height;
  const focalX   = x + w;
  const focalY   = y + h;
  const notFixed = focalPoint.fx === undefined || focalPoint.fy === undefined;
  notFixed && setFocalPoint({x: focalX, y: focalY});
}