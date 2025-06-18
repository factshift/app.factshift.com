import {initFocalSquare} from "../ui/focal-point";
import {initH1} from "../ui/h1";
import {initUi} from "./ui";
import {initStreamContainer} from "../ui/stream-container";
import {initStreamConfig} from "../ui/stream-config";

export function hydrateUi(mode = window.spwashi.initialMode) {
  initFocalSquare();
  initH1();
  initUi(mode);
  initStreamContainer();
  initStreamConfig();
}
