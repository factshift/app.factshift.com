import {initPageImage} from "../../../../ui/components/page-image";

export function runClearPageImageCommand() {
  {
    window.spwashi.setItem('parameters.page-image', '');
    initPageImage();
    return;
  }
}