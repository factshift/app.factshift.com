import "../../styles/scss/main.scss";
import "../../styles/scss/_spwashi@.scss";
import {app}             from '../../js/main.js'
import {processSpwInput} from "../../js/modes/input/spw/process-spw-input";
import {mainLoop}        from "./loop/head";
import {gameState}       from "./state/state";
import "./env/augmentations";

const interval = 100;
const motion   = {charge: 1000}
const state    = gameState();

let canStart = false;
app().then(() => {
  processSpwInput(['box=0']);
  canStart = true;
});

setInterval(() => {
  const str = [
    new Date().toLocaleString(),
  ].join(' ');

  document.getElementById("timer").innerHTML = str;
  if (canStart) {
    mainLoop(interval, motion, state);
    canStart = false;
  }
}, 100);
