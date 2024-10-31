import { setDocumentMode } from "../modes";

let focalPointElement;

const focalPointMeta = {
    ready: true,
};

export const focalPoint = {
    x: 0,
    y: 0,
    queuedAction: () => {
        const mode = window.spwashi.getItem('mode', 'focal.root');
        setDocumentMode(mode);
    },
    onFocus: () => {},
};

function consentEngagement(timeout, onInterest, onRevoke) {
    focalPointElement.classList.add('consent-to-engage');

    const consent = { interested: null };
    const timer = setTimeout(() => {
        focalPointElement.classList.replace('consent-to-engage', 'consented-to-engage');
        consent.interested = true;
        if (onInterest) onInterest();
    }, timeout);

    consent.revoke = () => {
        clearTimeout(timer);
        focalPointElement.classList.remove('consented-to-engage', 'consent-to-engage');
        consent.interested = false;
        if (onRevoke) onRevoke();
    };

    return consent;
}

function onMouseDownHandler(e) {
    e.preventDefault();
    const consent = consentEngagement(100);

    const onMouseMove = (e) => {
        if (!consent.interested) return;
        e.preventDefault();
        updateFocalPoint({ x: e.x, y: e.y }, true);
    };

    const onMouseUp = (e) => {
        e.preventDefault();
        consent.revoke();
        focalPointMeta.ready = true;
        removeMouseHandlers(onMouseMove, onMouseUp);
    };

    document.documentElement.onmousemove = onMouseMove;
    document.documentElement.onmouseup = onMouseUp;
}

function onTouchStartHandler(e) {
    e.preventDefault();
    const consent = consentEngagement(300);

    const onTouchMove = (e) => {
        if (!consent.interested) return;
        e.preventDefault();
        updateFocalPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY }, true);
    };

    const onTouchEnd = (e) => {
        e.preventDefault();
        if (!consent.interested) focalPointMeta.ready = true;
        consent.revoke();
        removeTouchHandlers(onTouchMove, onTouchEnd);
    };

    document.documentElement.ontouchmove = onTouchMove;
    document.documentElement.ontouchend = onTouchEnd;
}

function removeMouseHandlers(onMouseMove, onMouseUp) {
    document.documentElement.onmousemove = null;
    document.documentElement.onmouseup = null;
}

function removeTouchHandlers(onTouchMove, onTouchEnd) {
    document.documentElement.ontouchmove = null;
    document.documentElement.ontouchend = null;
}

export function initFocalSquare() {
    if (!focalPointElement) {
        focalPointElement = document.querySelector('#focal-square');
        if (!focalPointElement) return;

        const prevFocalPoint = window.spwashi.getItem('focalPoint', 'focal.root');
        if (prevFocalPoint) updateFocalPoint(prevFocalPoint, true);

        focalPointElement.onmousedown = onMouseDownHandler;
        focalPointElement.ontouchstart = onTouchStartHandler;
        focalPointElement.onclick = () => {
            if (!focalPointMeta.ready) return;
            focalPoint.queuedAction();
        };
        focalPointElement.onfocus = () => focalPoint.onFocus();
    }
}

export function updateFocalPoint({ x, y }, fix = false) {
    focalPoint.x = x;
    focalPoint.y = y;
    if (fix) {
        focalPoint.fx = x;
        focalPoint.fy = y;
    }
    document.documentElement.style.setProperty('--focal-x', `${x}px`);
    document.documentElement.style.setProperty('--focal-y', `${y}px`);
    window.spwashi.setItem('focalPoint', { x, y, fx: x, fy: y }, 'focal.root');
}

export function attachFocalPointToElementPosition(element) {
    const { x, y, width, height } = element.getBoundingClientRect();
    const focalX = x + width;
    const focalY = y + height;
    if (focalPoint.fx === undefined || focalPoint.fy === undefined) {
        updateFocalPoint({ x: focalX, y: focalY });
    }
}
