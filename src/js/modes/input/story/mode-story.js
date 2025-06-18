import {processNode}  from "../../../simulation/nodes/data/process";
import {NODE_MANAGER} from "../../../simulation/nodes/nodes";


import {extendMenu}            from "../spw/commands/extended-menu";
import {forEachNode, pushNode} from "../../../simulation/nodes/data/operate";

import {clearActiveNodes} from "../../../ui/hotkeys/handlers/clear-active-nodes";
import {loadParameters}   from "../../../bootstrap/parameters/read";

const clearFxFy = d => d.fx = d.fy = undefined;
const fixX      = (d, i) => d.fy = 75 * (i + 1);
const fixY      = (d, i) => d.fx = 75;


async function* loopOverTimeEntries(events) {
  for (let {delay, payload} of events) {
    await new Promise(r => setTimeout(r, delay));
    yield payload;
  }
}

async function executeEvents(events) {
  for await (const payload of loopOverTimeEntries(events)) {
    if (payload.effect) {
      payload.effect();
    }
    if (payload.params) {
      loadParameters(new URLSearchParams(payload.params));
    }
    if (payload.nodes) {
      const nodes = payload.nodes.map(processNode).map(NODE_MANAGER.normalize);
      pushNode(...nodes);
    }
    window.window.spwashi.reinit();
  }
}

function setParseField(value) {
  const parseField = document.querySelector('#spw-parse-field');
  parseField.value = value;
  parseField.focus();
  const index = parseField.value.indexOf('&');
  parseField.setSelectionRange(index, index + 1);
}

function deleteAllStories() {
  for (let key in stories) {
    if (stories.hasOwnProperty(key)) delete stories[key];
  }
}

function getPhrases() {
  return ['< & >', '( & )', '{ & }', '[ & ]',];
}

function getNames() {
  return ['context', 'topic', 'structure', 'status'];
}

const phrases = getPhrases();
const names   = getNames();

export function initializeStorySequence(reset = false) {
  deleteAllStories();
  const index = names.shift();

  if (!index || reset) {
    phrases.length = 0;
    names.length   = 0;
    phrases.push(...getPhrases());
    names.push(...getNames());
    initializeStorySequence();
    return
  }

  stories[index] = {
    params: {
      superpower: 'hyperlink',
    },
    events: [
      {delay: 300, payload: {params: {mode: 'spw'},}},
      {delay: 300, payload: {effect: () => setParseField(phrases.shift()),}},
      {delay: 300, payload: {effect: initializeStorySequence}}]
  };
  initializeStoryMode()
}

const stories = {};
initializeStorySequence();
stories.demo    = {
  params:   {
    width:         300,
    height:        500,
    superpower:    'hyperlink',
    velocityDecay: 0.9,
    center:        '150,250',
  },
  runStory: () => {
    const delay1 = 50;
    const delay2 = 300;
    const events =
            [
              {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 50, text: {fx: 75, fontSize: 30}, name: 'hello'}]},},
              {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 100, text: {fx: 75, fontSize: 30}, name: 'how'}]},},
              {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 150, text: {fx: 75, fontSize: 30}, name: 'are'}]},},
              {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 200, text: {fx: 75, fontSize: 30}, name: 'you'}]},},
              {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 250, text: {fx: 75, fontSize: 30}, name: 'doing'}]},},
              {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 300, text: {fx: 75, fontSize: 30}, name: 'today'}]},},
              {delay: delay2, payload: {params: {charge: 500}},},
              {delay: delay1, payload: {params: {charge: 0}},},
              {delay: delay1, payload: {effect: () => forEachNode((d, i) => (fixY(d, i), fixX(d, i)))},},
              {delay: 300, payload: {effect: () => clearActiveNodes()},},
              {delay: 100, payload: {params: {mode: 'spw'}}},
              {delay: 300, payload: {effect: () => setParseField('i am doing & today')}},
            ]
    executeEvents(events).then(console.log);
  }
};
stories.options = {
  events: [
    {delay: 300, payload: {params: {mode: 'spw'}}},
    {delay: 100, payload: {effect: () => setParseField(extendMenu)}},
    {
      delay: 1000, payload: {
        effect: () => {
          window.spwashi.keystrokeRevealOrder = 1;
        }
      }
    },
  ]
};
stories.boon    = {
  events: [
    {delay: 300, payload: {params: {mode: 'spw'}}},
    {delay: 300, payload: {effect: () => setParseField('boon')}},
  ]
};

function runStory(story) {
  loadParameters(new URLSearchParams(story.params));
  story.runStory && story.runStory();
  story.events && executeEvents(story.events);
}

export function initializeStoryMode() {
  const storyModeContainer = document.querySelector('#story-mode-container');
  if (!storyModeContainer) return;
  storyModeContainer.innerHTML = '';
  const buttonContainer        = document.createElement('div');
  buttonContainer.classList.add('button-container');
  storyModeContainer.appendChild(buttonContainer)
  Object.entries(stories).forEach(([title, story]) => {
    const button     = document.createElement('button');
    button.innerText = title;
    button.onclick   = () => {
      runStory(story);
    };
    buttonContainer.appendChild(button);
  });

  if (!window.spwashi) return;
  if (stories[window.spwashi.parameters.initialStory]) {
    runStory(stories[window.spwashi.parameters.initialStory]);
  }
}