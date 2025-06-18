import { initFocalSquare } from "../ui/components/focal-point";
import { initH1 } from "../ui/components/h1";
import { initUi } from "./ui";
import { initRegisteredComponents } from "../ui/component-registry";

export function hydrateUi(mode = window.spwashi.initialMode) {
  initFocalSquare();
  initH1();
  initUi(mode);
  initRegisteredComponents();
}

