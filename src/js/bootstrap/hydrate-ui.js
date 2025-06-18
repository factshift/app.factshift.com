import {initFocalSquare} from "../ui/components/focal-point";
import {initH1} from "../ui/components/h1";
import {initUi} from "./ui";
import {initStreamContainer} from "../ui/components/stream-container";
import {initStreamConfig} from "../ui/components/stream-config";

export function hydrateUi(mode = window.spwashi.initialMode) {
  initFocalSquare();
  initH1();
  initUi(mode);
  initStreamContainer();
  initStreamConfig();
}
