export function linkStyle(searchParameters) {
  if (searchParameters.has('linkStyle')) {
    window.spwashi.parameters.links.linkPrev = searchParameters.get('linkStyle') === 'prev';
  } else {
    window.spwashi.parameters.links.linkPrev = 0;
  }
  return ['linkStyle', window.spwashi.parameters.links.linkPrev];
}