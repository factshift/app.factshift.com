export function title(searchParameters) {
  if (searchParameters.get('title')) {
    document.title                         = searchParameters.get('title');
    document.querySelector('h1').innerText = searchParameters.get('title');
  }
  return ['title', document.title];
}