import {addHandler}             from "./addHandler";
import {atHandler}              from "./atHandler";
import {boxHandler}             from "./boxHandler";
import {chargeHandler}          from "./chargeHandler";
import {collisionRadiusHandler} from "./collisionRadiusHandler";
import {colorHandler}           from "./colorHandler";
import {fontSizeHandler}        from "./fontSizeHandler";
import {nameHandler}            from "./nameHandler";
import {nodeQueueHandler}       from "./nodeQueueHandler";
import {radiusHandler}          from "./radiusHandler";
import {sizeHandler}            from "./sizeHandler";
import {sortHandler}            from "./sortHandler";
import {superpowerHandler}      from "./superpowerHandler";
import {urlHandler}             from "./urlHandler";
import {velocityDecayHandler}   from "./velocityDecayHandler";
import {selectHandler}          from "./selectHandler";

export const patternsAndHandlers = {
  at:              atHandler,
  add:             addHandler,
  box:             boxHandler,
  charge:          chargeHandler,
  velocityDecay:   velocityDecayHandler,
  nodeQueue:       nodeQueueHandler,
  collisionRadius: collisionRadiusHandler,
  radius:          radiusHandler,
  superpower:      superpowerHandler,
  url:             urlHandler,
  color:           colorHandler,
  size:            sizeHandler,
  sort:            sortHandler,
  name:            nameHandler,
  fontSize:        fontSizeHandler,
  select:          selectHandler
};