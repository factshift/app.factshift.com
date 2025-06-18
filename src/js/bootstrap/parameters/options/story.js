export function story(searchParameters) {
    if (searchParameters.has('story')) {
      window.spwashi.parameters.initialStory = searchParameters.get('story');
    } else {
      window.spwashi.parameters.initialStory = undefined;
    }
    return ['story', window.spwashi.parameters.initialStory];
}