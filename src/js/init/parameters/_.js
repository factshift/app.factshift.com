import {alphaDecay}     from "./alphaDecay";
import {alphaTarget}    from "./alphaTarget";
import {alpha}          from "./alpha";
import {boundingBox}    from "./boundingBox";
import {centerStrength} from "./centerStrength";
import {center}         from "./center";
import {charge}         from "./charge";
import {dataindex}      from "./dataindex";
import {debug}          from "./debug";
import {defaultRadius}  from "./defaultRadius";
import {display}        from "./display";
import {doFetch}        from "./doFetch";
import {fontSize}       from "./fontSize";
import {fx}             from "./fx";
import {fy}             from "./fy";
import {height}         from "./height";
import {intent}         from "./intent";
import {linkStrength}   from "./linkStrength";
import {linkStyle}      from "./linkStyle";
import {mode}           from "./mode";
import {nodeQueue}      from "./nodeCount";
import {perspective}    from "./perspective";
import {r}              from "./r";
import {reset}          from "./reset";
import {size}           from "./size";
import {superpower}     from "./superpower";
import {title}          from "./title";
import {velocityDecay}  from "./velocityDecay";
import {width}          from "./width";
import {zoom}           from "./zoom";


export function initParameters() {
  window.spwashi.initialMode                       = window.spwashi.initialMode || null;
  window.spwashi.parameters                        = window.spwashi.parameters || {};
  window.spwashi.values                            = window.spwashi.values || {};
  window.spwashi.values.fy                         = [];
  window.spwashi.values.r                          = [];
  window.spwashi.values.text                       = window.spwashi.values.text || {}
  window.spwashi.values.text.fontSize              = window.spwashi.values.text.fontSize || [];
  window.spwashi.superpower                        = window.spwashi.superpower || {name: 'hyperlink', intent: 1};
  window.spwashi.parameters.links                  = window.spwashi.parameters.links || {};
  window.spwashi.parameters.forces                 = window.spwashi.parameters.forces || {};
  window.spwashi.parameters                        = window.spwashi.parameters || {};
  window.spwashi.parameters.debug                  = false;
  window.spwashi.parameters.perspective            = window.spwashi.parameters.perspective || undefined;
  window.spwashi.parameters.dataIndex              = window.spwashi.parameters.dataIndex || null;
  window.spwashi.parameters.width                  = window.spwashi.parameters.width || window.innerWidth * .9;
  window.spwashi.parameters.height                 = window.spwashi.parameters.height || window.innerHeight * .9;
  window.spwashi.parameters.startPos               = window.spwashi.parameters.startPos || {};
  window.spwashi.parameters.startPos.x             = window.spwashi.parameters.startPos.x || window.spwashi.parameters.width / 2;
  window.spwashi.parameters.startPos.y             = window.spwashi.parameters.startPos.y || window.spwashi.parameters.height / 2;
  window.spwashi.parameters.links                  = window.spwashi.parameters.links || {};
  window.spwashi.parameters.links.strength         = window.spwashi.parameters.links.strength || .1;
  window.spwashi.parameters.nodes                  = window.spwashi.parameters.nodes || {};
  window.spwashi.parameters.nodes.count            = window.spwashi.parameters.nodes.count || 13;
  window.spwashi.parameters.nodes.radiusMultiplier = window.spwashi.parameters.nodes.radiusMultiplier || 30;
  window.spwashi.parameters.forces                 = window.spwashi.parameters.forces || {};
  window.spwashi.parameters.forces.alpha           = window.spwashi.parameters.forces.alpha || 1;
  window.spwashi.parameters.forces.alphaTarget     = window.spwashi.parameters.forces.alphaTarget || .3;
  window.spwashi.parameters.forces.alphaDecay      = window.spwashi.parameters.forces.alphaDecay || .03;
  window.spwashi.parameters.forces.velocityDecay   = window.spwashi.parameters.forces.velocityDecay || .91;
  window.spwashi.parameters.forces.charge          = window.spwashi.parameters.forces.charge || 10;
  window.spwashi.parameters.forces.centerStrength  = window.spwashi.parameters.forces.centerStrength || 1;
  window.spwashi.parameters.forces.boundingBox     = typeof window.spwashi.parameters.forces.boundingBox !== 'undefined' ? window.spwashi.parameters.forces.boundingBox : true;
  window.spwashi.parameters.forces.centerPos       = window.spwashi.parameters.forces.centerPos || {};
  window.spwashi.parameters.forces.centerPos.x     = window.spwashi.parameters.forces.centerPos.x || window.spwashi.parameters.startPos.x;
  window.spwashi.parameters.forces.centerPos.y     = window.spwashi.parameters.forces.centerPos.y || window.spwashi.parameters.startPos.y;
}

export function readParameters(searchParameters) {
  window.spwashi.featuredIdentity = /\/identity\/([a-zA-Z\d]+)/.exec(window.location.href)?.[1] || searchParameters.get('identity');
  window.spwashi.parameterKey     = `spwashi.parameters#${window.spwashi.featuredIdentity}`;

  [
    alphaDecay,
    alphaTarget,
    alpha,
    boundingBox,
    centerStrength,
    center,
    charge,
    dataindex,
    debug,
    defaultRadius,
    display,
    doFetch,
    fontSize,
    fx,
    fy,
    height,
    intent,
    linkStrength,
    linkStyle,
    mode,
    nodeQueue,
    perspective,
    r,
    reset,
    size,
    superpower,
    title,
    velocityDecay,
    width,
    zoom
  ]
    .forEach(fn => fn(searchParameters));
}