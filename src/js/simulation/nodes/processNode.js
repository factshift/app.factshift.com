import md5                      from "md5";
import {getDocumentDataIndex}   from "../../modes/mode-dataindex";
import {getNextUrlSearchParams} from "../../init/keystrokes";

function getLastKind(node) {
  return node.kind?.trim().split(' + ').reverse()[0];
}

function getFirstKind(node) {
  return node.kind?.split(' + ')[0];
}

function isOperator(node) {
  return node.kind.split(' + ').includes('operator');
}

export function processNode(node, i) {
  node.getUrl = () => {
    const urlParams = getNextUrlSearchParams();
    urlParams.set('title', node.identity);
    return `/identity/${node.md5}?${urlParams.toString()}`;
  };

  if (node.processed) return;
  node.processed = Date.now();
  if (!node.identity) return;
  const head = node.head;
  const body = node.body;
  const tail = node.tail;
  delete node.head;
  delete node.body;
  delete node.tail;
  node.parts = {head, body, tail};

  const fx       = window.spwashi.values.fx?.[i] || node.fx || undefined;
  const fy       = window.spwashi.values.fy?.[i] || node.fy || undefined;
  const r        = window.spwashi.values.r?.[i] || node.r || window.spwashi.parameters.nodes.radiusMultiplier || undefined;
  const fontSize = window.spwashi.values.text?.fontSize?.[i] || node.text?.fontSize || undefined;

  node.colorindex    = getDocumentDataIndex();
  node.fx            = fx;
  node.fy            = fy;
  node.r             = r;
  node.cr            = r * 2;
  node.text          = node.text || {};
  node.text.fontSize = fontSize;
  node.image         = node.image || {};
  node.image.r       = 100;
  node.image.offsetX = 0;
  node.image.offsetY = 0;
  node.md5           = node.identity && md5(node.identity);

  const edgeLeft   = 50;
  const edgeRight  = window.spwashi.parameters.width - 50;
  const edgeBottom = window.spwashi.parameters.height - 50;
  const quantY     = [50, 50 + edgeBottom / 4, 50 + edgeBottom / 2, 50 + 3 * edgeBottom / 4, edgeBottom];
  const quantX     = [50, 50 + edgeRight / 4, 50 + edgeRight / 2, 50 + 3 * edgeRight / 4, edgeRight];

  const rules = [
    [node => getFirstKind(node) === 'container', {text: {fontSize: 10}, fx: 100, y: 0, colorindex: 3}],

    [node => getLastKind(node) === 'nominal', {fx: undefined, r: 10}],

    [node => getLastKind(node) === 'phrasal', {fx: undefined}],

    [node => getLastKind(node) === 'binding', {fx: 100, r: 5}],

    [node => getLastKind(node) === 'ordinal', {fx: quantX[3], r: 5}],
    [node => getLastKind(node) === 'ordinal' && isOperator(node), {fx: 0, fy: 0}],

    [node => getLastKind(node) === 'conceptual.close' && isOperator(node), {fx: edgeRight, fy: quantY[0]}],
    [node => getLastKind(node) === 'essential.close' && isOperator(node), {fx: edgeRight, fy: quantY[1]}],
    [node => getLastKind(node) === 'structural.close' && isOperator(node), {fx: edgeRight, fy: quantY[2]}],
    [node => getLastKind(node) === 'locational.close' && isOperator(node), {fx: edgeRight, fy: quantY[3]}],

    [node => getLastKind(node) === 'conceptual.open' && isOperator(node), {fx: edgeLeft, fy: quantY[0]}],
    [node => getLastKind(node) === 'essential.open' && isOperator(node), {fx: edgeLeft, fy: quantY[1]}],
    [node => getLastKind(node) === 'structural.open' && isOperator(node), {fx: edgeLeft, fy: quantY[2]}],
    [node => getLastKind(node) === 'locational.open' && isOperator(node), {fx: edgeLeft, fy: quantY[3]}],
  ]

  rules.forEach(([condition, rule]) => {
    if (condition(node)) {
      Object.entries(rule).forEach(([key, value]) => {
        node[key] = value;
      })
    }
  })
}
