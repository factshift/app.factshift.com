export function registerComponent(tagName, componentClass) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, componentClass);
  }
}
